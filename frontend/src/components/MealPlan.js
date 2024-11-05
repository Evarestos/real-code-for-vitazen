import React from 'react';
import { Typography, List, ListItem, ListItemText, Grid, useMediaQuery, useTheme, Button, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import withErrorHandlingAndAccessibility from '../hocs/withErrorHandlingAndAccessibility';

const MealPlan = ({ plan }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div>
      <Typography variant="h6" gutterBottom>{t('mealPlan')}</Typography>
      <Grid container spacing={2}>
        {plan && plan.map((meal, index) => (
          <Grid item xs={12} sm={isSmallScreen ? 12 : 6} md={4} key={index}>
            <List>
              <ListItem>
                <ListItemText 
                  primary={meal.name} 
                  secondary={`${t('calories')}: ${meal.calories}, ${t('protein')}: ${meal.protein}g, ${t('carbs')}: ${meal.carbs}g, ${t('fat')}: ${meal.fat}g`} 
                />
              </ListItem>
            </List>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default withErrorHandlingAndAccessibility(MealPlan);
