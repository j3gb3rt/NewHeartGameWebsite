var fs = require('fs');
var mysql = require("mysql");
var pcrypto = require('./password_encryption.js');
var configuration = require("../config/configuration.js");

var pool = mysql.createPool({
	"hostname": configuration.db_host,
	"user": configuration.db_user,
	"password": configuration.db_password,
	"database" : configuration.db_database
});

function query(query, params, callback){
	pool.getConnection(function(err, connection) {
		if(err){
			console.log(err);
		} else if(callback){
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

function create_user(username, email, password, callback){
	var user_salt = pcrypto.generate_user_salt();
	var password_hash = pcrypto.encrypt_password(password, user_salt);
	query('insert into users (username, email, password_hash, password_salt, session_token) values (?, ?, ?, ?, ?)', 
			[username, email, password_hash, user_salt, pcrypto.generate_session_token()], callback);
}

function verify_login(identity, password, callback){
	query('select * from users where username = ? or email = ?', [identity, identity], function(err, rows){
		if(err){
			callback(err, null);
		} else if(rows.length == 0 || !pcrypto.verify_password(password, rows[0].password_salt, rows[0].password_hash)){
			callback("username/password doesn't match", null);
		} else{
			callback(err, rows[0]);
		}
	});
}

function retrieve_user(identity, session_token, callback){
	query('select * from users where (email = ? or username = ?) and session_token = ?', [identity, identity, session_token], function(err, rows){
		if(err){
			callback(err, null);
		} else if(rows.length == 0){
			callback("no such user", null);
		} else{
			callback(err, rows[0]);
		}
	});	
}

module.exports.query = query
module.exports.create_user = create_user
module.exports.verify_login = verify_login
module.exports.retrieve_user = retrieve_user
