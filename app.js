const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const { sequelize, Book } = require('./models');
const port = 3000;

app.use('/public', express.static('public'));

app.set('view engine', 'pug');

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.redirect('/books');
});

app.get('/books', (req, res) => {
  Book.findAll({ order: [['title', 'ASC']] }).then(books => {
    res.render('index', { books: books, title: 'Books' });
  });
});

app.post('/books/new', (req, res) => {
  Book.create(req.body).then(book => {
    res.redirect('/books/' + book.id);
  });
});

app.get('/books/new', (req, res) => {
  res.render('new_book', { book: {}, title: 'Create New Book' });
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

/* DELETE individual article. */
app.delete('/books/:id/delete', (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => {
      return book.destroy();
    })
    .then(() => {
      res.redirect('/books');
    })
    .catch(err => {
      next();
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
