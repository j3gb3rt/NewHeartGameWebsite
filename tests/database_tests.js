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

describe('session_tokens', function(){
	it('should generate non-unique session_tokens', function () {
		assert.ok(db_handler.generate_session_token() != db_handler.generate_session_token());
	})
});