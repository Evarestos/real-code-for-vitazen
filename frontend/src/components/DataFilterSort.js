import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@material-ui/core';

const DataFilterSort = ({ onFilterSort }) => {
  const [filterField, setFilterField] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleApply = () => {
    onFilterSort({
      filter: { field: filterField, value: filterValue },
      sort: { field: sortField, order: sortOrder }
    });
  };

  return (
    <div>
      <FormControl>
        <InputLabel>Φίλτρο</InputLabel>
        <Select value={filterField} onChange={(e) => setFilterField(e.target.value)}>
          <MenuItem value="date">Ημερομηνία</MenuItem>
          <MenuItem value="performance">Απόδοση</MenuItem>
          {/* Add more filter options as needed */}
        </Select>
      </FormControl>
      <TextField
        label="Τιμή φίλτρου"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />
      <FormControl>
        <InputLabel>Ταξινόμηση</InputLabel>
        <Select value={sortField} onChange={(e) => setSortField(e.target.value)}>
          <MenuItem value="date">Ημερομηνία</MenuItem>
          <MenuItem value="performance">Απόδοση</MenuItem>
          {/* Add more sort options as needed */}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Σειρά ταξινόμησης</InputLabel>
        <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <MenuItem value="asc">Αύξουσα</MenuItem>
          <MenuItem value="desc">Φθίνουσα</MenuItem>
        </Select>
      </FormControl>
      <Button onClick={handleApply}>Εφαρμογή</Button>
    </div>
  );
};

export default DataFilterSort;
