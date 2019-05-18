const express = require('express');
const app = express();
const { sequelize } = require('./models');
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
