// Dependencies
const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// GET for /books and displays all books
router.get('/', (req, res, next) => {
  // Setup pagination related variables
  const page = parseInt(req.query.page) || 1; // Grabs a query or sets the current page to 1 if there is none
  const limit = 8; //Set how many entries are listed per page
  const offset = limit * (page - 1); //Formula to set the offset (start of current page of books)

  // First, count the total number of books
  Book.findAndCountAll().then(data => {
    // Create a variable within this scope for total number of pages there should be
    const pages = Math.ceil(data.count / limit);

    // Query to find all books by specified limit and offset and order by the title [A-Z]
    Book.findAll({
      order: [['title', 'ASC']],
      limit: limit,
      offset: offset
    })
      .then(books => {
        // Conditional to check if the current page of books requested
        // exists. If so, the page is rendered displaying the current page of books.
        // If the page does not exist, an error is passed with next() to be caught
        // by the error handler.
        if (page <= pages) {
          res.render('index', {
            books,
            title: 'Books',
            pages,
            currentPage: page
          });
        } else {
          next(err); // Handles errors if page does not exist
        }
      })
      .catch(err => next(err)); // Handle errors with issues querying
  });
});

// GET /search route
router.get('/search', (req, res, next) => {
  // Grabs the search query sent by the search form
  const { search } = req.query;

  // If there is no search query, redirects to display all
  // books so the user isn't presented with a blank page
  if (search === '') {
    res.redirect('/books');
  } else {
    // Find all query that finds partial, case insensitive searches for all strings.
    // The year only returns exact matches.
    Book.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${search}%`
            }
          },
          {
            author: {
              [Op.like]: `%${search}%`
            }
          },
          {
            genre: {
              [Op.like]: `%${search}%`
            }
          },
          {
            year: search
          }
        ]
      }
    })
      .then(books => {
        // After promise is received, index template is rendered passing in the books
        // The total amount of books from the search results is sent to the template as well
        // so that a message can be displayed if there are no books from the search.
        res.render('index', {
          books,
          title: 'Books',
          totalResults: books.length
        });
      })
      .catch(err => next(err));
  }
});

// POST /new route
router.post('/new', (req, res, next) => {
  // Query to create a new book by parsing the form data
  // from the create books template
  Book.create(req.body)
    .then(book => {
      // After book is created, redirects to the page containing the new book
      res.redirect('/books/' + book.id);
    })
    .catch(err => {
      // Checks if there is a sequelize validation error
      // If there is one, the new book template will be
      // rendered again, filling in the valid form entries
      // and will display an error on the page if the
      // book title or author is missing.
      if (err.name === 'SequelizeValidationError') {
        res.render('new_book', {
          book: { ...req.body },
          title: 'Create New Book',
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(err => next(err));
});

// GET /new route. Handles route for creating a new book entry
router.get('/new', (req, res) => {
  res.render('new_book', { book: {}, title: 'Create New Book' });
});

// GET for books by ID
router.get('/:id', (req, res, next) => {
  // Queries database by the ID of the book
  // The ID is pulled from the url params
  Book.findByPk(req.params.id)
    .then(book => {
      // Conditional to make sure there actually is a book with the ID before rendering
      if (book != null) {
        res.render('update_book', { book, title: 'Update Book' });
      } else {
        next(new Error('Server Error'));
      }
    })
    .catch(err => next(err));
});

// PUT route for editing a book
// Directions say to use POST but I chose PUT after reading that a
// PUT route should be used for updating something that already exists
router.put('/:id', (req, res, next) => {
  // Queries database with the id supplied in the params
  Book.findByPk(req.params.id)
    .then(book => {
      // Calls the update function using the information entered in the forms
      return book.update(req.body);
    })
    .then(book => {
      // Redirects to the same book page
      res.redirect('/books/' + book.id);
    })
    .catch(err => {
      // Checks if there is a sequelize validation error
      // If there is one, the new book template will be
      // rendered again, filling in the valid form entries
      // and will display an error on the page if the
      // book title or author is missing.
      if (err.name === 'SequelizeValidationError') {
        res.render('update_book', {
          book: { ...req.body, id: req.params.id },
          title: 'Update Book',
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(err => next(err));
});

// DELETE book route
// Instructions say to use a POST route but I used a DELETE route
router.delete('/:id/delete', (req, res, next) => {
  // Query to find the book based on the ID params
  Book.findByPk(req.params.id)
    .then(book => {
      // Book is deleted
      return book.destroy();
    })
    .then(() => {
      // Redirects to the first all books page
      res.redirect('/books');
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
