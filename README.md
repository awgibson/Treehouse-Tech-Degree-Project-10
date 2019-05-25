#Treehouse Full Stack Tech Degree Project 10
---
##Build a Library Manager

You've been tasked with creating an application for your local library to help them manage their collection of books. The librarian has been using a simple SQLite database and has been entering data in manually. The librarian wants a more intuitive way to manage the library's collection of books.

In this project, you'll build a web application that'll include pages to list, add, update, and delete books. You'll be given HTML designs and an existing SQLite database. You'll be required to implement a dynamic website using JavaScript, Node.js, Express, Pug, and the SQL ORM Sequelize.

------
###What I've Completed
I shot for the exceeds expectations requirements.

For the routes, I used DELETE for delete books and PUT for update books instead of POST as shown in the project guidelines.

I also broke my routes out into the ./routes subdirectory instead of leaving everything in app.js

There are two databases in my project.  
  * library.db is the original database and is used in the config file as the production database
  * dev.db is used in the development environment and contains extra books I added for testing. 

----
##Requirements

* **Setup and Initialize Project**
  * The .gitignore file is in place and the node_modules folder is not stored in the repo.
  * Running npm install adds all necessary dependencies.
  * Running npm start launches the app.

* **Models**
  * Project includes the following Sequelize Model and properties:
    - Book
      * title - string
      * author - string
      * genre - string
      * year - integer
  * Uses the appropriate Model validation to ensure that the title and author properties will have values when the form is submitted.

* **Routes**
  * Project contains the following routes:
    * / - get
    * /books - get
    * /books/new - get
    * /books/new - post
    * /books/:id - get
    * /books/:id - post
    * /books/:id/delete - post
  * Exceeds Expectations 
    * Main book list has search feature.
    * Search works for all of the following fields:
      * Title
      * Author
      * Genre
      * Year
    * Search is case insensitive.
    * Search works for partial matches on strings.
    * Main book list has pagination feature.

* **Form Fields**
  * If title or author fields are empty, form will not submit and page shows friendly error message.
  * Forms employ Sequelize Model validation rather than HTML’s built in validation.
  * Clicking on an input’s label brings focus to corresponding input.

* **Errors**
  * If routing to a non-existent book id, project uses a global error handler to render a friendly error page.
  * If navigating to a non-existent route like /error, the project renders a user friendly "Page Not Found" page.

* **Style and Layout**
  * Project uses supplied styles.
  * General layout matches example markup page