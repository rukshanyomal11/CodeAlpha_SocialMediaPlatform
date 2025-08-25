const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

module.exports = (io) => {
  const { register, login } = authController(io);
  router.post('/register', register);
  router.post('/login', login);
  return router;
};