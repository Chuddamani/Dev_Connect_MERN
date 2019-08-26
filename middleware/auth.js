const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  //Get the token header
  const token = req.header('x-auth-token');

  //Check if no Token
  if (!token) {
    return res.status(401).json({ msg: 'No Token , authorization denied' });
  }

  //verify Token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();
  } catch (error) {
    console.log(error.msg);
    return res
      .status(401)
      .json({ msg: 'Invalid Token , authorization denied' });
  }
};
