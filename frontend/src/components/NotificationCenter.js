import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { getNotifications, markNotificationAsRead } from '../services/notificationService';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 60000); // Refresh every minute
    return () => clearInterval(intervalId);
  }, []);

  const fetchNotifications = async () => {
    try {
      const newNotifications = await getNotifications();
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Ειδοποιήσεις</Typography>
        {notifications.length === 0 ? (
          <Typography>Δεν υπάρχουν νέες ειδοποιήσεις.</Typography>
        ) : (
          <List>
            {notifications.map(notification => (
              <ListItem key={notification.id}>
                <ListItemText primary={notification.message} secondary={new Date(notification.timestamp).toLocaleString()} />
                <ListItemSecondaryAction>
                  <Button onClick={() => handleMarkAsRead(notification.id)} color="primary">
                    Σήμανση ως αναγνωσμένο
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
