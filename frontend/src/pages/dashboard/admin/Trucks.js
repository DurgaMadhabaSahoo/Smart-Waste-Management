import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Box,
  TablePagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AddTrucks from "../../../components/admin/AddTrucks";
import { API_URL } from "../../../config/config";
import axios from "axios";
import UpdateTruck from "../../../components/admin/UpdateTrucks";
import DeleteTruckConfirmation from "../../../components/admin/DeleteTruckConfirmation";
import CustomSnackbar from "../../../components/CustomSnackbar";

const Trucks = () => {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [trucks, setTrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [openSnackbarUpdate, setOpenSnackbarUpdate] = useState(false);
  const [openSnackbarDelete, setOpenSnackbarDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // Pagination - current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Pagination - rows per page

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbarDelete(false);
    setOpenSnackbarUpdate(false);
  };

  useEffect(() => {
    const fetchTrucks = async () => {
      setLoading(true); // Start loading
      try {
        const res = await axios.get(`${API_URL}/truck/alltrucks`, {
          withCredentials: true,
        });
        const data = res.data;
        setTrucks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchTrucks();
  }, [open, openUpdate, openDelete]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // To handle update
  const handleOpenUpdate = (truck) => {
    setSelectedTruck(truck);
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setSelectedTruck(null);
  };

  const successfulUpdate = () => {
    setOpenSnackbarUpdate(true);
  };

  // To handle delete
  const handleOpenDelete = (truck) => {
    setSelectedTruck(truck);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedTruck(null);
  };

  const successfulDelete = () => {
    setOpenSnackbarDelete(true);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginate the trucks data
  const paginatedTrucks = trucks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: 30, textAlign: "center" }}>Manage Trucks</h1>

      {/* Add Truck Button */}
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Truck
      </Button>

      {/* Truck Table */}
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={5}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Truck Name</TableCell>
                  <TableCell>Number Plate</TableCell>
                  <TableCell>Capacity (kg)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTrucks.length > 0 ? (
                  paginatedTrucks.map((truck, index) => (
                    <TableRow key={index}>
                      <TableCell>{truck.brand}</TableCell>
                      <TableCell>{truck.numberPlate}</TableCell>
                      <TableCell>{truck.capacity}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenUpdate(truck)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDelete(truck)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No Trucks Added
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Pagination */}
            <TablePagination
              component="div"
              count={trucks.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        )}
      </TableContainer>

      {/* Modal for adding trucks */}
      <AddTrucks open={open} handleClose={handleClose} />

      {/* Update Truck Modal */}
      {selectedTruck && (
        <UpdateTruck
          open={openUpdate}
          handleClose={handleCloseUpdate}
          truck={selectedTruck}
          success={successfulUpdate}
        />
      )}
      <CustomSnackbar
        open={openSnackbarUpdate}
        onClose={handleCloseSnackbar}
        message={"Truck updated successfully"}
        severity={"success"}
      />

      {/* Delete Confirmation Dialog */}
      {selectedTruck && (
        <DeleteTruckConfirmation
          open={openDelete}
          handleClose={handleCloseDelete}
          truck={selectedTruck}
          success={successfulDelete}
        />
      )}
      <CustomSnackbar
        open={openSnackbarDelete}
        onClose={handleCloseSnackbar}
        message={"Truck deleted successfully"}
        severity={"success"}
      />
    </div>
  );
};

export default Trucks;
