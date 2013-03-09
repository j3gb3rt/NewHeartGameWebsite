var express = require('express');
var app = express();
var db_handler = require('./database.js');
var configuration = require('./config/configuration.js');

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