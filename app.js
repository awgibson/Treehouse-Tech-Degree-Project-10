// Dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override'); //Overrides form methods
const { sequelize } = require('./models');

// Bring in routes
const routes = require('./routes/index');
const books = require('./routes/books');

// Set port
const port = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'pug');

// Body parser and method override enabled
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set the routes
app.use('/public', express.static('public')); //Static route
app.use('/', routes); //Index route
app.use('/books', books); //Books route

// Error handling
// Gets any request not specified above and creates a 404 error. Error is then passed
// to the global error handler at the end of the chain
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

// Global error handler.
// If it is a 404 error, the not found page will be rendered.
// All other errors are assigned a 500 error and the error template is rendered instead.
app.use((err, req, res, next) => {
  if (err.statusCode === 404) {
    res.render('page_not_found', { err, title: 'Page Not Found' }); //render the error template and pass the error to it
  } else {
    err.statusCode = 500;
    err.message = 'Sorry! There was an unexpected error on the server.';
    res.render('error', { err, title: 'Server Error' }); //render the error template and pass the error to it
  }
});

// Syncs the database then starts the server.
sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
