import React, { useState, useEffect } from 'react';
import { 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Typography, 
  TextField, 
  Paper,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import QRCode from 'qrcode.react';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import { Alert } from '@mui/material';

const steps = ['Ενεργοποίηση 2FA', 'Σάρωση QR Code', 'Επαλήθευση', 'Εφεδρικοί Κωδικοί'];

const TwoFactorSetup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [secretKey, setSecretKey] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [error, setError] = useState('');
  const { currentUser, updateUser } = useAuth();

  useEffect(() => {
    if (activeStep === 1) {
      setupTwoFactor();
    }
  }, [activeStep]);

  const setupTwoFactor = async () => {
    try {
      const response = await authService.setup2FA(currentUser.id);
      setSecretKey(response.secret);
      setQrCodeUrl(response.qrCodeDataUrl);
    } catch (error) {
      setError('Σφάλμα κατά την ρύθμιση του 2FA');
      console.error(error);
    }
  };

  const verifyCode = async () => {
    try {
      await authService.verify2FA(currentUser.id, verificationCode);
      setActiveStep(3);
      generateBackupCodes();
    } catch (error) {
      setError('Λάθος κωδικός επαλήθευσης');
    }
  };

  const generateBackupCodes = async () => {
    try {
      const codes = await authService.generateBackupCodes(currentUser.id);
      setBackupCodes(codes);
    } catch (error) {
      setError('Σφάλμα κατά τη δημιουργία εφεδρικών κωδικών');
    }
  };

  const handleNext = () => {
    if (activeStep === 2) {
      verifyCode();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const finishSetup = async () => {
    try {
      await authService.enable2FA(currentUser.id);
      updateUser({ ...currentUser, twoFactorEnabled: true });
      // Redirect to profile or dashboard
    } catch (error) {
      setError('Σφάλμα κατά την ενεργοποίηση του 2FA');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Typography>
            Το Two-Factor Authentication προσθέτει ένα επιπλέον επίπεδο ασφάλειας στον λογαριασμό σας. 
            Θα χρειαστείτε μια εφαρμογή όπως το Google Authenticator ή το Authy.
          </Typography>
        );
      case 1:
        return (
          <div>
            <Typography>Σαρώστε αυτόν τον QR κωδικό με την εφαρμογή σας:</Typography>
            {qrCodeUrl && <QRCode value={qrCodeUrl} size={256} />}
            <Typography>Ή εισάγετε αυτό το κλειδί χειροκίνητα: {secretKey}</Typography>
          </div>
        );
      case 2:
        return (
          <TextField
            label="Κωδικός Επαλήθευσης"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            fullWidth
          />
        );
      case 3:
        return (
          <div>
            <Typography>Αποθηκεύστε αυτούς τους εφεδρικούς κωδικούς σε ασφαλές μέρος:</Typography>
            <List>
              {backupCodes.map((code, index) => (
                <ListItem key={index}>
                  <ListItemText primary={code} />
                </ListItem>
              ))}
            </List>
          </div>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Paper style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography>Η ρύθμιση του 2FA ολοκληρώθηκε!</Typography>
            <Button onClick={finishSetup}>Ολοκλήρωση</Button>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep)}
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Πίσω
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? 'Ολοκλήρωση' : 'Επόμενο'}
              </Button>
            </div>
          </div>
        )}
      </div>
      {error && <Typography color="error">{error}</Typography>}
    </Paper>
  );
};

export default TwoFactorSetup;
