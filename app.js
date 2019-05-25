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
const port = 3000;

// Set view engine
app.set('view engine', 'pug');

// Body parser and method override enabled
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set the routes
app.use('/public', express.static('public'));
app.use('/', routes);
app.use('/books', books);

//Error handling
//Gets any request not specified above and creates a 404 error. The error is passed to 'next' which then
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
  if (err.statusCode === 404) {
    res.render('page_not_found', { err, title: 'Page Not Found' }); //render the error template and pass the error to it
  } else {
    err.statusCode = 500;
    err.message = 'Sorry! There was an unexpected error on the server.';
    res.render('error', { err, title: 'Server Error' }); //render the error template and pass the error to it
  }
});

sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
