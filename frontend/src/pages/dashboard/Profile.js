import React, { useState } from "react";
import {
  Avatar,
  Typography,
  Paper,
  Button,
  CircularProgress,
  TextField,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../../config/config";
import {
  updateFailure,
  updateStart,
  updateSuccess,
} from "../../redux/user/userSlice";
import CustomSnackbar from "../../components/CustomSnackbar";

const Profile = () => {
  const { currentUser, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    nic: "",
  });

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateStart());
    setLoading(true);

    const phoneRegex = /^\d{10}$/;
    const nicRegex = /^[0-9]{9}[vVxX]$|^[0-9]{12}$/;

    if (!formData.phone || !formData.address || !formData.nic) {
      dispatch(updateFailure("All fields are required."));
      setLoading(false);
      return;
    }

    if (!phoneRegex.test(formData.phone)) {
      dispatch(updateFailure("Phone number must be exactly 10 digits."));
      setLoading(false);
      return;
    }

    if (!nicRegex.test(formData.nic)) {
      dispatch(updateFailure("Please enter a valid NIC."));
      setLoading(false);
      return;
    }

    try {
      const res = await axios.put(
        `${API_URL}/users/${currentUser._id}/complete-profile`,
        formData,
        { withCredentials: true }
      );

      const data = res.data;

      if (data.success === false) {
        dispatch(updateFailure(data.message));
      } else {
        dispatch(updateSuccess(data.user));
        setOpenSnackbar(true);
        setFormData({ phone: "", address: "", nic: "" }); // Reset form
      }
    } catch (error) {
      dispatch(updateFailure(error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        padding: { xs: 4, sm: 6 },
        maxWidth: 800,
        margin: "auto",
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        mt: 4,
      }}
    >
      <Grid container spacing={3} direction="column" alignItems="center">
        <Grid item>
          <Avatar
            alt={currentUser.name}
            src={currentUser.profilePicture}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
        </Grid>

        <Grid item>
          <Typography variant="h4" textAlign="center">
            {currentUser.name}
          </Typography>
          <Typography variant="body1" textAlign="center">
            {currentUser.email}
          </Typography>
        </Grid>

        {/* Show form if user is not completed and is 'user' */}
        {!currentUser.isCompleted && currentUser.role === "user" && (
          <Grid item sx={{ width: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Complete Your Profile
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    fullWidth
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address"
                    name="address"
                    fullWidth
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="NIC"
                    name="nic"
                    fullWidth
                    value={formData.nic}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </Grid>

              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
            </form>
          </Grid>
        )}

        {/* Show profile info if already completed or not a regular user */}
        {(currentUser.isCompleted || currentUser.role !== "user") && (
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight="bold">Phone:</Typography>
              <Typography>{currentUser.phone || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight="bold">Address:</Typography>
              <Typography>{currentUser.address || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight="bold">NIC:</Typography>
              <Typography>{currentUser.nic || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight="bold">Member Since:</Typography>
              <Typography>
                {new Date(currentUser.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Grid>

      <CustomSnackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={"Profile updated successfully"}
        severity="success"
      />
    </Paper>
  );
};

export default Profile;
