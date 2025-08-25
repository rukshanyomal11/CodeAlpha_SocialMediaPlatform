const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const taskController = require('../controllers/taskController');

module.exports = (io) => {
  const { createTask, updateTask } = taskController(io);
  router.post('/', authMiddleware, createTask);
  router.patch('/:id', authMiddleware, updateTask);
  return router;
};