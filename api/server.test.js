const server = require('./server');
const request = require('supertest');
const db = require('../database/dbConfig');

describe('server', () => {
it('should run in a testing environment', () => {
		expect(process.env.DB_ENV).toBe('testing');
  });
  beforeAll(async () => {
      await db('users').truncate();
    })

  describe('/api/auth/register', () => {
    
    it('should allow a user to register', async() => {
      const response = await request(server).post('/api/auth/register').send({
        username: 'Jason123',
        password: "password"
      });
      const {username, password} = JSON.parse(response.text)
      expect(response.status).toBe(201);
      expect(username).toBe('Jason123');
      expect(password).not.toBe('password');
    });

    it('should return an error if missing username', async () => {
      const response = await request(server).post('/api/auth/register').send({
        password: 'password'
      });
      expect(response.status).toBe(400);
    });

    it('should return an error if missing password', async () => {
      const response = await request(server).post('/api/auth/register').send({
        username: 'Jason345'
      })

      expect(response.status).toBe(400);
 
    });

    it('should not add user to database if missing registration info', async() => {
      const response = await request(server).get('/api/auth/users');
      const database = JSON.parse(response.text);
      expect(database).not.toEqual(expect.arrayContaining([{id: 1, username: 'Jason123', password: 'password'}, {id: 2, username:'Jason345', password: 'password'}]))
    })
    
  })
 
  describe('/api/auth/login', () => {
    it('should allow a user with proper credentials to login', async() => {
      const response = await request(server).post('/api/auth/login').send({
        username: 'Jason123',
        password: 'password'
      });
      const {message, token} = JSON.parse(response.text);
      expect(response.status).toBe(200);
      expect(message).toBe("Welcome, Jason123");
      expect(token).toBeTruthy();
    });

    it('should not allow a user with invalid credentials to log in', async() => {
      const response = await request(server).post('/api/auth/login').send({
        username: 'Jason123',
        password: 'password?'
      });

      const {message, username, password} = JSON.parse(response.text);
      expect(response.status).toBe(401);
      expect(message).toBe("Invalid Credentials");
      expect(username).toBeFalsy();
      expect(password).toBeFalsy();
    })

    it('should not allow a user without password to log in', async() => {
      const response = await request(server).post('/api/auth/login').send({
        username: 'Jason123'
      });

      const {message, username, password} = JSON.parse(response.text);
      expect(response.status).toBe(400);
      expect(message).toBe("Missing Login Data.");
      expect(username).toBeFalsy();
      expect(password).toBeFalsy();
    });

    it('should not allow a user without username to log in', async() => {
      const response = await request(server).post('/api/auth/login').send({
        password: 'password'
      });

      const {message, username, password} = JSON.parse(response.text);
      expect(response.status).toBe(400);
      expect(message).toBe("Missing Login Data.");
      expect(username).toBeFalsy();
      expect(password).toBeFalsy();
    });
  })

  describe('/api/jokes', () => {

    it('should allow a logged in user to get the jokes', async() => {
       const login = await request(server).post('/api/auth/login').send({
        username: 'Jason123',
        password: 'password'
      });
      const {token} = JSON.parse(login.text);

      const response = await request(server).get('/api/jokes').set({Authorization: `Bearer ${token}`});
      const jokes = JSON.parse(response.text);
      expect(jokes).toBeInstanceOf(Object);
      expect(response.status).toBe(200);
    });

    it('should not allow an unauthenticated user to get jokes', async() => {
      const login = await request(server).post('/api/auth/login').send({
        username: 'Jason1000',
        password: 'password'
      });
      const {token} = JSON.parse(login.text);
      expect(token).toBeFalsy();

       const response = await request(server).get('/api/jokes').set({Authorization: `Bearer ${token}`});
      expect(response.status).toBe(401);
    });
  });
});

