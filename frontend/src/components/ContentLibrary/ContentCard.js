import React from 'react';
import { Card, CardContent, CardActions, CardMedia, Typography, Button, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import contentService from '../../services/contentService';

const ContentCard = ({ content }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites?.some(fav => fav._id === content._id);

  const handlePlay = async () => {
    try {
      await contentService.trackContentView(content._id);
      if (content.type === 'video') {
        window.open(content.videoUrl, '_blank');
      } else {
        navigate(`/content/${content._id}`);
      }
    } catch (error) {
      console.error('Error playing content:', error);
    }
  };

  const handleFavoriteClick = async () => {
    try {
      await toggleFavorite(content._id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={content.thumbnailUrl}
        alt={content.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {content.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {content.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Διάρκεια: {content.duration}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={handlePlay}>
          {content.type === 'video' ? 'Αναπαραγωγή' : 'Προβολή'}
        </Button>
        <IconButton onClick={handleFavoriteClick}>
          {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ContentCard;
