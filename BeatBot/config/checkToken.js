// config/checkToken.js
import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  let token = req.get('Authorization');
  if (!token) {
    req.user = null;
    return next();
  }
  token = token.split(' ')[1];

 // config/checkToken.js
jwt.verify(token, process.env.SECRET, (err, decoded) => {
  if (err) { req.user = null; req.exp = null; return next(); }
  req.user = { _id: decoded.sub, email: decoded.email, name: decoded.name };
  req.exp = new Date(decoded.exp * 1000);
  return next();
});
};