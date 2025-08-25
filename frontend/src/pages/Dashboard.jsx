import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Plus, 
  LogOut, 
  Folder, 
  Users, 
  Clock, 
  TrendingUp,
  Activity,
  Calendar
} from 'lucide-react';

function Dashboard({ socket }) {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    
    socket.on('projectCreated', (project) => {
      setProjects((prev) => [...prev, project]);
    });

    return () => {
      socket.off('projectCreated');
    };
  }, [socket]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:3000/projects', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProjects(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/projects', { title, description }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTitle('');
      setDescription('');
      setShowCreateModal(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const stats = [
    { icon: <Folder className="w-6 h-6" />, label: 'Total Projects', value: projects.length, color: 'from-blue-500 to-blue-600' },
    { icon: <Users className="w-6 h-6" />, label: 'Team Members', value: '12', color: 'from-green-500 to-green-600' },
    { icon: <Clock className="w-6 h-6" />, label: 'Hours Tracked', value: '48.5', color: 'from-purple-500 to-purple-600' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'Completion Rate', value: '87%', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ProjectHub
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Welcome, {user?.username}</span>
              <button 
                onClick={logout} 
                className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Project Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">Your Projects</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </button>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded mb-1"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No projects yet</h3>
              <p className="text-slate-600 mb-4">Create your first project to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-indigo-200 cursor-pointer group"
                  onClick={() => navigate(`/project/${project._id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
                      <Folder className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {project.description || 'No description provided'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-xs text-slate-500">
                      {project.tasks?.length || 0} tasks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                placeholder="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <textarea
                placeholder="Project Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                >
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
