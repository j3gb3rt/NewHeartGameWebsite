var crypto = require('crypto');
var mysql = require("mysql");
var configuration = require("../config");

var connection =  mysql.createConnection({
	"hostname": configuration.db_host,
	"user": configuration.db_user,
	"password": configuration.db_password
});

var tables = [
			{"table_name" : "users",
			"schema" :
				"(id int auto_increment, primary key(id), " + 
				"username varchar(50) not null, unique(username), " + 
				"email varchar(50) not null, unique(email), " + 
				"password_hash varchar(44) not null, " + 
				"password_salt varchar(16) not null, " + 
				"session_token varchar(32) not null, " + 
				"charisma int not null default '10', " + 
				"constitution int not null default '10', " + 
				"dedication int not null default '10', " + 
				"fitness int not null default '10', " + 
				"created_at timestamp default now(), index(created_at))"},
			{"table_name" : "avatars" ,
			"schema" :
				"(email varchar(50) not null, " + 
				"primary key(email), foreign key (email) references users (email) on delete cascade on update cascade, " + 
				"url varchar(64) not null)"},
			{"table_name" : "quests" ,
			"schema" :
				"(id int auto_increment, primary key(id))"},
			{"table_name" : "quest_status" ,
			"schema" :
				"(email varchar(50) not null, " + 
				"quest_id int not null, " + 
				"primary key (email, quest_id), " + 
				"foreign key (email) references users (email) on delete cascade on update cascade, " + 
				"foreign key (quest_id) references quests (id) on delete cascade on update cascade, " + 
				"easy_score int not null default '0', " +
				"medium_score int not null default '0', " +
				"hard_score int not null default '0')"}];

function failure(err){
	console.error(err);
	process.exit(0);
}

function create_table(connection, index){
	if(index >= tables.length) {
		console.log('database setup');
		process.exit(0);
	}
	connection.query('create table ' + tables[index]['table_name'] + tables[index]['schema'], function(err, result){
		if(err){
			failure(err);
		} else {
			create_table(connection, index + 1);
		}
	});
}

connection.query('create database ' + configuration.db_database, function(err, result){
	if(err){
		failure(err);
	} else {
		connection.query('use ' + configuration.db_database, function(err, result){
			if(err){
				failure(err);
			} else {
				create_table(connection, 0);
			}
		});
	}
});
