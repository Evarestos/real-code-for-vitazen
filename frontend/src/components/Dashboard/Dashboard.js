import React, { useState } from 'react';
import { Button, Typography, Alert } from '@mui/material';
import CustomizableDashboard from '../Analytics/CustomizableDashboard';
import ShareModal from '../Sharing/ShareModal';
import SharedLayoutsList from '../Sharing/SharedLayoutsList';

const Dashboard = () => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedLayoutId, setSelectedLayoutId] = useState(null);

  const handleShareClick = (layoutId) => {
    setSelectedLayoutId(layoutId);
    setShareModalOpen(true);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={() => handleShareClick('current-layout-id')}>
        Κοινοποίηση τρέχοντος Layout
      </Button>
      <CustomizableDashboard onShareClick={handleShareClick} />
      <h2>Κοινόχρηστα Layouts</h2>
      <SharedLayoutsList />
      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        layoutId={selectedLayoutId}
      />
    </div>
  );
};

export default Dashboard;
