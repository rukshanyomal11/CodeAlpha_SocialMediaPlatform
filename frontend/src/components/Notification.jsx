import { useState } from 'react';

function Notification({ notifications, setNotifications }) {
  const handleMarkAsRead = (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <div className="fixed top-4 right-4 space-y-2">
      {notifications.map((notification) => (
        <div key={notification._id} className="p-4 bg-blue-100 rounded shadow">
          <p>{notification.message}</p>
          <button
            onClick={() => handleMarkAsRead(notification._id)}
            className="text-sm text-blue-500"
          >
            Mark as read
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notification;
