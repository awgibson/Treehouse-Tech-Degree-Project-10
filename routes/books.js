const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// List all books
router.get('/', (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 8;
  const offset = limit * (page - 1);

  Book.findAndCountAll().then(data => {
    const pages = Math.ceil(data.count / limit);

    Book.findAll({
      order: [['title', 'ASC']],
      limit: limit,
      offset: offset
    })
      .then(books => {
        if (page <= pages) {
          res.render('index', {
            books,
            title: 'Books',
            pages,
            currentPage: page
          });
        } else {
          next(err);
        }
      })
      .catch(err => next(err));
  });
});

// Search
router.get('/search', (req, res, next) => {
  const { search } = req.query;

  if (search === '') {
    res.redirect('/books');
  } else {
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
        res.render('index', {
          books: books,
          title: 'Books',
          totalResults: books.length
        });
      })
      .catch(err => next(err));
  }
});

// Post new book
router.post('/new', (req, res, next) => {
  Book.create(req.body)
    .then(book => {
      res.redirect('/books/' + book.id);
    })
    .catch(err => {
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

// View new book form
router.get('/new', (req, res) => {
  res.render('new_book', { book: {}, title: 'Create New Book' });
});

// Handles routing for books by IDs
router.get('/:id', (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => {
      if (book != null) {
        res.render('update_book', { book: book, title: 'Update Book' });
      } else {
        next(new Error('Server Error'));
      }
    })
    .catch(err => next(err));
});

// Edit book
router.put('/:id', (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => {
      return book.update(req.body);
    })
    .then(book => {
      res.redirect('/books/' + book.id);
    })
    .catch(err => {
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

// Deletes article
router.delete('/:id/delete', (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => {
      return book.destroy();
    })
    .then(() => {
      res.redirect('/books');
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
