import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Typography, Alert } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

const AdvancedFilters = ({ onFilterChange }) => {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const categories = ['Ψυχοθεραπεία', 'Γυμναστική', 'Διατροφή', 'Γενικά'];
  const tags = ['Άγχος', 'Κατάθλιψη', 'Άσκηση', 'Διατροφή', 'Ύπνος', 'Διαλογισμός'];

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onFilterChange({ startDate: start, endDate: end });
  };

  const handleCategoryChange = (event) => {
    setSelectedCategories(event.target.value);
    onFilterChange({ categories: event.target.value });
  };

  const handleTagChange = (event) => {
    setSelectedTags(event.target.value);
    onFilterChange({ tags: event.target.value });
  };

  const applyFilters = () => {
    onFilterChange({
      startDate,
      endDate,
      categories: selectedCategories,
      tags: selectedTags,
    });
  };

  return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
      />
      <FormControl className={classes.formControl}>
        <InputLabel>Κατηγορίες</InputLabel>
        <Select
          multiple
          value={selectedCategories}
          onChange={handleCategoryChange}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel>Tags</InputLabel>
        <Select
          multiple
          value={selectedTags}
          onChange={handleTagChange}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
        >
          {tags.map((tag) => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={applyFilters}>
        Εφαρμογή Φίλτρων
      </Button>
    </div>
  );
};

export default AdvancedFilters;
