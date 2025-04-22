import React, { useState } from "react";
import {
  Box,
  Modal,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import { API_URL } from "../../config/config";

const UpdateTruck = ({ open, handleClose, truck, success }) => {
  const [updatedTruck, setUpdatedTruck] = useState(truck);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTruck((prevTruck) => ({
      ...prevTruck,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_URL}/truck/updatetruck/${updatedTruck._id}`,
        updatedTruck,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const data = res.data;
      if (data.success === false) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage(null);
        handleClose();
        success();  
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
    }
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

  return (
    <>
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          Update Truck
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
          fullWidth
          variant="outlined"
          value={updatedTruck.brand}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Number Plate"
          name="numberPlate"
          fullWidth
          variant="outlined"
          value={updatedTruck.numberPlate}
          onChange={handleChange}
        />
        <TextField
          type="number"
          margin="dense"
          label="Capacity (kg)"
          name="capacity"
          fullWidth
          variant="outlined"
          value={updatedTruck.capacity}
          onChange={handleChange}
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={handleClose} color="secondary.light" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Update Truck
          </Button>
        </Box>
      </Box>
    </Modal>
    </>
    
  );
};

export default UpdateTruck;
