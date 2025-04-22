import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { Box, useMediaQuery, Drawer } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardRootLayout = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const theme = useTheme();
  const isMediumUp = useMediaQuery(theme.breakpoints.up("md")); // Check if screen size is md or larger

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!currentUser) {
    return <Navigate to="/auth/sign-in" />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* Persistent Sidebar for larger screens */}
      {isMediumUp && (
        <Box
          component="nav"
          sx={{
            width: 250,
            flexShrink: 0,
            bgcolor: "background.paper",
            height: "100vh", // Make it full height
            position: "fixed", // Fix the sidebar on large screens
            top: 0,
            left: 0,
            boxShadow: 4,
          }}
        >
          <Sidebar open={true} onClose={() => {}} />{" "}
          {/* Sidebar without drawer behavior */}
        </Box>
      )}

      {/* Drawer for mobile screens */}
      {!isMediumUp && (
        <Drawer
          anchor="left"
          open={sidebarOpen}
          onClose={handleSidebarToggle}
          sx={{
            "& .MuiDrawer-paper": { width: 240 },
          }}
        >
          <Sidebar open={true} onClose={handleSidebarToggle} />
        </Drawer>
      )}

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          ml: isMediumUp ? "250px" : 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {" "}
        {/* Add margin-left when sidebar is persistent */}
        <Header handleSidebarToggle={handleSidebarToggle} />
        <Box
          component="main"
          sx={{
            backgroundColor: "secondary.light",
            height: "100vh",
            overflow: "auto", // Enable scrolling for the content area
            paddingTop: "80px",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardRootLayout;
