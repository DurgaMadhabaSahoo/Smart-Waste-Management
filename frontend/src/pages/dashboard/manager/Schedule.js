// src/components/Schedule.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Chip,
  Tooltip,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TablePagination,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/system";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import StarIcon from "@mui/icons-material/Star";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

// Styled TableCell for header
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  fontWeight: "bold",
}));

// Styled TableRow for striped effect
const StyledTableRow = styled(TableRow)(({ theme, index }) => ({
  backgroundColor: index % 2 === 0 ? theme.palette.action.hover : "inherit",
}));

// Custom Alert for Snackbar
const AlertComponent = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const navigate = useNavigate();

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/schedules");
      setSchedules(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch schedules.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleDeleteClick = (schedule) => {
    setScheduleToDelete(schedule);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5002/api/schedules/${scheduleToDelete._id}`
      );
      setSchedules((prev) =>
        prev.filter((s) => s._id !== scheduleToDelete._id)
      );
      setSnackbar({
        open: true,
        message: "Schedule deleted successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to delete schedule.",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setScheduleToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setScheduleToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <AlertComponent
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </AlertComponent>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Delete Schedule</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this schedule? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Schedule Button */}
      <Button
        component={Link}
        to="/dashboard/addShedule"
        variant="contained"
        color="success"
        startIcon={<StarIcon />}
        sx={{ margin: "1rem" }}
      >
        Add Schedule
      </Button>

      <Container maxWidth="100%" sx={{ mt: 1, mb: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Address</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Code</StyledTableCell>
                    <StyledTableCell>Truck Number</StyledTableCell>
                    <StyledTableCell>Collector</StyledTableCell>
                    <StyledTableCell>Weight (kg)</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell>Special</StyledTableCell>
                    <StyledTableCell>Date & Time</StyledTableCell>
                    <StyledTableCell>Updated At</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((schedule, index) => {
                      const currentDate = new Date();
                      const scheduleDate = new Date(schedule.time);
                      const isOverdue = scheduleDate < currentDate && schedule.status === "notdone";

                      return (
                        <StyledTableRow key={schedule._id} index={index}>
                          <TableCell>{schedule.address}</TableCell>
                          <TableCell>
                            {schedule.status === "done" ? (
                              <Chip
                                label="Done"
                                color="success"
                                icon={<CheckCircleIcon />}
                                variant="outlined"
                              />
                            ) : (
                              <Chip
                                label="Not Done"
                                color="warning"
                                icon={<HourglassEmptyIcon />}
                                variant="outlined"
                              />
                            )}
                            {isOverdue && (
                              <Tooltip title="Overdue!">
                                <DeleteSweepIcon color="error" sx={{ ml: 1 }} />
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>{schedule.code}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <LocalShippingIcon sx={{ mr: 1 }} />
                              {schedule.truckNumber}
                            </Box>
                          </TableCell>
                          <TableCell>{schedule.garbageCollectorId || "N/A"}</TableCell>
                          <TableCell>{schedule.weight || 0}</TableCell>
                          <TableCell>{schedule.type || "N/A"}</TableCell>
                          <TableCell>
                            {schedule.special ? (
                              <Chip label="Yes" color="primary" icon={<StarIcon />} />
                            ) : (
                              <Chip label="No" />
                            )}
                          </TableCell>
                          <TableCell>{formatDate(schedule.time)}</TableCell>
                          <TableCell>{formatDate(schedule.updatedAt)}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              component={Link}
                              to={`/dashboard/edit-schedule/${schedule._id}`}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteClick(schedule)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[10, 15, 20]}
              component="div"
              count={schedules.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Container>
    </Box>
  );
};

export default Schedule;
