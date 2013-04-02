var configuration = require('../config');
var gm = require('gm');

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
	app.get('/profile', user_page(db_handler, function (req, res, result){
		db_handler.user.has_avatar(result.username, function (err, avatar){
			if(err || avatar){
				res.render('profile', merge(result, avatar));
			} else {
				res.redirect('/avatar');
			}
		})}, 
	redirect_page('/login')));

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
				res.render('avatar', merge(result, configuration.avatar));
			}
		});
	},redirect_page('/login')));
	app.post('/avatar', user_page(db_handler, function (req, res, result){
		db_handler.user.has_avatar(result.username, function (err, has_avatar){
			if(err || has_avatar){
				res.redirect('/map');
			} else {
				db_handler.user.save_avatar(result.email, req.body.url, function(err){
					if(err){
						res.render('/avatar');
					} else {
						res.redirect('/map');
					}
				});
			}
		});
	},redirect_page('/login')));

	app.get('/avatars/:params(*+)', function(req, res){
		res.setHeader('Content-Type', "image/png");
		res.setHeader('Pragma', "no-cache");
		res.setHeader('Cache-Control', "no-cache, must-revalidate");
		var params = req.params.params;
		var skin_color = params.substr(0,1);
		var hair_color = params.substr(1,1);
		var shirt_color = params.substr(2,1);
		var pant_color = params.substr(3,1);
		var eye_color = params.substr(4,1);
		var hair_style = params.substr(5,1);
		var shoe_style = params.substr(6,1);
		var gender = params.substr(7,1);
		
		gm(app.get('dir') + '/assets/images/avatar/body.png')
		.fill(configuration.avatar.skin_colors[skin_color])
		.drawEllipse(100, 110, 60, 80)
		.fill("#DDDDDD")
		.drawCircle(70, 90, 75, 107)
		.drawCircle(125, 90, 130, 107)
		.fill(configuration.avatar.eye_colors[eye_color])
		.drawCircle(73, 95, 81, 102)
		.drawCircle(123, 95, 131, 102)
		.draw('image Over 40,20 120,120"' + app.get('dir') + configuration.avatar.hair_styles[hair_style] + '"')
		.draw('fill ' + configuration.avatar.hair_colors[hair_color] + ' ; color 100,40 floodfill')
		.draw('image Over 65,300 80,200"' + app.get('dir') + '/assets/images/avatar/pants_1.png"')
		.draw('fill ' + configuration.avatar.pant_colors[pant_color] + ' ; color 100,320 floodfill')
		.draw('image Over 10,190 180,200"' + app.get('dir') + '/assets/images/avatar/shirt_' + gender + '.png"')
		.draw('fill ' + configuration.avatar.shirt_colors[shirt_color] + ' ; color 100,260 floodfill')
		.draw('image Over 62,490 40,40"' + app.get('dir') + '/assets/images/avatar/shoe.png"')
		.draw('image Over 108,490 40,40"' + app.get('dir') + '/assets/images/avatar/shoe.png"')
		.stream(function (err, stdout, stderr) {
			if (err) next(err);
      		stdout.pipe(res);
    	});
	});

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