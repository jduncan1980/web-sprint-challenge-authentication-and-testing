const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const handleError = require('../middleware/handle-error-middleware');
const authenticate = require('../middleware/authenticate-middleware')
const logger = require('../middleware/logger');

const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(logger());


server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

server.use(handleError())
module.exports = server;
