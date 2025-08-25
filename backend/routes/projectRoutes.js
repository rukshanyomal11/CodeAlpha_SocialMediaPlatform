const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const projectController = require('../controllers/projectController');

module.exports = (io) => {
  const { getProjects, getProjectById, createProject, addMember } = projectController(io);
  router.get('/', authMiddleware, getProjects);
  router.get('/:id', authMiddleware, getProjectById);
  router.post('/', authMiddleware, createProject);
  router.post('/add-member', authMiddleware, addMember);
  return router;
};
