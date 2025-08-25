import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import { DragDropContext } from "@hello-pangea/dnd";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Project from './pages/Project';
import Homepage from './pages/Homepage';
import { AuthProvider } from './context/AuthContext';
import Notification from './components/Notification';

const socket = io('http://localhost:3000');

function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on('notification', (notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  const onDragEnd = () => {
    // Handled in Project.jsx
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <Notification notifications={notifications} setNotifications={setNotifications} />
        <DragDropContext onDragEnd={onDragEnd}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard socket={socket} />} />
            <Route path="/project/:id" element={<Project socket={socket} />} />
          </Routes>
        </DragDropContext>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
