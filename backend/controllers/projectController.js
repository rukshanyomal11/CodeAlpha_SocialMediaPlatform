const Project = require('../models/Project');
const User = require('../models/User');

module.exports = (io) => ({
  getProjects: async (req, res) => {
    const projects = await Project.find({ members: req.user._id }).populate('members');
    res.json(projects);
  },

  getProjectById: async (req, res) => {
    try {
      const project = await Project.findById(req.params.id)
        .populate('members')
        .populate({
          path: 'tasks',
          populate: {
            path: 'assignedTo',
            select: 'name email'
          }
        });
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      // Check if user is a member of the project
      const isMember = project.members.some(member => 
        member._id.toString() === req.user._id.toString()
      );
      
      if (!isMember) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createProject: async (req, res) => {
    const { title, description } = req.body;
    const project = new Project({
      title,
      description,
      createdBy: req.user._id,
      members: [req.user._id],
    });
    await project.save();
    io.emit('projectCreated', project);
    res.status(201).json(project);
  },

  addMember: async (req, res) => {
    const { projectId, email } = req.body;
    const project = await Project.findById(projectId);
    const user = await User.findOne({ email });
    if (!user || !project) return res.status(404).json({ error: 'User or Project not found' });
    project.members.push(user._id);
    user.projects.push(project._id);
    await project.save();
    await user.save();
    io.to(projectId).emit('memberAdded', user);
    res.json(project);
  },
});
