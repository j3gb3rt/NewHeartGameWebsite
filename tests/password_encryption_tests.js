var assert = require('assert');
var pcrypto = require('../database/password_encryption.js');

describe('#generate_session_token', function(){
	it('should generate non-unique session_tokens', function () {
		assert.ok(pcrypto.generate_session_token() != pcrypto.generate_session_token());
	});

	it('should generate a token of length 32', function () {
		assert.ok(pcrypto.generate_session_token().length == 32);
	});
});

describe('#generate_user_salt', function(){
	it('should generate non-unique salts', function () {
		assert.ok(pcrypto.generate_user_salt() != pcrypto.generate_user_salt());
	});

	it('should generate a token of length 16', function () {
		assert.ok(pcrypto.generate_user_salt().length == 16);
	});
});

describe('#encrypt_password', function(){
	it('should encrypt values deterministically', function () {
		assert.ok(pcrypto.generate_session_token() != pcrypto.generate_session_token());
	});

	it('should should generate a hash of length 44', function () {
		assert.ok(pcrypto.encrypt_password("apples", "OxjR0w1/yo17eNKC").length == 44);
	});
});

describe('#verify_password', function(){
	it('should return true when password is correct', function () {
		assert.ok(pcrypto.verify_password("apples", "OxjR0w1/yo17eNKC", "syxA3+g5vap68pJL4O4gRAbfmrc2+hNpIqZoEPc5neM="));
	});
	it('should return false when password is correct', function () {
		assert.ok(!pcrypto.verify_password("apple", "OxjR0w1/yo17eNKC", "syxA3+g5vap68pJL4O4gRAbfmrc2+hNpIqZoEPc5neM="));
	});
});