
const async = require('async');
var Service = require('../services/adminService.js');

exports.bootstrapAdmin = function (callback) {


    var adminData1 = {
        email: 'admin@gmail.com',
        password: '25f9e794323b453885f5181f1b624d0b',
        name: 'admin',
    };

    async.parallel([
        function (cb) {
            insertData(adminData1.email, adminData1, cb)
        }
    ], function (err, done) {
        callback(err, 'Bootstrapping finished');
    })
};

function insertData(email, adminData, callback) {
    var needToCreate = true;
    async.series([function (cb) {
        var criteria = {
            email: email
        };
        Service.getAdmin(criteria, {}, {}, function (err, data) {
            if (data && data.length > 0) {
                needToCreate = false;
            }
            cb()
        })
    }, function (cb) {
        if (needToCreate) {
            Service.createAdmin(adminData, function (err, data) {
                cb(err, data)
            })
        } else {
            cb();
        }
    }], function (err, data) {
        console.log('Bootstrapping finished for ' + email);
        callback(err, 'Bootstrapping finished')
    })
}
