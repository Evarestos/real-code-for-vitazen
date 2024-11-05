import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import analyticsService from '../services/analyticsService';

const SecurityOverview = () => {
  const { currentUser } = useAuth();
  const [securityData, setSecurityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSecurityData();
  }, [currentUser]);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getSecurityOverview(currentUser.id);
      setSecurityData(data);
    } catch (err) {
      setError('Failed to fetch security data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Loading security overview...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!securityData) return null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Security Overview</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Risk Score Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={securityData.riskScoreTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Active Threats</Typography>
            <Typography variant="h3">{securityData.activeThreats}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Device Statistics</Typography>
            <Typography>Total Devices: {securityData.deviceStats.total}</Typography>
            <Typography>Active Devices: {securityData.deviceStats.active}</Typography>
            <Typography>Trusted Devices: {securityData.deviceStats.trusted}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Recent Alerts</Typography>
            {securityData.recentAlerts.map((alert, index) => (
              <Typography key={index}>{alert.message} - {new Date(alert.timestamp).toLocaleString()}</Typography>
            ))}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={fetchSecurityData}>
          Refresh Data
        </Button>
      </Grid>
    </Grid>
  );
};

export default SecurityOverview;
