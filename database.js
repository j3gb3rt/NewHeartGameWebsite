var fs = require('fs');
var crypto = require('crypto');
var mysql = require("mysql");
var configuration = require("./config/configuration.js");


var pool = mysql.createPool({
	"hostname": configuration.db_host,
	"user": configuration.db_user,
	"password": configuration.db_password,
	"database" : configuration.db_database
});

function query(query, params, callback){
	pool.getConnection(function(err, connection) {
		if(callback){
			connection.query(query, params, function(err, rows) {
				if(err){
					console.log(err);	
				} else {
					callback(err, rows);
				}
		    	connection.end();
			});
		} else {
			connection.query(query, function(err, rows) {
				if(err){
					console.log(err);	
				} else {
					params(err, rows);
				}
		    	connection.end();
			});
		}
	});
}

function generate_session_token(){
	return crypto.randomBytes(24).toString('base64');
}

function create_user(username, email, password, callback){
	var user_salt = crypto.randomBytes(12).toString('base64');
	var password_hash = crypto.createHash('sha256').update(password + user_salt + configuration.db_salt).digest('base64');
	query('insert into users (username, email, password_hash, password_salt, session_token) values (?, ?, ?, ?, ?)', 
			[username, email, password_hash, user_salt, generate_session_token()], callback);
}

module.exports.query = query
module.exports.create_user = create_user
module.exports.generate_session_token = generate_session_token

