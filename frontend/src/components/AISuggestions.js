import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { saveSuggestionFeedback } from '../services/suggestionFeedbackService';

const AISuggestions = ({ suggestions, onApplySuggestion }) => {
  const handleFeedback = async (suggestionId, feedback) => {
    try {
      await saveSuggestionFeedback(userId, suggestionId, feedback);
      // Εδώ θα μπορούσατε να προσθέσετε κάποιο μήνυμα επιβεβαίωσης για τον χρήστη
    } catch (error) {
      console.error('Error saving feedback:', error);
      // Εδώ θα μπορούσατε να προσθέσετε κάποιο μήνυμα σφάλματος για τον χρήστη
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <h2 className="text-2xl font-bold">Προτάσεις AI</h2>
      </CardHeader>
      <CardContent>
        {suggestions.map((suggestion, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <p className="mb-2">{suggestion.content}</p>
            <Button onClick={() => onApplySuggestion(suggestion)}>
              Εφαρμογή Πρότασης
            </Button>
            <Button onClick={() => handleFeedback(suggestion.id, 'helpful')} variant="outline">
              Χρήσιμη
            </Button>
            <Button onClick={() => handleFeedback(suggestion.id, 'not_helpful')} variant="outline">
              Μη Χρήσιμη
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AISuggestions;
