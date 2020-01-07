var express = require('express')
require('dotenv').config()
var app = express()
var bodyParser = require('body-parser')
var logger = require('./middleware/log').logger //<========= our log management middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(logger);                     //<========= our log management middleware
app.get('/', function (req, res) { res.send('hello world') })
app.post('/', function (req, res) {
    res.status(500).send("Success");
})
app.listen(8080);
console.log("Running on port 8080");