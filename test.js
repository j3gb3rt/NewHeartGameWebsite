var crypto = require('crypto');

//var token = crypto.randomBytes(24).toString('base64');
var token = crypto.randomBytes(13).toString('base64');

console.log(token.length);

//var key = "sdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfasgsdfsdfass";
//var shasum = crypto.createHash('sha256').update(key).digest('base64');
//console.log(shasum);

process.exit(0);