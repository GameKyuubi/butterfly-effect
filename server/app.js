const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const api = require('./routes/api');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', api);

// catch 404 error
app.use((req, res) => {
  res.json({ type: 'error', status: 404, message: 'Page Not Found' });
});

module.exports = app;
