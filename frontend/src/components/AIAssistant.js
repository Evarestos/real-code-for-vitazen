import React, { useState, useCallback } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import aiService from '../services/aiService';
import SuggestionsDropdown from './SuggestionsDropdown';

const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = useCallback(async () => {
    if (input.length < 3) return;
    
    try {
      const fetchedSuggestions = await aiService.getSuggestions(input);
      setSuggestions(fetchedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  }, [input]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (e.target.value.length >= 3) {
      fetchSuggestions();
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setInput(suggestion.content);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const aiResponse = await aiService.getAIResponse(input);
      setResponse(aiResponse);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setResponse('Συγγνώμη, προέκυψε ένα σφάλμα. Παρακαλώ δοκιμάστε ξανά.');
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        AI Βοηθός
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          value={input}
          onChange={handleInputChange}
          placeholder="Ρωτήστε κάτι..."
          variant="outlined"
          margin="normal"
        />
        {showSuggestions && suggestions.length > 0 && (
          <SuggestionsDropdown
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
          />
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '1rem' }}
        >
          Υποβολή
        </Button>
      </form>
      {response && (
        <Typography style={{ marginTop: '1rem' }}>
          {response}
        </Typography>
      )}
    </div>
  );
};

export default AIAssistant;
