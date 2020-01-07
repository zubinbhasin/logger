
require('dotenv').config()
const request = require('request')

exports.logger = (req, res, next) => {
    let oldWrite = res.write, oldEnd = res.end;
    let chunks = [];
    res.write = function (chunk) {
        chunks.push(chunk);
        oldWrite.apply(res, arguments);
    };
    res.end = function (chunk) {
        let body;
        if (chunk && typeof chunk == 'object') {
            chunks.push(chunk);
            body = Buffer.concat(chunks).toString('utf8');
        } else if (chunk && typeof chunk == 'string') {
            body = chunk.trim().replace(/<\/?[^>]+(>|$)|\n|&nbsp;/g, "");
        }
        let loggerObject = {
            apiKey: process.env.LOGGER_KEY,
            time: new Date().getTime(),
            fromIP: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            method: req.method,
            requestData: req.body,
            responseData: body,
            referer: req.headers.referer || '',
            userAgent: req.headers['user-agent'],
            statusCode: res.statusCode,
            status: res.statusCode == 200 ? "SUCCESS" : res.statusCode == 400 ? "BAD REQUEST" : res.statusCode == 401 ? "UNAUTHORIZED" : res.statusCode == 500 ? "ERROR" : res.statusCode == 404 ? "NOT FOUND" : "OTHER",
            path: req.path,
            host: req.hostname
        };
        oldEnd.apply(res, arguments);
        request.post(process.env.LOGGER_URL, {
            json: loggerObject
        }, (error, res, body) => {
            if (error) {
                console.error(error)
                return
            }
            console.log(res.statusMessage)
        })
    }; next();
}

