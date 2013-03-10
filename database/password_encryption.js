var crypto = require('crypto');
var configuration = require("../config/configuration.js");

function generate_session_token(){
	return crypto.randomBytes(24).toString('base64');
}

function generate_user_salt(){
	return crypto.randomBytes(12).toString('base64');
}

function encrypt_password(password, salt){
	return crypto.createHash('sha256').update(password + salt + configuration.db_salt).digest('base64');
}

function verify_password(password, salt, hash){
	return hash == encrypt_password(password, salt);
}

module.exports.generate_user_salt = generate_user_salt;
module.exports.generate_session_token = generate_session_token;
module.exports.encrypt_password = encrypt_password;
module.exports.verify_password = verify_password;