import { createTheme } from '@mui/material/styles';

// Μετατρέπουμε το theme object σε MUI theme
export const theme = createTheme({
  palette: {
    primary: {
      main: '#00897B',
      light: '#4DB6AC',
      dark: '#00796B',
    },
    secondary: {
      main: '#B2DFDB',
      light: '#E0F2F1',
      dark: '#004D40',
    },
    background: {
      default: '#E0F2F1',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#004D40',
      secondary: '#00796B',
    }
  },
  spacing: (factor) => `${0.25 * factor}rem`,
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.05)',
    '0 4px 6px rgba(0, 0, 0, 0.1)',
    '0 10px 15px rgba(0, 0, 0, 0.1)',
    // ... προσθέστε περισσότερα shadows αν χρειάζεται
  ],
}); 