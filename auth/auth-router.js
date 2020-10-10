const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { isValidUser } = require('../utils/validUser')
const  {
  findByUsername,
  addUser,
  findUsers
} = require('../database/users-model');

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


router.post('/register', async(req, res, next) => {
  const user = req.body;
  if(isValidUser(user)) {
    const hash = bcrypt.hashSync(user.password, parseInt(process.env.BCRYPT_ROUNDS) || 10)
    user.password = hash;

    try {
      const response = await addUser(user);
      res.status(201).json(response)
    } catch (error) {
      	next({ statusCode: 500, message: 'Something went wrong, try again...' });
    }
  } else{ 
    next({ statusCode: 400, message: 'Missing Registration Data.' });
  }
});

router.post('/login', async (req, res, next) => {
  const {username, password} = req.body;
  
  if (isValidUser(req.body)) {
    try {
    const user = await findByUsername(username);
    // console.log(user);
    // console.log(user && bcrypt.compareSync(password, user.password))
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({ message: `Welcome, ${username}`, token });
    } else {
      next({ statusCode: 401, message: 'Invalid Credentials' });
    }
  } catch (error) {
    next({ statusCode: 500, message: 'Something went wrong...', error });
  }  
  } else {
    next({ statusCode: 400, message: 'Missing Login Data.' });
  }
});

router.get('/users', async (req, res, next) => {
try {
  const response = await findUsers();
res.status(200).json(response);
} catch (error) {
  	next({ statusCode: 500, message: 'Something went wrong, try again...' });
}
})

module.exports = router;
