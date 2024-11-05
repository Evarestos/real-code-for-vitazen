import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Typography, Paper, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import aiService from '../../services/aiService';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.generateResponse(input, messages);
      const aiMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateProgram = async (type) => {
    setLoading(true);
    try {
      let response;
      if (type === 'workout') {
        response = await aiService.generateWorkoutProgram({
          fitnessLevel: user.preferences?.fitnessLevel || 'beginner',
          goals: user.preferences?.goals || ['general fitness'],
          limitations: user.preferences?.limitations || []
        });
      } else {
        response = await aiService.generateNutritionPlan({
          dietaryRestrictions: user.preferences?.dietaryRestrictions || [],
          goals: user.preferences?.goals || ['balanced diet'],
          calories: user.preferences?.calories || 2000
        });
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response[type === 'workout' ? 'program' : 'plan']
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: `Failed to generate ${type} program. Please try again.` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" gutterBottom>AI Wellness Assistant</Typography>
      
      <List sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        {messages.map((message, index) => (
          <ListItem key={index} sx={{
            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <Paper elevation={1} sx={{
              p: 2,
              maxWidth: '70%',
              bgcolor: message.role === 'user' ? 'primary.light' : 'background.paper'
            }}>
              <ListItemText 
                primary={message.role === 'user' ? 'You' : 'AI Assistant'}
                secondary={message.content}
              />
            </Paper>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>

      <div>
        <Button 
          variant="outlined" 
          onClick={() => handleGenerateProgram('workout')}
          disabled={loading}
          sx={{ mr: 1, mb: 2 }}
        >
          Generate Workout Program
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => handleGenerateProgram('nutrition')}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          Generate Nutrition Plan
        </Button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem' }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about fitness and wellness..."
          disabled={loading}
        />
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Send'}
        </Button>
      </form>
    </Paper>
  );
};

export default AIChat;
