const express = require('express');
const router = express.Router();

// Root route
router.get('/', (req, res) => {
  res.redirect('/books');
});

module.exports = router;
