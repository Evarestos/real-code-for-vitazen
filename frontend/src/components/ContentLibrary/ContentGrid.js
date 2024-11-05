import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { theme } from '../../theme/index.js';

const ContentGrid = ({ content }) => {
  if (!content || content.length === 0) {
    return (
      <Typography variant="body1" style={{ textAlign: 'center', marginTop: '2rem' }}>
        Δεν βρέθηκε περιεχόμενο.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {content.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <Card sx={{
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: 3
            },
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: theme.colors.background,
            padding: theme.spacing.medium
          }}>
            {item.type === 'video' && (
              <CardMedia
                component="video"
                height="140"
                image={item.url}
                title={item.title}
              />
            )}
            {item.type === 'recipe' && (
              <CardMedia
                component="img"
                height="140"
                image={item.imageUrl}
                alt={item.title}
              />
            )}
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                style={{ marginTop: '1rem' }}
                href={item.url}
                target="_blank"
              >
                {item.type === 'video' ? 'Παρακολούθηση' : 'Δείτε τη συνταγή'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ContentGrid;
