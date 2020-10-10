const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'keep it like a secret';

module.exports = (req, res, next) => {

	if (req.headers.authorization) {

		const [directive, token] = req.headers.authorization.split(' ');
		jwt.verify(token, secret, (err, decodedToken) => {
			if (err) {
				console.log(err);
				next({ statusCode: 401, message: 'Invalid Credentials!!' });
			} else {
				req.decodedToken = decodedToken;
				next();
			}
		});
	} else {
		next({ statusCode: 401, message: 'Invalid Credentials' });
	}
};

