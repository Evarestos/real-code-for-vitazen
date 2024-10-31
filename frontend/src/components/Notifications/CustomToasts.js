import React from 'react';
import { toast } from 'react-toastify';
import { Button, LinearProgress } from  '@mui/material';
import { Check, Error, Warning, Info } from  '@mui/material';


export const SuccessToast = ({ closeToast, message }) => (
  <div>
    <Check style={{ color: 'green', marginRight: '10px' }} />
    {message}
  </div>
);

export const ErrorToast = ({ closeToast, message }) => (
  <div>
    <Error style={{ color: 'red', marginRight: '10px' }} />
    {message}
  </div>
);

export const WarningToast = ({ closeToast, message }) => (
  <div>
    <Warning style={{ color: 'orange', marginRight: '10px' }} />
    {message}
  </div>
);

export const InfoToast = ({ closeToast, message }) => (
  <div>
    <Info style={{ color: 'blue', marginRight: '10px' }} />
    {message}
  </div>
);

export const ActionToast = ({ closeToast, message, action }) => (
  <div>
    <p>{message}</p>
    <Button onClick={action} color="primary" size="small">
      Ενέργεια
    </Button>
  </div>
);

export const ProgressToast = ({ closeToast, message, progress }) => (
  <div>
    <p>{message}</p>
    <LinearProgress variant="determinate" value={progress} />
  </div>
);
