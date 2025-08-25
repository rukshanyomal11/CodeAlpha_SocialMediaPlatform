const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/project-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinProject', (projectId) => {
    socket.join(projectId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/auth', authRoutes(io));
app.use('/projects', projectRoutes(io));
app.use('/tasks', taskRoutes(io));
app.use('/comments', commentRoutes(io));

server.listen(3000, () => console.log('Server running on port 3000'));