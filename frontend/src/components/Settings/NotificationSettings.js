import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Switch, Slider, TimePicker, Button, TextField } from  '@mui/material';
import { useNotifications } from '../../contexts/NotificationContext';
import { TimePicker as MuiTimePicker } from '@mui/x-date-pickers/TimePicker';

const NotificationSettings = () => {
  const { preferences, updatePreferences, resetPreferences } = useNotifications();
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleChange = (section, key, value) => {
    setLocalPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleCategoryChange = (category, key, value) => {
    setLocalPreferences(prev => ({
      ...prev,
      categoryPreferences: {
        ...prev.categoryPreferences,
        [category]: {
          ...prev.categoryPreferences[category],
          [key]: value
        }
      }
    }));
  };

  const handleSave = () => {
    updatePreferences(localPreferences);
  };

  const handleReset = () => {
    resetPreferences();
  };

  return (
    <div>
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="Γενικά" />
        <Tab label="Email" />
        <Tab label="Ήχος" />
        <Tab label="Ώρες Ησυχίας" />
        <Tab label="Κατηγορίες" />
      </Tabs>

      {activeTab === 0 && (
        <div>
          <Switch
            checked={localPreferences.notifications.toast.enabled}
            onChange={(e) => handleChange('notifications', 'toast', { ...localPreferences.notifications.toast, enabled: e.target.checked })}
          />
          <TextField
            type="number"
            label="Διάρκεια Toast (ms)"
            value={localPreferences.notifications.toast.duration}
            onChange={(e) => handleChange('notifications', 'toast', { ...localPreferences.notifications.toast, duration: parseInt(e.target.value) })}
          />
        </div>
      )}

      {activeTab === 1 && (
        <div>
          <Switch
            checked={localPreferences.notifications.email.enabled}
            onChange={(e) => handleChange('notifications', 'email', { ...localPreferences.notifications.email, enabled: e.target.checked })}
          />
          <select
            value={localPreferences.notifications.email.frequency}
            onChange={(e) => handleChange('notifications', 'email', { ...localPreferences.notifications.email, frequency: e.target.value })}
          >
            <option value="immediate">Άμεσα</option>
            <option value="daily">Καθημερινά</option>
            <option value="weekly">Εβδομαδιαία</option>
          </select>
        </div>
      )}

      {activeTab === 2 && (
        <div>
          <Switch
            checked={localPreferences.notifications.sound.enabled}
            onChange={(e) => handleChange('notifications', 'sound', { ...localPreferences.notifications.sound, enabled: e.target.checked })}
          />
          <Slider
            value={localPreferences.notifications.sound.volume}
            onChange={(e, newValue) => handleChange('notifications', 'sound', { ...localPreferences.notifications.sound, volume: newValue })}
            min={0}
            max={100}
            step={1}
          />
        </div>
      )}

      {activeTab === 3 && (
        <div>
          <Switch
            checked={localPreferences.quietHours.enabled}
            onChange={(e) => handleChange('quietHours', 'enabled', e.target.checked)}
          />
          <MuiTimePicker
            value={localPreferences.quietHours.start}
            onChange={(newValue) => handleChange('quietHours', 'start', newValue)}
          />
          <MuiTimePicker
            value={localPreferences.quietHours.end}
            onChange={(newValue) => handleChange('quietHours', 'end', newValue)}
          />
        </div>
      )}

      {activeTab === 4 && (
        <div>
          {Object.entries(localPreferences.categoryPreferences).map(([category, prefs]) => (
            <div key={category}>
              <Switch
                checked={prefs.enabled}
                onChange={(e) => handleCategoryChange(category, 'enabled', e.target.checked)}
              />
              <Slider
                value={prefs.priority}
                onChange={(e, newValue) => handleCategoryChange(category, 'priority', newValue)}
                min={1}
                max={5}
                step={1}
              />
            </div>
          ))}
        </div>
      )}

      <Button onClick={handleSave}>Αποθήκευση</Button>
      <Button onClick={handleReset}>Επαναφορά Προεπιλογών</Button>
    </div>
  );
};

export default NotificationSettings;
