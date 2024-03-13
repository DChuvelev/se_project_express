require('dotenv').config();

const { PORT = 3001 } = process.env;
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const {login, createUser} = require('./controllers/users');
const { validateCreateUserData, validateLoginData } = require('./middleware/validation');
const { requestLogger, errorLogger } = require('./middleware/logger');

const app = express();
app.use(helmet());
app.use(cors());

console.log(`The app is runnung in ${process.env.NODE_ENV} mode.`);
mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(bodyParser.json());

app.use(requestLogger);

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Server will crash now');
//   }, 0);
// });

app.post('/signin', validateLoginData, login);
app.post('/signup', validateCreateUserData, createUser);
app.use('/', routes);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  console.log(`${err.message}. Error status: ${err.status}`);
  const {status = 500, message} = err;
  res.status(status).send({
    message: status === 500 ? 'Internal server error' : message
  });
})

app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}`);
})