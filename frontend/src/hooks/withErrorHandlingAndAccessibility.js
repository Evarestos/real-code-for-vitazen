import React from 'react';
import { Typography } from  '@mui/material';

const withErrorHandlingAndAccessibility = (WrappedComponent) => {
  return function WithErrorHandlingAndAccessibility(props) {
    return <WrappedComponent {...props} />;
  };
};

export default withErrorHandlingAndAccessibility;
