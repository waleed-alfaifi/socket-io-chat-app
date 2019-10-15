const User = require('../models/User');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

exports.socket = (socket, next) => {
  const { query } = socket.handshake;

  if (!query || !query.token) {
    return next(createError(401, 'Authorization failed'));
  }

  jwt.verify(
    query.token,
    process.env.JWT_SECRET || 'secret for local testing',
    (error, decoded) => {
      if (error) {
        return next(createError(401, 'Authorization failed'));
      }

      User.findById(decoded.id)
        .select('-pw')
        .then(user => {
          if (!user) {
            return next(createError(401, 'Authorization failed'));
          }

          socket.user = user;
          next();
        })
        .catch(error => next(error));
    }
  );
};

exports.authenticated = (req, res, next) => {
  let token = req.headers['authorization'];
  jwt.verify(
    token,
    process.env.JWT_SECRET || 'secret for local testing',
    (err, decoded) => {
      if (err) return next(createError(401));
      User.findById(decoded.id)
        .then(user => {
          if (!user) throw createError(401);
          req.user = user;
          next();
        })
        .catch(next);
    }
  );
};
