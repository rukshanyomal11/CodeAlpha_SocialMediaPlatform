import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:3000/auth/login', { email, password });
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    navigate('/dashboard');
  };

  const register = async (name, email, password) => {
    const res = await axios.post('http://localhost:3000/auth/register', { name, email, password });
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3000/projects', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => setUser(res.data.user)).catch(() => logout());
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
