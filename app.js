const { PORT = 3001 } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const helmet = require('helmet');

const app = express();
app.use(helmet());

console.log('Hi, everyone!');
mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '659a6c971e2a719227ea06ed'
  };
  next();
});

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}`);
})