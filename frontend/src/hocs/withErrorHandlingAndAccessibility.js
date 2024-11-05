import React from 'react';
import { Typography } from '@mui/material';

export const withErrorHandlingAndAccessibility = (WrappedComponent) => {
  return class extends React.Component {
    state = {
      hasError: false,
      error: null
    };

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <Typography color="error">
            Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.
          </Typography>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withErrorHandlingAndAccessibility;
