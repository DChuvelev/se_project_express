const { PORT = 3001 } = process.env;
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const routes = require('./routes/index');
const {login, createUser} = require('./controllers/users');


const app = express();
app.use(helmet());
app.use(cors());

console.log('Hi, everyone!');
mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}`);
})