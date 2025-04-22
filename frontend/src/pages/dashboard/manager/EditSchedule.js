// src/components/EditSchedule.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert
} from '@mui/material';

const EditSchedule = () => {
  const { id } = useParams(); // Get the schedule ID from the URL
  const navigate = useNavigate();

  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [code, setCode] = useState('');
  const [special, setSpecial] = useState(false);
  const [truckNumber, setTruckNumber] = useState('');
  const [garbageCollectorId, setGarbageCollectorId] = useState('');
  const [weight, setWeight] = useState('');
  const [type, setType] = useState('');
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch schedule details and trucks on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scheduleRes, trucksRes] = await Promise.all([
          axios.get(`http://localhost:5002/api/schedules/${id}`),
          axios.get('http://localhost:5002/api/truck/')
        ]);

        const schedule = scheduleRes.data;
        setTime(schedule.time.substring(0, 16)); // Format for datetime-local input
        setAddress(schedule.address);
        setCode(schedule.code);
        setSpecial(schedule.special);
        setTruckNumber(schedule.truckNumber);
        setGarbageCollectorId(schedule.garbageCollectorId || '');
        setWeight(schedule.weight || '');
        setType(schedule.type || '');
        setTrucks(trucksRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch schedule details.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!time || !address || !code || !truckNumber) {
      setError('All required fields must be filled.');
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError('Code must be a 6-digit number.');
      return;
    }

    try {
      await axios.put(`http://localhost:5002/api/schedules/update/${id}`, {
        time,
        address,
        code,
        special,
        truckNumber,
        garbageCollectorId,
        weight: weight ? Number(weight) : null,
        type
      });

      navigate('/dashboard/schedule'); // Redirect after successful update
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update schedule.'
      );
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading schedule details...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 10 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Edit Schedule
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Time */}
            <Grid item xs={12}>
              <TextField
                label="Time"
                type="datetime-local"
                fullWidth
                value={time}
                onChange={(e) => setTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            {/* Address */}
            <Grid item xs={12}>
              <TextField
                label="Address (City Name)"
                type="text"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., Horana"
                required
              />
            </Grid>
            {/* Code */}
            <Grid item xs={12}>
              <TextField
                label="6-Digit Code"
                type="text"
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                inputProps={{ maxLength: 6 }}
                required
              />
            </Grid>
            {/* Truck Number Dropdown */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="truck-select-label">Select Truck Number</InputLabel>
                <Select
                  labelId="truck-select-label"
                  value={truckNumber}
                  onChange={(e) => setTruckNumber(e.target.value)}
                  label="Select Truck Number"
                >
                  {trucks.map((truck) => (
                    <MenuItem key={truck._id} value={truck.numberPlate}>
                      {truck.numberPlate}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Garbage Collector ID */}
            <Grid item xs={12}>
              <TextField
                label="Garbage Collector ID"
                type="text"
                fullWidth
                value={garbageCollectorId}
                onChange={(e) => setGarbageCollectorId(e.target.value)}
                placeholder="Collector ID"
              />
            </Grid>
            {/* Weight */}
            <Grid item xs={12}>
              <TextField
                label="Weight (kg)"
                type="number"
                fullWidth
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 5"
                inputProps={{ min: 0 }}
              />
            </Grid>
            {/* Type */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="type-of-garbage-label">Type of Garbage</InputLabel>
                <Select
                  labelId="type-of-garbage-label"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value="Organic">Organic</MenuItem>
                  <MenuItem value="Recycle">Recyclable</MenuItem>
                  <MenuItem value="NonRecycle">Non-Recyclable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Special Checkbox */}
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
            {/* Error Message */}
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            {/* Submit Button */}
            <Grid item xs={12}>
              <Box textAlign="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Update Schedule
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditSchedule;
