var jwt = require("jsonwebtoken");


function jwtSign(data) {
	return jwt.sign(data, process.env.ENCRYPT_KEY);
}

function jwtDecode(token) {
	return jwt.verify(token, process.env.ENCRYPT_KEY);
}

module.exports = {
    jwtSign,
    jwtDecode,
};