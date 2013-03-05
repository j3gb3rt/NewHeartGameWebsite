var assert = require('assert');
var sinon = require('sinon');
var db_handler = require('../database.js');
var configuration = require('../config/configuration.js');

describe('config', function(){
	it('should respond to the database parameters', function(){
		assert.ok(configuration.db_host);
		assert.ok(configuration.db_user);
		assert.ok(configuration.db_password);
		assert.ok(configuration.db_database);
	});
});