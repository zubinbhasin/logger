const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  var token;
  if (req.headers && req.headers.authorization) {
    const credentials = req.headers.authorization;
    token = credentials;
  }else {
    return res.status(403).json({
      success: 0,
      resMessage: 'ACCESS DENIED !! You are not authorize to access this Resource',
    });
  }

  jwt.verify(token,process.env.JWT_SECRET, (err, token) => {
    if (err) {
      return res.status(401).json({
        success: 0,
        resMessage: 'The token is not valid',
      });
    }else {
      req.token = token;
      next();
    }
  });
};
