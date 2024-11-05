import api from '../utils/api';

const analyticsMiddleware = () => (next) => (action) => {
  if (action.meta && action.meta.analytics) {
    const { eventType, eventData } = action.meta.analytics;
    api.post('/analytics/event', { eventType, eventData })
      .catch(error => console.error('Error logging analytics event:', error));
  }
  return next(action);
};

export default analyticsMiddleware;
