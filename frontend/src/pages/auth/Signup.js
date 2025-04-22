import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Grid2,
  Box,
  Typography,
  Container,
  Snackbar,
  Alert,
  OutlinedInput,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ResponsiveAppBar from "./ResponsiveAppBar";
import { API_URL } from "../../config/config";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage(""); // Clear error on change
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (e) => e.preventDefault();
  const handleMouseUpPassword = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, role } = formData;

    if (!username || !email || !password || !role) {
      return setErrorMessage("Please fill out all fields.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!emailRegex.test(email)) {
      return setErrorMessage("Please enter a valid email address.");
    }

    if (!passwordRegex.test(password)) {
      return setErrorMessage(
        "Password must be at least 8 characters, with 1 uppercase, 1 number, and 1 special character."
      );
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      setLoading(false);
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/auth/sign-in");
      }, 1000);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message || "Something went wrong");
    }
  };

  return (
    <Box>
      <ResponsiveAppBar />
      <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography component="h1" variant="h5">Sign Up</Typography>

          <Grid2 container justifyContent="center" sx={{ mt: 1 }}>
            {errorMessage && (
              <Typography alignContent="center" color="error">
                {errorMessage}
              </Typography>
            )}
          </Grid2>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              autoComplete="given-name"
              name="username"
              required
              fullWidth
              id="username"
              label="Username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />

            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel htmlFor="outlined-adornment-password">Password *</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            {/* ✅ Role Selection */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Select Role *</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label="Select Role"
                onChange={handleChange}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="collector">Collector</MenuItem>
              </Select>
            </FormControl>

            <Button
              disabled={loading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>

            <Grid2 container justifyContent="center">
              <Grid2 item>
                <Link to="/auth/sign-in">
                  <Typography color="secondary.dark">
                    Already have an account? Sign in
                  </Typography>
                </Link>
              </Grid2>
            </Grid2>
          </Box>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={errorMessage ? "error" : "success"}
              sx={{ width: "100%" }}
            >
              {errorMessage ? errorMessage : "Signup successful! Redirecting..."}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </Box>
  );
};

export default Signup;
