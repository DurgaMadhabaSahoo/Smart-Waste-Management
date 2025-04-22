// components/Header.js
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Grid2,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import { logoutSuccess } from "../redux/user/userSlice";

import logo from "../assets/images/ecobin.png";
import axios from "axios";
import { API_URL } from "../config/config";

const Header = ({ handleSidebarToggle }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  console.log(currentUser);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/auth/signout`,
        {},
        {
          withCredentials: true, // Include credentials if needed for cookie handling
        }
      );
      const data = res.data;
      if (data.success) {
        console.log(data.message);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(logoutSuccess());
        handleMenuClose();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure the header is above the sidebar
        boxShadow: 4,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleSidebarToggle}
        >
          <MenuIcon
            sx={{
              display: { xs: "block", md: "none" }, // Drawer only on small screens
            }}
          />
        </IconButton>
        <Box
          component="img"
          sx={{
            // height: 200,
            height: 50,
            p:0.3,
            maxHeight: { xs: 200, md: 300 },
            maxWidth: { xs: 300, md: 400 },
          }}
          alt="Image description"
          src={logo}
        />
        <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar
              alt={currentUser?.username}
              src={currentUser?.profilePicture}
            />
          </IconButton>
          <Grid2>
            <Typography variant="h6">{currentUser?.username}</Typography>
            <Typography variant="subtitle2">{currentUser?.role}</Typography>
          </Grid2>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
