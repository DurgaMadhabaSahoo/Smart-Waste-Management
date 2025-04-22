import React, { useEffect, useState } from "react";
import {
  Paper,
  TextField,
  Grid,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config/config";

const EditManager = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    nic: "",
    district: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/get/${id}`, {
          withCredentials: true,
        });
        if (res.data.success !== false) {
          setFormData(res.data.user);
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        setError("Failed to fetch manager details");
      } finally {
        setLoading(false);
      }
    };

    fetchManager();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put(`${API_URL}/user/update/${id}`, formData, {
        withCredentials: true,
      });
      if (res.data.success !== false) {
        navigate(`/dashboard/admin/manager/${id}`);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Paper
      sx={{
        padding: { xs: 4, sm: 6 },
        maxWidth: 800,
        margin: "auto",
        mt: 4,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Edit Manager Profile
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {["name", "email", "phone", "address", "nic", "district"].map((field) => (
            <Grid item xs={12} sm={field === "email" ? 12 : 6} key={field}>
              <TextField
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                fullWidth
                value={formData[field] || ""}
                onChange={handleChange}
              />
            </Grid>
          ))}
        </Grid>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
          disabled={saving}
        >
          {saving ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </form>
    </Paper>
  );
};

export default EditManager;
