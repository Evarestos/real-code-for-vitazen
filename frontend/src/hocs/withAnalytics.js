import React from 'react';
import { useDispatch } from 'react-redux';

export const withAnalytics = (WrappedComponent) => {
  return (props) => {
    const dispatch = useDispatch();

    const trackEvent = (eventType, eventData) => {
      dispatch({
        type: 'TRACK_ANALYTICS_EVENT',
        meta: {
          analytics: {
            eventType,
            eventData
          }
        }
      });
    };

    return <WrappedComponent {...props} trackEvent={trackEvent} />;
  };
};
