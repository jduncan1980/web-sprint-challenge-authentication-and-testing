const db = require('./dbConfig');

const findById = (id) => {
  return db('users').where({id}).first();
}

const findByUsername = (username) => {
  return db('users').where({username}).first()
}

const addUser = async (user) => {
  try {
    const [id] = await db('users').insert(user);
    return findById(id);
  } catch (error) {
    throw error;
  }
  
}

const findUsers = () => {
  return db('users');
}

module.exports = {
  findByUsername,
  addUser,
  findById,
  findUsers
}