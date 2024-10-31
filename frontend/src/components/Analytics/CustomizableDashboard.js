import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { IconButton, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import { Close, ExpandLess, ExpandMore, Save, Undo, Redo } from '@material-ui/icons';
import RecommendationPerformance from './RecommendationPerformance';
import UserBehaviorAnalytics from './UserBehaviorAnalytics';
import ABTestResults from './ABTestResults';
import dashboardPreferenceService from '../../services/dashboardPreferenceService';

const ResponsiveGridLayout = WidthProvider(Responsive);

const CustomizableDashboard = ({ startDate, endDate }) => {
  const [layout, setLayout] = useState([]);
  const [collapsedPanels, setCollapsedPanels] = useState({});
  const [preferences, setPreferences] = useState([]);
  const [currentPreference, setCurrentPreference] = useState(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newPreferenceName, setNewPreferenceName] = useState('');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await dashboardPreferenceService.getPreferences();
      setPreferences(prefs);
      const defaultPref = prefs.find(p => p.isDefault) || prefs[0];
      if (defaultPref) {
        setCurrentPreference(defaultPref);
        setLayout(defaultPref.versions[defaultPref.currentVersion].layout);
      }
    } catch (error) {
      console.error('Error loading dashboard preferences:', error);
    }
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  const togglePanelCollapse = (key) => {
    setCollapsedPanels(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const removePanel = (key) => {
    setLayout(layout.filter(item => item.i !== key));
  };

  const renderWidget = (key) => {
    switch (key) {
      case 'recommendationPerformance':
        return <RecommendationPerformance startDate={startDate} endDate={endDate} />;
      case 'userBehavior':
        return <UserBehaviorAnalytics startDate={startDate} endDate={endDate} />;
      case 'abTestResults':
        return <ABTestResults />;
      default:
        return null;
    }
  };

  const handleSavePreference = async () => {
    try {
      if (currentPreference) {
        await dashboardPreferenceService.updatePreference(currentPreference._id, layout, {});
      } else {
        await dashboardPreferenceService.savePreference(newPreferenceName, layout, {});
      }
      setSaveDialogOpen(false);
      setNewPreferenceName('');
      await loadPreferences();
    } catch (error) {
      console.error('Error saving dashboard preference:', error);
    }
  };

  const handleUndo = async () => {
    try {
      if (currentPreference) {
        const updatedPreference = await dashboardPreferenceService.undo(currentPreference._id);
        setCurrentPreference(updatedPreference);
        setLayout(updatedPreference.versions[updatedPreference.currentVersion].layout);
      }
    } catch (error) {
      console.error('Error undoing change:', error);
    }
  };

  const handleRedo = async () => {
    try {
      if (currentPreference) {
        const updatedPreference = await dashboardPreferenceService.redo(currentPreference._id);
        setCurrentPreference(updatedPreference);
        setLayout(updatedPreference.versions[updatedPreference.currentVersion].layout);
      }
    } catch (error) {
      console.error('Error redoing change:', error);
    }
  };

  return (
    <div>
      <Button onClick={() => setSaveDialogOpen(true)} startIcon={<Save />}>
        Save Layout
      </Button>
      <Button onClick={handleUndo} startIcon={<Undo />}>
        Undo
      </Button>
      <Button onClick={handleRedo} startIcon={<Redo />}>
        Redo
      </Button>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        onLayoutChange={handleLayoutChange}
      >
        {layout.map((item) => (
          <Paper key={item.i} style={{ height: '100%', overflow: 'hidden' }}>
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{item.i}</Typography>
              <div>
                <IconButton size="small" onClick={() => togglePanelCollapse(item.i)}>
                  {collapsedPanels[item.i] ? <ExpandMore /> : <ExpandLess />}
                </IconButton>
                <IconButton size="small" onClick={() => removePanel(item.i)}>
                  <Close />
                </IconButton>
              </div>
            </div>
            <div style={{ height: 'calc(100% - 40px)', overflow: 'auto', display: collapsedPanels[item.i] ? 'none' : 'block' }}>
              {renderWidget(item.i)}
            </div>
          </Paper>
        ))}
      </ResponsiveGridLayout>
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Dashboard Layout</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Layout Name"
            type="text"
            fullWidth
            value={newPreferenceName}
            onChange={(e) => setNewPreferenceName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSavePreference} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomizableDashboard;
