import React, { useState } from "react";
import { Box, Modal, TextField, Button, Typography } from "@mui/material";
import { API_URL } from "../../config/config";
import axios from "axios";
import CustomSnackbar from "../CustomSnackbar";

const AddTrucks = ({ open, handleClose }) => {
  const [newTruck, setNewTruck] = useState({
    brand: "",
    numberPlate: "",
    capacity: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTruck((prevTruck) => ({
      ...prevTruck,
      [name]: value,
    }));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/truck/addtrucks`, newTruck, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const data = res.data;
      if (data.success === false) {
        setErrorMessage(data.message);
        if (data.statusCode === 500) {
          setErrorMessage("Number plate already exists");
        } 
      } else {
        handleClose();
        // Reset form
        setOpenSnackbar(true);
        setNewTruck({ brand: "", numberPlate: "", capacity: "" });
        setErrorMessage(null); // Clear error message after a successful submission
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Number plate already exists"
      );
    }
  };

  return (
    <>
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          Add a New Truck
        </Typography>
        {errorMessage && (
          <Typography color="error" align="center" mt={1} mb={2}>
            {errorMessage}
          </Typography>
        )}
        <TextField
          margin="dense"
          label="Truck Brand"
          name="brand"
          required
          fullWidth
          variant="outlined"
          value={newTruck.brand}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Number Plate"
          name="numberPlate"
          required
          fullWidth
          variant="outlined"
          value={newTruck.numberPlate}
          onChange={handleChange}
        />
        <TextField
          type="number"
          margin="dense"
          label="Capacity (kg)"
          name="capacity"
          required
          fullWidth
          variant="outlined"
          value={newTruck.capacity}
          onChange={handleChange}
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={handleClose} color="secondary.light" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add Truck
          </Button>
        </Box>
      </Box>
        
    </Modal>
    <CustomSnackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={"Truck added successfully"}
        severity={"success"}
      />
    </>
  );
};

export default AddTrucks;
