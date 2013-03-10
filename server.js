var express = require('express');
var app = express();
var db_handler = require('./database/database.js');
var configuration = require('./config/configuration.js');

/*db_handler.create_user('bob', 'asdf@sdf.com', 'apples', function(err, res){
	if(err){
		console.log(err);
	} else {
		console.log(res);
	}
});*/

db_handler.query('select * from users', function(err, res){
	if(err){
		console.log(err);
	} else {

		console.log(res);	
	}
});

app.set('views', __dirname + '/views');
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req, res){
	res.render('index.jade');
});

app.get('/login', function(req, res){
	res.render('login.jade');
});

app.get('/signup', function(req, res){
	res.render('signup.jade');
});


app.listen(3000);