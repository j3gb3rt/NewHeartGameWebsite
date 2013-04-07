var fs = require('fs');
var express = require('express');
var app = express();
var db_handler = require('./database');
var configuration = require('./config');
var routers = require('./routers');

var DEVELOPMENT = 'dev';
var environment = DEVELOPMENT;
app.use(express.favicon(__dirname + '/assets/images/favicon.ico'));
app.use(express.bodyParser());
app.use(express.cookieParser());
if(environment == DEVELOPMENT){
	app.use(express.logger({stream: fs.createWriteStream('./dev-debug.log', {flags: 'a'})}));
}
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
