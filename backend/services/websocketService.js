const socketIo = require('socket.io');
const FeedbackAnalytics = require('./feedbackAnalytics');

let io;

const websocketService = {
  init: (server) => {
    io = socketIo(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('New client connected');

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  },

  emitFeedbackUpdate: async () => {
    if (!io) return;

    try {
      const statistics = await FeedbackAnalytics.getFeedbackStatistics();
      const insights = await FeedbackAnalytics.getFeedbackInsights();

      io.emit('feedbackUpdate', { statistics, insights });
    } catch (error) {
      console.error('Error emitting feedback update:', error);
    }
  }
};

module.exports = websocketService;
