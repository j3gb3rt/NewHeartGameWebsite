var crypto = require('crypto');
var mysql = require("mysql");
var configuration = require("../config/configuration.js");

var connection =  mysql.createConnection({
	"hostname": configuration.db_host,
	"user": configuration.db_user,
	"password": configuration.db_password
});

var table = 'users';
var schema = '(id int auto_increment, primary key(id), ' + 
				'username varchar(50) not null, unique(username), ' + 
				'email varchar(50) not null, unique(email), ' + 
				'password_hash varchar(44) not null, ' + 
				'password_salt varchar(16) not null, ' + 
				'session_token varchar(32) not null, ' + 
				"charisma int not null default '10', " + 
				"constitution int not null default '10', " + 
				"dedication int not null default '10', " + 
				"fitness int not null default '10', " + 
				'created_at timestamp default now(), index(created_at))';

function failure(err){
	console.error(err);
	process.exit(0);
}

connection.query('create database ' + configuration.db_database, function(err, result){
	if(err){
		failure(err);
	} else {
		connection.query('use ' + configuration.db_database, function(err, result){
			if(err){
				failure(err);
			} else {
				connection.query('create table ' + table + schema, function(err, result){
					if(err){
						failure(err);
					} else {
						console.log('database setup');
						process.exit(0);
					}
				});
			}
		});
	}
});
