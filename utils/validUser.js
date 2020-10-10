const isValidUser = (user) => {
	return Boolean(
		typeof user.username === 'string' &&
			typeof user.password === 'string' 
	);
};

module.exports = {isValidUser}
