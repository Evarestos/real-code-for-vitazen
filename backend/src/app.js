import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import PersonalPrograms from './pages/PersonalPrograms';
import AIAssistant from './components/AIAssistant';
import Notification from './components/Notification';
import responseTimeLogger from './middleware/responseTimeLogger';
import aiRoutes from './routes/aiRoutes';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      render={props =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

function App() {
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const handleNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <AuthProvider>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" render={(props) => <Dashboard {...props} onNotification={handleNotification} />} />
          <Route path="/register" render={(props) => <Register {...props} onNotification={handleNotification} />} />
          <Route path="/login" render={(props) => <Login {...props} onNotification={handleNotification} />} />
          <PrivateRoute path="/programs" render={(props) => <PersonalPrograms {...props} onNotification={handleNotification} />} />
          <PrivateRoute path="/ai-assistant" render={(props) => <AIAssistant {...props} onNotification={handleNotification} />} />
        </Switch>
        <Notification 
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          onClose={closeNotification}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
