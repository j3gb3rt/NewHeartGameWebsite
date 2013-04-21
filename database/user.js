var mysql = require("mysql");
var db = require('./index.js');
var pcrypto = require('./password_encryption.js');

var user = {};

user.create_user = function (username, email, password, callback){
	var user_salt = pcrypto.generate_user_salt();
	var password_hash = pcrypto.encrypt_password(password, user_salt);
	db.query('insert into users (username, email, password_hash, password_salt, session_token) values (?, ?, ?, ?, ?)', 
			[username, email, password_hash, user_salt, pcrypto.generate_session_token()], callback);
};

user.verify_login = function (identity, password, callback){
	db.query('select * from users where username = ? or email = ?', [identity, identity], function(err, rows){
		if(err){
			callback(err, null);
		} else if(rows.length == 0 || !pcrypto.verify_password(password, rows[0].password_salt, rows[0].password_hash)){
			callback("username/password doesn't match", null);
		} else{
			callback(err, rows[0]);
		}
	});
};

user.retrieve_user = function (identity, session_token, callback){
	db.query('select * from users where (email = ? or username = ?) and session_token = ?', [identity, identity, session_token], function(err, rows){
		if(err){
			callback(err, null);
		} else if(rows.length == 0){
			callback({"error" : "no such user"}, null);
		} else {
			callback(err, rows[0]);
		}
	});	
};

user.set_user_session = function(req, res, email, session_token, callback){
	res.cookie('session_token', session_token, { maxAge: 3600000*24*365});
	res.cookie('email', email, { maxAge: 3600000*24*365});
	if(callback) callback(req, res);
};

user.delete_user_session = function(req, res, callback){
	res.cookie('session_token', "", { maxAge: 0});
	res.cookie('email', "", { maxAge: 0});
	if(callback) callback(req, res);
};

user.has_avatar = function (identity, callback){
	db.query('select avatars.url from users, avatars where (users.email = ? or users.username = ?) and avatars.email = users.email', [identity, identity], function(err, rows){
		if(err){
			callback(err, null);
		} else {
			callback(err, rows[0]);
		}
	});	
};

user.save_avatar = function (email, url, callback){
	db.query('insert into avatars (email, url) values (?, ?) on duplicate key update url = values(url)', [email, url], function(err, rows){
		if(err){
			callback(err, null);
		} else {
			callback(err, null);
		}
	});	
};

user.quest_score = function(email, quest_name, mode, callback){
	db.query("select "+ mysql.escapeId(mode) + " as score from quest_status where email = ? and quest_name = ?", [email, quest_name], function(err, result){
		callback(err, result);
	});
};

user.save_quest_score = function(email, quest_name, mode, score, callback){
	db.query("insert into quest_status (email, quest_name, " + mysql.escapeId(mode) + ") values (?, ?, ?) on duplicate key update " + mysql.escapeId(mode) + " = values(" + mysql.escapeId(mode) + ")", [email, quest_name, score], function(err, result){
		callback(err, result);
	});
};

module.exports.user = user;