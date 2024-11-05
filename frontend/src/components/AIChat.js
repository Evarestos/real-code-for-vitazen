import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, List, ListItem, ListItemText } from '@material-ui/core';
import { sendMessageToAI } from '../services/aiService';

const AIChat = ({ token, userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const aiResponse = await sendMessageToAI(token, userId, input);
      const aiMessage = { text: aiResponse, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
    }
  };

  return (
    <Paper style={{ padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
      <Typography variant="h6" gutterBottom>Συνομιλία με τον AI Assistant</Typography>
      <List>
        {messages.map((message, index) => (
          <ListItem key={index}>
            <ListItemText 
              primary={message.sender === 'user' ? 'Εσείς' : 'AI Assistant'}
              secondary={message.text}
            />
          </ListItem>
        ))}
      </List>
      <TextField
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Γράψτε το μήνυμά σας εδώ..."
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSendMessage}>
        Αποστολή
      </Button>
    </Paper>
  );
};

export default AIChat;
