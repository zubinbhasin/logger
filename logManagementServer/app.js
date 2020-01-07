
const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express();
const server = require('http').Server(app);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swaggerDocument.json');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Bootstrap = require('./app/utils/bootstrap.js');
var options = {
  explorer: true
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

mongoose.Promise = global.Promise;
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '200mb' }));
app.use(expressValidator());
app.set('port', process.env.PORT);

mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', function (err) {
  console.log(err);
  console.log('error in connecting, process is exiting ...');
  process.exit();
})
mongoose.connection.once('open', function () {
  console.log('Successfully connected to database');
});

app.get('/', function (request, response) {
  response.status(200).json({ "msg": "success" });
});


require('./app/routes/route.js')(app);


Bootstrap.bootstrapAdmin(function (err, message) {
  if (err) {
    console.log('Error while bootstrapping admin : ' + err)
  } else {
    console.log(message);
  }
});


server.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});




