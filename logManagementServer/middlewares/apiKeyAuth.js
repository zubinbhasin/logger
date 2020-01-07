const Server = require('../app/models/server')
module.exports = async (req, res, next) => {
  var key;
  if (req.body && req.body.apiKey) {
    const credentials = req.body.apiKey;
    key = credentials;
  }else if(req.query && req.query.apiKey){
    const credentials = req.query.apiKey;
    key = credentials;
  }else{
    return res.status(403).json({
      success: 0,
      resMessage: 'ACCESS DENIED !! You are not authorize to access this Resource',
    });
  }
  let data = await Server.findOne({apiKey:key})
        if(!data || !data.isActive){
        return res.status(401).json({
          success: 0,
          resMessage: 'The apiKey is not valid',
        });
      }else {
        req.body.serverId = data._id;
        req.body.serverUid = data.uid;
        next();
      }
};
