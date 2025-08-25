const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

module.exports = (io) => ({
  createTask: async (req, res) => {
    const { title, description, status, assignedTo, dueDate, projectId } = req.body;
    const task = new Task({
      title,
      description,
      status,
      assignedTo,
      dueDate,
      project: projectId,
    });
    await task.save();
    await Project.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });
    io.to(projectId).emit('taskCreated', task);
    if (assignedTo) {
      const notification = new Notification({
        user: assignedTo,
        message: `You were assigned to task: ${title}`,
      });
      await notification.save();
      io.to(assignedTo.toString()).emit('notification', notification);
    }
    res.status(201).json(task);
  },

  updateTask: async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    io.to(task.project.toString()).emit('taskUpdated', task);
    res.json(task);
  },
});