import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { withErrorHandlingAndAccessibility } from '../hocs/withErrorHandlingAndAccessibility';

const WeeklySchedule = () => {
  const schedule = [
    { day: 'Δευτέρα', activity: 'Τρέξιμο' },
    { day: 'Τρίτη', activity: 'Yoga' },
    { day: 'Τετάρτη', activity: 'Κολύμβηση' },
    { day: 'Πέμπτη', activity: 'Ξεκούραση' },
    { day: 'Παρασκευή', activity: 'Βάρη' },
    { day: 'Σάββατο', activity: 'Ποδήλατο' },
    { day: 'Κυριακή', activity: 'Περπάτημα' },
  ];

  return (
    <TableContainer component={Paper}>
      <Table aria-label="weekly schedule">
        <TableHead>
          <TableRow>
            <TableCell>Ημέρα</TableCell>
            <TableCell>Δραστηριότητα</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedule.map((row) => (
            <TableRow key={row.day}>
              <TableCell component="th" scope="row">
                {row.day}
              </TableCell>
              <TableCell>{row.activity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default withErrorHandlingAndAccessibility(WeeklySchedule);
