import React, { useState } from 'react';
import { Container, Typography, Tabs, Tab, Grid } from '@mui/material';
import ContentGrid from '../components/ContentLibrary/ContentGrid';
import { useContent } from '../hooks/useContent';

const ContentLibrary = () => {
  const [activeTab, setActiveTab] = useState('workout');
  const { data: content, isLoading } = useContent({ type: activeTab });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Βιβλιοθήκη Περιεχομένου
      </Typography>
      
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab value="workout" label="Βίντεο Γυμναστικής" />
        <Tab value="recipe" label="Συνταγές" />
      </Tabs>

      {isLoading ? (
        <Typography>Φόρτωση...</Typography>
      ) : (
        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          <ContentGrid content={content} />
        </Grid>
      )}
    </Container>
  );
};

export default ContentLibrary; 