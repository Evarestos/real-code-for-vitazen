import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const useAnalytics = () => {
  const dispatch = useDispatch();

  const trackEvent = useCallback((eventType, eventData) => {
    dispatch({
      type: 'TRACK_ANALYTICS_EVENT',
      meta: {
        analytics: {
          eventType,
          eventData
        }
      }
    });
  }, [dispatch]);

  return { trackEvent };
};
