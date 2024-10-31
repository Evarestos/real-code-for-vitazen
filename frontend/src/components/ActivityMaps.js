import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Card, CardContent, Typography, Grid, Slider, CircularProgress } from '@mui/material';
import { format, subDays } from 'date-fns';
import analyticsService from '../services/analyticsService';
import { useWebSocket } from '../contexts/WebSocketContext';

const ActivityMaps = () => {
  const [activityData, setActivityData] = useState([]);
  const [timeRange, setTimeRange] = useState([0, 30]); // Default to last 30 days
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const heatLayerRef = useRef(null);
  const markerClusterGroupRef = useRef(null);
  const { isConnected, subscribe } = useWebSocket();

  const fetchActivityData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getActivityData();
      setActivityData(data);
    } catch (err) {
      setError('Failed to fetch activity data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivityData();
  }, [fetchActivityData]);

  useEffect(() => {
    const unsubscribe = subscribe('newActivity', (newActivity) => {
      setActivityData(prevData => {
        const updatedData = [...prevData, newActivity];
        updateMap(updatedData);
        return updatedData;
      });
    });

    return unsubscribe;
  }, [subscribe]);

  useEffect(() => {
    if (mapRef.current && activityData.length > 0) {
      updateMap(activityData);
    }
  }, [activityData, timeRange]);

  const filterDataByTimeRange = useCallback(() => {
    const endDate = new Date();
    const startDate = subDays(endDate, timeRange[1]);
    return activityData.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      return activityDate >= startDate && activityDate <= endDate;
    });
  }, [activityData, timeRange]);

  const updateMap = useCallback((data) => {
    const map = mapRef.current;
    const filteredData = filterDataByTimeRange();

    // Update heatmap
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }
    const heatmapData = filteredData.map(activity => [
      activity.latitude,
      activity.longitude,
      activity.intensity
    ]);
    heatLayerRef.current = L.heatLayer(heatmapData, { radius: 25 }).addTo(map);

    // Update markers
    if (markerClusterGroupRef.current) {
      map.removeLayer(markerClusterGroupRef.current);
    }
    markerClusterGroupRef.current = L.markerClusterGroup();
    filteredData.forEach(activity => {
      const marker = L.marker([activity.latitude, activity.longitude]);
      marker.bindPopup(`
        <b>Activity:</b> ${activity.type}<br>
        <b>Time:</b> ${format(new Date(activity.timestamp), 'PPpp')}
      `);
      markerClusterGroupRef.current.addLayer(marker);
    });
    map.addLayer(markerClusterGroupRef.current);
  }, [filterDataByTimeRange]);

  const handleTimeRangeChange = (event, newValue) => {
    setTimeRange(newValue);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Activity Maps</Typography>
        <Typography color={isConnected ? "primary" : "error"}>
          {isConnected ? "Connected" : "Disconnected"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>Time Range: Last {timeRange[1]} days</Typography>
            <Slider
              value={timeRange}
              onChange={handleTimeRangeChange}
              valueLabelDisplay="auto"
              aria-labelledby="time-range-slider"
              min={1}
              max={30}
            />
          </Grid>
          <Grid item xs={12} style={{ height: '500px' }}>
            <MapContainer 
              center={[0, 0]} 
              zoom={2} 
              style={{ height: '100%', width: '100%' }}
              whenCreated={mapInstance => { mapRef.current = mapInstance; }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </MapContainer>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ActivityMaps;
