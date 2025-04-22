import React, { useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config/config";

const ManagerDetails = () => {
  const { id } = useParams();
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/get/${id}`, {
          withCredentials: true,
        });
        if (res.data.success === false) {
          setError(res.data.message);
        } else {
          setManager(res.data.user);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch manager");
      } finally {
        setLoading(false);
      }
    };

    fetchManager();
  }, [id]);

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

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
            alt={manager.name}
            src={manager.profilePicture}
            sx={{ width: 100, height: 100 }}
          />
        </Grid>

        <Grid item>
          <Typography variant="h4" textAlign="center">
            {manager.name}
          </Typography>
          <Typography variant="body1" textAlign="center">
            {manager.email}
          </Typography>
        </Grid>

        <Grid item container spacing={2} mt={2}>
          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Phone:</Typography>
            <Typography>{manager.phone || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Address:</Typography>
            <Typography>{manager.address || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">NIC:</Typography>
            <Typography>{manager.nic || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">District:</Typography>
            <Typography>{manager.district || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Role:</Typography>
            <Typography>{manager.role}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Joined:</Typography>
            <Typography>
              {new Date(manager.createdAt).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>

        <Grid item mt={3}>
          <Button
            variant="contained"
            onClick={() => navigate(`/dashboard/admin/edit-manager/${manager._id}`)}
          >
            Edit Profile
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ManagerDetails;
