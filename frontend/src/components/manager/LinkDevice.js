import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../config/config";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Snackbar,
} from "@mui/material";

const LinkDevice = ({ open, handleClose }) => {
  const [newTruck, setNewTruck] = useState({
    wasteType: "",
    userId: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); // Start loading
      setErrorMessage(null); // Clear any previous error messages
      try {
        const res = await axios.get(`${API_URL}/user/getusers?role=user`, {
          withCredentials: true,
        });
        const data = res.data;

        if (data.success === false) {
          setErrorMessage(data.message);
        } else {
          const completedUsers = data.filter((user) => user.isCompleted);
          setUsers(completedUsers);
        }
      } catch (error) {
        const errMsg = error.response?.data?.message || "User already has a linked device";
        setErrorMessage(errMsg); // Handle backend error response
        console.error(errMsg);
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchUser();
  }, [open]);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTruck((prevDevice) => ({
      ...prevDevice,
      [name]: value,
    }));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async () => {
    try {
      // Send newTruck data to the backend
      await axios.post(`${API_URL}/wasteDevice/add-device`, newTruck);
      setOpenSnackbar(true);
      setErrorMessage(null);
      handleClose(); // Close the modal after successful submission
    } catch (error) {
      setErrorMessage("Failed to link device.");
      setOpenSnackbar(true);
    }
  };
  return (
    <>
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Waste Type</InputLabel>
          <Select
            name="wasteType"
            value={newTruck.wasteType}
            onChange={handleChange}
            label="Waste Type"
          >
            <MenuItem value="organic">Organic</MenuItem>
            <MenuItem value="recyclable">Recycle</MenuItem>
            <MenuItem value="non-recyclable">Non-Recycle</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>User</InputLabel>
          <Select
            name="userId"
            value={newTruck.userId}
            onChange={handleChange}
            label="User"
          >
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Link Device
        </Button>

        
      </Box>
    </Modal>
    <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={errorMessage ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {errorMessage || "Device linked successfully!"}
          </Alert>
        </Snackbar>
</>
  );
};

export default LinkDevice;
