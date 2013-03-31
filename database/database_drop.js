var mysql = require("mysql");
var configuration = require("../config");

var connection =  mysql.createConnection({
	"hostname": configuration.db_host,
	"user": configuration.db_user,
	"password": configuration.db_password
});

connection.query('drop database ' + configuration.db_database, function(err, result){
	if(err){
		console.error(err);
	} else {
		console.log('database dropped');
	}
	process.exit(0);
});
