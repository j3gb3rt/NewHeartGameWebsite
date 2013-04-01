var express = require('express');
var app = express();
var db_handler = require('./database');
var configuration = require('./config');
var routers = require('./routers');

app.use(express.bodyParser());
app.use(express.cookieParser());
app.set('dir', __dirname);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000)

app.use(app.router);
app.use('/assets', express.static(__dirname + '/assets'));

routers.route(app, db_handler);

app.listen(app.get('port'), function() {
  console.log("Listening on " + app.get('port'));
});