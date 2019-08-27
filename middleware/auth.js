const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  //Get the token header
  const token = req.header('x-auth-token');

  //Check if no Token
  if (!token) {
    return res.status(401).json({ msg: 'No Token , authorization denied' });
  }

  //verify Token : token has the "payload" as well as the "signature". here what is done is ,
  //jwt takes the payload (from token) and jwtSecret(we provide) ,
  //then again geretates the Signature
  // Finally matches the Signatures
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
