const jwt = require('jsonwebtoken');

function jwtMiddleware(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    console.error('no token provided')
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'jwtsecret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: err });
    }

    req.userId = decoded.userId;
    next();
  });
}

module.exports = jwtMiddleware;