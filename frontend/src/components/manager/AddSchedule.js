import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Chip,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import axios from "axios";

const AddSchedule = ({ onClose }) => {
  const [personals, setPersonals] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState("");
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const availablePersonals = ["Palitha Weerasinghe", "John Doe", "Jane Smith"];

  useEffect(() => {
    const fetchTrucks = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5002/api/trucks/numbers", {
          withCredentials: true,
        });
        setTrucks(res.data);
      } catch (err) {
        setError("Failed to fetch trucks");
        console.error("Truck fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrucks();
  }, []);

  const handlePersonalChange = (event) => {
    setPersonals(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add schedule submission logic here
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid2 container spacing={2} columns={16}>
        {/* Header */}
        <Grid2
          size={{ xs: 16 }}
          container
          justifyContent="space-between"
          alignItems="center"
        >
          <h2>Add New Schedule</h2>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Grid2>

        {/* Select Date */}
        <Grid2 size={{ xs: 16, sm: 8 }}>
          <InputLabel shrink id="date-input">
            Select Date
          </InputLabel>
          <TextField fullWidth id="date-input" type="date" sx={{ mb: 2 }} />
        </Grid2>

        {/* Select Time */}
        <Grid2 size={{ xs: 6, sm: 8 }}>
          <InputLabel shrink htmlFor="time-input">
            Select Time
          </InputLabel>
          <TextField
            fullWidth
            id="time-input"
            type="time"
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid2>

        <Grid2 size={{ xs: 6, sm: 8 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="truck-select-label">Assign a Truck</InputLabel>
            <Select
              labelId="truck-select-label"
              id="truck-select"
              label="Assign a Truck"
              value={selectedTruck}
              onChange={(e) => setSelectedTruck(e.target.value)}
            >
              <MenuItem value="Truck 1">Truck 1</MenuItem>
              {loading ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : error ? (
                <MenuItem disabled>{error}</MenuItem>
              ) : (
                trucks.map((truck) => (
                  <MenuItem key={truck._id} value={truck.numberPlate}>
                    {truck.numberPlate}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid2>

        {/* Personal Selection */}
        <Grid2 size={{ xs: 6, sm: 8 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="personal-select-label">Assign Personal</InputLabel>
            <Select
              multiple
              labelId="personal-select-label"
              id="personal-select"
              label="Assign Personal"
              value={personals}
              onChange={handlePersonalChange}
              renderValue={(selected) => (
                <div>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </div>
              )}
            >
              {availablePersonals.map((personal) => (
                <MenuItem key={personal} value={personal}>
                  {personal}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>

        {/* Waste Type Checkboxes */}
        <Grid2 item xs={16} sm={4}>
          <FormControlLabel control={<Checkbox />} label="Organic" />
        </Grid2>
        <Grid2 item xs={16} sm={4}>
          <FormControlLabel control={<Checkbox />} label="Recycle" />
        </Grid2>
        <Grid2 item xs={16} sm={4}>
          <FormControlLabel control={<Checkbox />} label="Non Recycle" />
        </Grid2>
        <Grid2 item xs={16} sm={4}>
          <FormControlLabel control={<Checkbox />} label="Special" />
        </Grid2>

        {/* Submit Button */}
        <Grid2 item xs={16}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Add Route
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );
};

export default AddSchedule;
