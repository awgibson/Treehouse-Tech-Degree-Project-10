const express = require('express');
const app = express();

const { sequelize, Book } = require('./models');
const port = 3000;

app.use('/public', express.static('public'));

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.redirect('/books');
});

app.get('/books', (req, res) => {
  Book.findAll({ order: [['title', 'ASC']] }).then(books => {
    res.render('index', { books: books, title: 'Books' });
  });
});

app.get('/books/new', (req, res) => {
  res.render('new_book', { title: 'Create New Book' });
});

// Handles routing for books by IDs
app.get('/books/:id', (req, res, next) => {
  Book.findByPk(req.params.id).then(book => {
    if (book != null) {
      res.render('book_detail', { book: book, title: book.title });
    } else {
      next();
    }
  });
});

app.get('*', function(req, res, next) {
  const err = new Error(
    `Page requested at '${req.protocol}://${req.get('host')}${
      req.originalUrl
    }' does not exist.`
  );
  err.statusCode = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  if (!err.statusCode) {
    err.statusCode = 500;
    err.message = 'There was an internal server error requesting the resource.';
  } // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.render('error', { err, title: err.statusCode }); //render the error template and pass the error to it
});

sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
