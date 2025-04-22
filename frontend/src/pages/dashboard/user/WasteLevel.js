import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress, IconButton, Grid } from "@mui/material";
import RecyclingIcon from "@mui/icons-material/Recycling";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../../../config/config"; // Adjust this if necessary

const WasteLevelCard = ({ title, level, icon, color }) => (
  <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, textAlign: "center" }}>
    <IconButton sx={{ fontSize: 50, color: color }}>{icon}</IconButton>
    <Typography variant="h6" sx={{ marginY: 1 }}>
      {title}
    </Typography>
    <CircularProgress variant="determinate" value={level} size={100} thickness={5} sx={{ color: color }} />
    <Typography variant="h6" sx={{ marginY: 1 }}>
      {level}%
    </Typography>
  </Paper>
);

const WasteLevel = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [wasteData, setWasteData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch waste levels by userId
  useEffect(() => {
    if (!currentUser || !currentUser._id) {
      setError("User ID is not available.");
      setLoading(false);
      return;
    }

    const fetchWasteLevels = async () => {
      try {
        // Ensure the correct API endpoint is used here
        const res = await axios.get(
          `${API_URL}/devices/wasteLevel/${currentUser._id}`,
          { withCredentials: true }
        );
        
        console.log("API Response: ", res.data);  // Log the response for debugging

        if (res.status === 404) {
          setError("Device not found for this user");
        } else {
          setWasteData(res.data); // Assuming res.data contains the waste level details
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError("Failed to load waste levels.");
      } finally {
        setLoading(false);
      }
    };

    fetchWasteLevels();
  }, [currentUser]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" textAlign="center" marginTop={5}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Current Waste Levels
      </Typography>

      <Grid container spacing={3} sx={{ marginTop: 2 }} alignItems="center" justifyContent="center">
        {/* Organic Waste Level */}
        <Grid item xs={12} sm={6}>
          <WasteLevelCard
            title="Organic Waste"
            level={wasteData.wasteLevel?.organic || 0}
            icon={<WaterDropIcon />}
            color="#4caf50" // Green for organic
          />
        </Grid>

        {/* Recyclable Waste Level */}
        <Grid item xs={12} sm={6}>
          <WasteLevelCard
            title="Recyclable Waste"
            level={wasteData.wasteLevel?.recycle || 0}
            icon={<RecyclingIcon />}
            color="#2196f3" // Blue for recyclable
          />
        </Grid>

        {/* Non-Recyclable Waste Level */}
        <Grid item xs={12} sm={6}>
          <WasteLevelCard
            title="Non-Recyclable Waste"
            level={wasteData.wasteLevel?.nonRecycle || 0}
            icon={<DeleteOutlineIcon />}
            color="#f44336" // Red for non-recyclable
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default WasteLevel;
