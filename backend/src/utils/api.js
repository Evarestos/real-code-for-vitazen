const axios = require('axios');

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Αφαιρούμε τον interceptor που σχετίζεται με το Firebase
// Αν χρειάζεστε αυθεντικοποίηση, μπορείτε να την υλοποιήσετε με άλλο τρόπο

module.exports = api;
