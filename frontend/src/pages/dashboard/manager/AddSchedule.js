import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, Checkbox, Container, FormControl, FormControlLabel,
  Grid, InputLabel, MenuItem, Paper, Select, Snackbar, TextField, Typography, Alert, Box
} from '@mui/material';

const AddSchedule = () => {
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [special, setSpecial] = useState(false);
  const [trucks, setTrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5002/api/trucks/', {
          withCredentials: true
        });
        let fetchedTrucks = res.data || [];

        // ✅ Ensure "Truck 1" is always included
        const hasTruck1 = fetchedTrucks.some(truck => truck.numberPlate === "Truck 1");

        if (!hasTruck1) {
          fetchedTrucks = [
            { _id: "truck-1-manual", numberPlate: "Truck 1" },
            ...fetchedTrucks,
          ];
        }

        setTrucks(fetchedTrucks);
      } catch (error) {
        console.error('Failed to fetch trucks');
      }
    };

    fetchTrucks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!time || !address || !selectedTruck) {
      setSnackbar({ open: true, message: 'All fields are required.', severity: 'error' });
      return;
    }

    try {
      await axios.post('http://localhost:5002/api/schedules', {
        time,
        address,
        special,
        truckNumber: selectedTruck,
      });

      setSnackbar({ open: true, message: 'Schedule added!', severity: 'success' });

      // Reset form
      setTime('');
      setAddress('');
      setSpecial(false);
      setSelectedTruck('');
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to add schedule.',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h6" align="center">Add Schedule</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Time"
                type="datetime-local"
                fullWidth
                value={time}
                onChange={(e) => setTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Address (City Name)"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Truck</InputLabel>
                <Select
                  value={selectedTruck}
                  onChange={(e) => setSelectedTruck(e.target.value)}
                  label="Select Truck"
                >
                  {trucks.map((truck) => (
                    <MenuItem key={truck._id} value={truck.numberPlate}>
                      {truck.numberPlate}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={special}
                    onChange={(e) => setSpecial(e.target.checked)}
                    color="primary"
                  />
                }
                label="Mark as Special"
              />
            </Grid>

            <Grid item xs={12}>
              <Box textAlign="center">
                <Button variant="contained" color="primary" type="submit">
                  Add Schedule
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default AddSchedule;
