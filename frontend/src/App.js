import React, { Suspense } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { theme } from './theme/index.js';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { QueryClient, QueryClientProvider } from 'react-query';

// Δημιουργία του QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Lazy loading components
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const AIChatAssistant = React.lazy(() => import('./pages/AIChatAssistant'));
const ProgramsPage = React.lazy(() => import('./pages/ProgramsPage'));
const WorkoutProgram = React.lazy(() => import('./pages/WorkoutProgram'));
const WellnessLibrary = React.lazy(() => import('./pages/WellnessLibrary'));
const Layout = React.lazy(() => import('./components/Layout'));

// Loading component
const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </div>
);

function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WebSocketProvider>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Router>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/auth" element={
                      !isAuthenticated ? <AuthPage /> : <Navigate to="/" />
                    } />

                    <Route element={<Layout />}>
                      <Route path="/" element={
                        isAuthenticated ? <Navigate to="/chat" /> : <Navigate to="/auth" />
                      } />
                      <Route path="/chat" element={
                        isAuthenticated ? <AIChatAssistant /> : <Navigate to="/auth" />
                      } />
                      <Route path="/programs" element={
                        isAuthenticated ? <ProgramsPage /> : <Navigate to="/auth" />
                      } />
                      <Route path="/workout/:id" element={
                        isAuthenticated ? <WorkoutProgram /> : <Navigate to="/auth" />
                      } />
                      <Route path="/library" element={
                        isAuthenticated ? <WellnessLibrary /> : <Navigate to="/auth" />
                      } />
                    </Route>
                  </Routes>
                </Suspense>
                <ToastContainer />
              </Router>
            </LocalizationProvider>
          </ThemeProvider>
        </WebSocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
