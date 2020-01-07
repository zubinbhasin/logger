const authentication = require('../../middlewares/jwtTokenAdmin');
const serverAuth = require('../../middlewares/apiKeyAuth');
module.exports=function(app){
    const admin=require('../controllers/controller.js');
    app.post('/loginAdmin',admin.loginAdmin);
    app.post('/addServer',authentication,admin.addServer);
    app.post('/enableOrDisableAccess',authentication,admin.enableOrDisableAccess);
    app.post('/sendLog',serverAuth,admin.sendLog);
    app.get('/getLogs',serverAuth,admin.getLogs);
}