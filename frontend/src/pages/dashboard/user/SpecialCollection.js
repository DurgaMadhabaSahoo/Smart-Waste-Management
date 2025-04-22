import React, { useState } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import { API_URL } from "../../../config/config";
import { useSelector } from "react-redux";
import CustomSnackbar from "../../../components/CustomSnackbar";

const SpecialCollection = () => {
  const [wasteType, setWasteType] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [emergencyCollection, setEmergencyCollection] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Clear any previous errors

    // Validate fields
    if (!wasteType || !date || !description) {
      setErrorMessage("All fields are required.");
      return;
    }

    // Date validation (cannot select past date)
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setErrorMessage("Cannot select a past date.");
      return;
    }

    // Prepare form data to be sent to the backend
    const formData = {
      wasteType,
      chooseDate: date, // Ensure this is the correct format (string)
      wasteDescription: description,
      emergencyCollection,
      user: currentUser?._id,
    };

    try {
      // Ensure the API URL is correct, including `/special-collections` as defined in your backend route
      const response = await axios.post(`${API_URL}/special-collections`, formData);
      console.log("Saved:", response.data);

      setSnackbarMessage("Special collection request submitted!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Clear form after successful submission
      setWasteType("");
      setDate("");
      setDescription("");
      setEmergencyCollection(false);
    } catch (error) {
      console.error("Save failed:", error?.response?.data || error.message);
      const errorMsg = error?.response?.data?.message || "Failed to save data. Please try again.";
      setSnackbarMessage(errorMsg);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: 600,
        margin: "auto",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "white",
      }}
    >
      {/* Waste Type Select */}
      <FormControl fullWidth required>
        <InputLabel>Select waste type</InputLabel>
        <Select
          value={wasteType}
          onChange={(e) => setWasteType(e.target.value)}
          label="Select waste type"
        >
          {["Organic", "Plastic", "Metal", "Electronic", "Hazardous"].map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Date Input */}
      <TextField
        fullWidth
        label="Choose Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        inputProps={{ min: new Date().toISOString().split("T")[0] }}
        required
      />

      {/* Description Input */}
      <TextField
        label="Enter waste description"
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      {/* Emergency Collection Checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={emergencyCollection}
            onChange={(e) => setEmergencyCollection(e.target.checked)}
          />
        }
        label="Emergency waste collection"
      />

      {/* Error Message Display */}
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

      {/* Submit Button */}
      <Button variant="contained" type="submit" color="success">
        Submit
      </Button>

      {/* Snackbar for Success/Error */}
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
};

export default SpecialCollection;
