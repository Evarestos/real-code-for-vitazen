import React, { useState } from 'react';
import { Badge, IconButton, Popover, List, ListItem, ListItemText, Button, Typography, Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, CloseIcon } from '@material-ui/core';
import { Notifications as NotificationsIcon, Search as SearchIcon, FilterList as FilterIcon } from  '@mui/material';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationItem from './NotificationItem';

const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFullPageOpen, setIsFullPageOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFullPageOpen = () => {
    setIsFullPageOpen(true);
    handleClose();
  };

  const handleFullPageClose = () => {
    setIsFullPageOpen(false);
  };

  const filteredNotifications = notifications.filter(notification => 
    (filterType === 'all' || notification.type === filterType) &&
    (notification.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
     notification.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderNotificationList = (notificationsToRender, isFullPage = false) => (
    <List>
      {notificationsToRender.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={() => markAsRead(notification.id)}
          onDelete={() => deleteNotification(notification.id)}
          isFullPage={isFullPage}
        />
      ))}
    </List>
  );

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div style={{ padding: '1rem', maxWidth: '400px', maxHeight: '500px', overflow: 'auto' }}>
          <Typography variant="h6">Πρόσφατες Ειδοποιήσεις</Typography>
          {renderNotificationList(notifications.slice(0, 5))}
          <Button onClick={handleFullPageOpen} fullWidth>
            Δείτε όλες τις ειδοποιήσεις
          </Button>
        </div>
      </Popover>
      <Dialog
        open={isFullPageOpen}
        onClose={handleFullPageClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Όλες οι Ειδοποιήσεις
          <IconButton style={{ float: 'right' }} onClick={handleFullPageClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <TextField
              placeholder="Αναζήτηση ειδοποιήσεων"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
            />
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              variant="outlined"
              size="small"
              startAdornment={<FilterIcon />}
            >
              <MenuItem value="all">Όλοι οι τύποι</MenuItem>
              <MenuItem value="share_invite">Προσκλήσεις Κοινοποίησης</MenuItem>
              <MenuItem value="permission_change">Αλλαγές Δικαιωμάτων</MenuItem>
              <MenuItem value="layout_update">Ενημερώσεις Layout</MenuItem>
              <MenuItem value="system_alert">Ειδοποιήσεις Συστήματος</MenuItem>
            </Select>
          </div>
          {renderNotificationList(filteredNotifications, true)}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationCenter;
