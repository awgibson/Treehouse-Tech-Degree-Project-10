const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const { sequelize, Book } = require('./models');
const port = 1337;

app.use('/public', express.static('public'));

app.set('view engine', 'pug');

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded
app.use(methodOverride('_method'));

// Root route
app.get('/', (req, res) => {
  res.redirect('/books');
});

// List all books
app.get('/books', (req, res) => {
  Book.findAll({ order: [['title', 'ASC']] })
    .then(books => {
      res.render('index', { books: books, title: 'Books' });
    })
    .catch(err => next(err));
});

// Post new book
app.post('/books/new', (req, res) => {
  Book.create(req.body)
    .then(book => {
      res.redirect('/books/' + book.id);
    })
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {
        console.log(err);
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
app.get('/books/new', (req, res) => {
  res.render('new_book', { book: {}, title: 'Create New Book' });
});

// Handles routing for books by IDs
app.get('/books/:id', (req, res, next) => {
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
app.put('/books/:id', (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => {
      return book.update(req.body);
    })
    .then(book => {
      res.redirect('/books/' + book.id);
    })
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {
        console.log(req.body);
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
app.delete('/books/:id/delete', (req, res, next) => {
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

//Gets any request not specified above and creates a 404 error. The error is passed to 'next' which then hits then
//hits the error middleware.
app.get('*', (req, res, next) => {
  const err = new Error(
    `Sorry! We couldn't find the page you were looking for located at '${
      req.protocol
    }://${req.get('host')}${req.originalUrl}'.
    `
  );
  err.statusCode = 404;
  next(err);
});

//Handles all errors. Anything sent from the get '*' route will throw a 404 error. All other errors will have a
//500 server side error. The error is logged to the console with a friendly message then passed along to the error.pug template.
app.use((err, req, res, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
    err.message = 'Sorry! There was an unexpected error on the server.';
  }

  if (err.statusCode === 404) {
    res.render('page_not_found', { err, title: 'Page Not Found' }); //render the error template and pass the error to it
  } else {
    res.render('error', { err, title: 'Server Error' }); //render the error template and pass the error to it
  }
});

sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
