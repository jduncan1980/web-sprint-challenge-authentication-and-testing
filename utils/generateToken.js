const jwt = require('jsonwebtoken');


const generateToken = (user) => {
	const payload = {
		subject: user.id,
		username: user.username
	};
	const secret = process.env.JWT_SECRET || 'keep it like a secret';
	const options = {
		expiresIn: process.env.TOKEN_EXP || '1d',
	};

	const token = jwt.sign(payload, secret, options);
	return token;
};

module.exports = generateToken;