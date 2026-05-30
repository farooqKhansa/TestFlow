import React, { useEffect, useState } from 'react';
import { Bell, Mail, Slack, X, CheckCircle } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'test_failed':
        return '❌';
      case 'test_passed':
        return '✅';
      case 'critical_alert':
        return '🚨';
      case 'summary':
        return '📊';
      case 'integration_status':
        return '🔗';
      default:
        return 'ℹ️';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>

            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {notifications.map(notification => (
                  <div
                    key={notification._id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition border-l-4 ${
                      notification.isRead ? 'border-gray-300' : 'border-blue-500'
                    } ${getSeverityColor(notification.severity)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                          <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

                        <div className="flex items-center gap-2 mt-2">
                          {notification.channels.email && (
                            <Mail className="w-4 h-4 text-blue-600" title="Email sent" />
                          )}
                          {notification.channels.slack && (
                            <Slack className="w-4 h-4 text-purple-600" title="Slack sent" />
                          )}
                        </div>

                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2 ml-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Mark as read"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Delete"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default NotificationCenter;