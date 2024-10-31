import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import notificationService from '../services/notificationService';
import userPreferencesService from '../services/userPreferencesService';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState(null);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [preferencesError, setPreferencesError] = useState(null);
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const newSocket = io(process.env.REACT_APP_WEBSOCKET_URL);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        newSocket.emit('authenticate', currentUser.id);
      });

      newSocket.on('new_notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      fetchPreferences();

      return () => newSocket.close();
    }
  }, [currentUser]);

  const fetchPreferences = async () => {
    setIsLoadingPreferences(true);
    setPreferencesError(null);
    try {
      const userPreferences = await userPreferencesService.getPreferences();
      setPreferences(userPreferences);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      setPreferencesError('Failed to load preferences');
    } finally {
      setIsLoadingPreferences(false);
    }
  };

  const updatePreferences = async (newPreferences) => {
    try {
      const updatedPreferences = await userPreferencesService.updatePreferences(newPreferences);
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const resetPreferences = async () => {
    try {
      const defaultPreferences = await userPreferencesService.resetPreferences();
      setPreferences(defaultPreferences);
    } catch (error) {
      console.error('Error resetting preferences:', error);
      throw error;
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    preferences,
    isLoadingPreferences,
    preferencesError,
    markAsRead,
    deleteNotification,
    updatePreferences,
    resetPreferences,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
