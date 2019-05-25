const express = require('express');
const router = express.Router();

// Root route that redirects to /books
router.get('/', (req, res) => {
  res.redirect('/books');
});

module.exports = router;
