var assert = require('assert');
var sinon = require('sinon');
var db_handler = require('../database');
var configuration = require('../config');

describe('config', function(){
	it('should respond to the database parameters', function(){
		assert.ok(configuration.db_host);
		assert.ok(configuration.db_user);
		assert.ok(configuration.db_password);
		assert.ok(configuration.db_database);
		assert.ok(configuration.db_salt.length > 0);
		assert.ok(configuration.avatar.skin_colors.length > 0);
		assert.ok(configuration.avatar.hair_colors.length > 0);
		assert.ok(configuration.avatar.shirt_colors.length > 0);
		assert.ok(configuration.avatar.pant_colors.length > 0);
		assert.ok(configuration.avatar.eye_colors.length > 0);
		assert.ok(configuration.avatar.hair_styles.length > 0);
		assert.ok(configuration.avatar.shoe_styles.length > 0);
	});
});