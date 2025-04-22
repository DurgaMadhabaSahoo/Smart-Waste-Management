import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Replace with your logo import
import logo from "../../assets/images/ecobin.png"; 

const ResponsiveAppBar = () => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main" , mb:20 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo Section wrapped inside IconButton */}
        <IconButton
          edge="start"
          onClick={handleNavigateHome}  // Logo acts as a Home button
          sx={{ p: 0 }} // Removes padding from IconButton
        >
          <Box
            component="img"
            src={logo}
            alt="App Logo"
            sx={{
              height: 50, // Adjusted height for the logo
              p: 0.3,
              maxHeight: { xs: 200, md: 300 },
              maxWidth: { xs: 300, md: 400 },
            }}
          />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            display: { xs: "block" , md: "block" }, // Hide on XS, show on MD
            textAlign: "center",
            fontSize: { md: "1.5rem" },
            fontWeight: "bold",
            ml:{ xs: -7}
          }}
        >
          Welcome!
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default ResponsiveAppBar;