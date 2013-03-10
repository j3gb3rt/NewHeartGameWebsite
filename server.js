var express = require('express');
var app = express();
var db_handler = require('./database/database.js');
var configuration = require('./config/configuration.js');

app.use(express.bodyParser());
app.use(express.cookieParser());

app.set('views', __dirname + '/views');
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req, res){
	res.render('index.jade');
});

app.get('/login', function(req, res){
	db_handler.retrieve_user(req.cookies.email, req.cookies.session_token, function(err, result){
		if(err){
			res.render('login.jade');
		} else {
			res.render('login.jade');
			//res.redirect('/map');
		}
	});
});

function set_user_session(res, email, session_token){
	res.cookie('session_token', session_token, { maxAge: 3600000*24*365});
	res.cookie('email', email, { maxAge: 3600000*24*365});
}

app.post('/login', function(req, res){
	db_handler.verify_login(req.body.email, req.body.password, function(err, result){
		if(err){
			res.redirect('/login');
		} else{
			set_user_session(res, req.body.email, result.session_token);
			res.redirect('/map');
		}
	});
});


app.get('/signup', function(req, res){
	res.render('signup.jade');
});

app.post('/signup', function(req, res) {
	db_handler.create_user(req.body.username, req.body.email, req.body.password, function(err, result){
		if(err){
			res.redirect('/signup');
		} else {
			db_handler.query('select session_token from users where username = ? or email = ?', 
					[req.body.username, req.body.email], function(err, result){
				set_user_session(res, req.body.email, result[0].session_token);
				res.redirect('/map');
			});
		}
	});
});


app.listen(3000);