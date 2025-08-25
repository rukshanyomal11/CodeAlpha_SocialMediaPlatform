const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const commentController = require('../controllers/commentController');

module.exports = (io) => {
  const { createComment } = commentController(io);
  router.post('/', authMiddleware, createComment);
  return router;
};