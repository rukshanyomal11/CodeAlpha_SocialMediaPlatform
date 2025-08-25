const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);