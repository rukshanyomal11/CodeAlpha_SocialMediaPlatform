const Comment = require('../models/Comment');
const Task = require('../models/Task');

module.exports = (io) => ({
  createComment: async (req, res) => {
    const { text, taskId } = req.body;
    const comment = new Comment({
      text,
      author: req.user._id,
      task: taskId,
    });
    await comment.save();
    await Task.findByIdAndUpdate(taskId, { $push: { comments: comment._id } });
    io.to(taskId).emit('commentAdded', comment);
    res.status(201).json(comment);
  },
});