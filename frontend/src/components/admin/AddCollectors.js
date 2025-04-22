import React, { useState } from "react";
import { TextField, Button, Box, Modal, Typography } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../config/config";
import CustomSnackbar from "../CustomSnackbar";

const AddCollector = ({ open, handleClose }) => {
  const [newCollector, setNewCollector] = useState({
    username: "",
    email: "",
    nic: "",
    phone: "",
    address: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCollector((prevCollector) => ({
      ...prevCollector,
      [name]: value,
    }));
  };

  // Submit form and pass collector data back to parent
  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i; // Basic email validation
    const phoneRegex = /^\d{10}$/; // Validates 10-digit phone numbers
    const nicRegex = /^[0-9]{9}[vVxX]$|^[0-9]{12}$/; // Validates old (9 digits + V/X) or new (12 digits) NIC formats
    // Client-side validation
    if (
      !newCollector.username ||
      !newCollector.email ||
      !newCollector.nic ||
      !newCollector.phone ||
      !newCollector.address
    ) {
      return setErrorMessage("Please fill out all fields.");
    }
    if (!emailRegex.test(newCollector.email)) {
      return setErrorMessage("Please enter a valid email address.");
    }

    if (!phoneRegex.test(newCollector.phone)) {
      return setErrorMessage("Phone number must be 10 digits.");
    }

    if (!nicRegex.test(newCollector.nic)) {
      return setErrorMessage("Please enter a valid NIC.");
    }

    try {
      const res = await axios.post(
        `${API_URL}/user/addUsers?role=collector`,
        newCollector,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const data = res.data;
      if (data.success === false) {
        setErrorMessage(data.message);
        if (data.statusCode === 500) {
          setErrorMessage("User already exists");
        }
      } else {
        setOpenSnackbar(true);
        setSuccessMessage(data);
        handleClose();
        setNewCollector({
          username: "",
          email: "",
          nic: "",
          phone: "",
          address: "",
        });
        setErrorMessage(null);
      } // Reset form
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
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
            Add a New Collector
          </Typography>
          {errorMessage && (
            <Typography color="error" align="center" mt={1} mb={2}>
              {errorMessage}
            </Typography>
          )}
          <TextField
            margin="dense"
            label="Username"
            name="username"
            fullWidth
            variant="outlined"
            value={newCollector.username}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            fullWidth
            required
            variant="outlined"
            value={newCollector.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="NIC"
            name="nic"
            fullWidth
            variant="outlined"
            value={newCollector.nic}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Phone"
            name="phone"
            fullWidth
            variant="outlined"
            value={newCollector.phone}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Address"
            name="address"
            fullWidth
            variant="outlined"
            value={newCollector.address}
            onChange={handleChange}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              onClick={handleClose}
              color="secondary.light"
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Add Collector
            </Button>
          </Box>
        </Box>
      </Modal>
      <CustomSnackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={successMessage}
        severity={"success"}
      />
    </>
  );
};

export default AddCollector;
