var Models = require('../models/admin.js');

var getAdmin = function (criteria, projection, options, callback) {
    Models.find(criteria, projection, options, callback);
};

var createAdmin = function (objToSave, callback) {
    new Models(objToSave).save(callback)
};

module.exports = {
    getAdmin: getAdmin,
    createAdmin: createAdmin,
};
