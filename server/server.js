const path = require('path');
const express = require('express');
const cors = require('cors');
const logger = require('morgan');

const app = express();

require('./config/socket-handler');
require('dotenv').config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/account', require('./routes/api/account'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.use(express.static(path.join(__dirname, '../public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'build', 'index.html'));
  });
}

// Middleware for handling errors.
app.use((error, req, res, next) => {
  res
    .status(error.status || 500)
    .json({ error: error.message || 'حدث خطأ ما أثناء معالجة طلبك.' });
});

require('./config/db');
const server = app.listen(process.env.PORT || 5000, () =>
  console.log('Server running...')
);
io.attach(server);
