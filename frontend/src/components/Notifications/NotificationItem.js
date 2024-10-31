import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography } from  '@mui/material';
import { Delete as DeleteIcon, CheckCircle as CheckCircleIcon } from  '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notification, onMarkAsRead, onDelete, isFullPage }) => {
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'share_invite':
        return <ShareIcon />;
      case 'permission_change':
        return <SecurityIcon />;
      case 'layout_update':
        return <LayoutIcon />;
      case 'system_alert':
        return <WarningIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <ListItem 
      button 
      onClick={onMarkAsRead}
      style={{ 
        backgroundColor: notification.isRead ? 'transparent' : 'rgba(0, 0, 0, 0.05)',
        borderLeft: `4px solid ${notification.isRead ? 'transparent' : '#1976d2'}`
      }}
    >
      <ListItemIcon>
        {getNotificationIcon()}
      </ListItemIcon>
      <ListItemText
        primary={notification.content}
        secondary={
          <>
            <Typography component="span" variant="body2" color="textSecondary">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </Typography>
            {isFullPage && (
              <Typography component="span" variant="body2" color="textSecondary" style={{ marginLeft: '8px' }}>
                • {notification.type}
              </Typography>
            )}
          </>
        }
      />
      <ListItemSecondaryAction>
        {!notification.isRead && (
          <IconButton edge="end" aria-label="mark as read" onClick={onMarkAsRead}>
            <CheckCircleIcon />
          </IconButton>
        )}
        <IconButton edge="end" aria-label="delete" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default NotificationItem;
