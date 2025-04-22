import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { API_URL } from "../../../config/config";
import LinkDevice from "../../../components/manager/LinkDevice";

const CurrentWaste = () => {
  const [wasteDevices, setWasteDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/wasteDevice/get-all-devices`, {
          withCredentials: true,
        });
        setWasteDevices(res.data || []);
      } catch (error) {
        console.error("Failed to fetch waste devices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, [open]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getColor = (level) => {
    if (level > 80) return "red";
    if (level > 50) return "orange";
    return "green";
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Current Waste Level
      </Typography>

      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Link Device
      </Button>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <CircularProgress />
        </div>
      ) : wasteDevices.length === 0 ? (
        <Typography align="center" color="textSecondary" sx={{ mt: 3 }}>
          No devices found. Please link one to start monitoring.
        </Typography>
      ) : (
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Device ID</TableCell>
                <TableCell>Waste Type</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Organic (%)</TableCell>
                <TableCell>Recycle (%)</TableCell>
                <TableCell>Non-Recycle (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wasteDevices.map((device) => (
                <TableRow key={device._id}>
                  <TableCell>{device._id}</TableCell>
                  <TableCell>{device.wasteType}</TableCell>
                  <TableCell>{device.userId || "N/A"}</TableCell>
                  <TableCell sx={{ color: getColor(device.wasteLevel?.organic || 0) }}>
                    {device.wasteLevel?.organic ?? 0}%
                  </TableCell>
                  <TableCell sx={{ color: getColor(device.wasteLevel?.recycle || 0) }}>
                    {device.wasteLevel?.recycle ?? 0}%
                  </TableCell>
                  <TableCell sx={{ color: getColor(device.wasteLevel?.nonRecycle || 0) }}>
                    {device.wasteLevel?.nonRecycle ?? 0}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <LinkDevice open={open} handleClose={handleClose} />
    </div>
  );
};

export default CurrentWaste;
