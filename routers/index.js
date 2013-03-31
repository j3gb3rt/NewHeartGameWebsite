function route(app, db_handler, next){

	function merge(object1, object2){
		var ret = {};
		for(var key in object1){
			ret[key] = object1[key];
		}
		for(var key in object2){
			ret[key] = object2[key];
		}
		return ret;
	}

	function simple_page(view){
		return function(req, res){
			res.render(view);
		};
	}

	function simple_page_with_params(view){
		return function(req, res, params){
			res.render(view, params);
		};
	}

	function redirect_page(path){
		return function(req, res){
			res.redirect(path);
		};
	}

	function user_page(db_handler, success, failure){
		return function(req, res){
			db_handler.user.retrieve_user(req.cookies.email, req.cookies.session_token, function(err, result){
				if(err){
					failure(req, res, err);
				} else {
					success(req, res, result);
				}
			});
		};
	}

	app.get('/', simple_page('index'));
	app.get('/profile', user_page(db_handler, simple_page_with_params('profile'), redirect_page('/login')));
	app.get('/login', user_page(db_handler, redirect_page('/map'), simple_page('login')));
	app.post('/login', function(req, res){
		db_handler.user.verify_login(req.body.email, req.body.password, function(err, result){
			if(err){
				res.redirect('/login');
			} else{
				db_handler.user.set_user_session(req, res, req.body.email, result.session_token, redirect_page('/map'));
			}
		});
	});

	app.get('/logout', function(req, res){
		db_handler.user.delete_user_session(req, res, redirect_page('/login'));
	});

	app.get('/signup', simple_page('signup'));
	app.post('/signup', function(req, res) {
		db_handler.user.create_user(req.body.username, req.body.email, req.body.password, function(err, result){
			if(err){
				res.redirect('/signup');
			} else {
				db_handler.query('select session_token from users where username = ? or email = ?', 
						[req.body.username, req.body.email], function(err, result){
					db_handler.user.set_user_session(req, res, req.body.email, result[0].session_token, redirect_page('/map'));
				});
			}
		});
	});

	app.get('/avatar', user_page(db_handler, function (req, res, result){
		db_handler.user.has_avatar(result.username, function (err, has_avatar){
			if(err || has_avatar){
				res.redirect('/map');
			} else {
				res.render('avatar', result);
			}
		});
	},redirect_page('/login')));


	app.use(function(req, res, next){
		res.status(404);
		if (req.accepts('html')) {
	  		db_handler.user.retrieve_user(req.cookies.email, req.cookies.session_token, function(err, result){
				if(err){
					res.render('404', err);
				} else {
					res.render('404', result);
				}
			});
	    	return;
	  	}
	  	if (req.accepts('json')) {
	    	res.send({ error: 'Not found' });
	    	return;
	  	}
	  	res.type('txt').send('Not found');
	});
}

module.exports.route = route;