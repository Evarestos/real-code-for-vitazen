const express = require('express');
const http = require('http');
const websocketService = require('./services/websocketService');

const app = express();
const server = http.createServer(app);

// ... άλλες ρυθμίσεις και middleware ...

websocketService.init(server);

// ... routes και άλλες ρυθμίσεις ...

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${server.address().port}`);
});
