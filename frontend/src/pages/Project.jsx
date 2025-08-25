import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext } from "@hello-pangea/dnd";
import { AuthContext } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import StatusColumn from '../components/StatusColumn';
import CommentSection from '../components/CommentSection';
import { FaUsers, FaTasks, FaCalendarAlt } from 'react-icons/fa';

function Project({ socket }) {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    assignedTo: '', 
    dueDate: '', 
    priority: 'medium' 
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.emit('joinProject', id);
    
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/projects/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProject(response.data);
        setTasks(response.data.tasks);
        setMembers(response.data.members);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        setLoading(false);
      }
    };

    fetchProject();

    socket.on('taskCreated', (task) => {
      setTasks((prev) => [...prev, task]);
    });

    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
    });

    socket.on('memberAdded', (member) => {
      setMembers((prev) => [...prev, member]);
    });

    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('memberAdded');
    };
  }, [id, socket]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/tasks', { ...newTask, projectId: id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'medium' });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    
    try {
      await axios.patch(`http://localhost:3000/tasks/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) return <div className="text-center py-20">Project not found</div>;

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'To Do').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    done: tasks.filter(t => t.status === 'Done').length
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Project Header */}
        <div className="bg-white shadow-lg">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {project.title}
                </h1>
                <p className="text-gray-600 mb-4 max-w-2xl">
                  {project.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <FaUsers className="text-blue-500" />
                    <span className="text-gray-700">{members.length} members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaTasks className="text-green-500" />
                    <span className="text-gray-700">{taskStats.total} tasks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-purple-500" />
                    <span className="text-gray-700">{taskStats.done} completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Task Creation Form */}
          <form onSubmit={handleCreateTask} className="mb-8 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Create New Task</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <select
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Assign To</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>{member.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
            >
              Create Task
            </button>
          </form>

          {/* Status Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {['To Do', 'In Progress', 'Done'].map((status) => (
              <StatusColumn
                key={status}
                status={status}
                tasks={tasks.filter((task) => task.status === status)}
              />
            ))}
          </div>

          {/* Comment Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <CommentSection tasks={tasks} socket={socket} />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default Project;
