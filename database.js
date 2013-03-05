var fs = require('fs');
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

module.exports.query = query
