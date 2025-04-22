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
  CircularProgress,
  Box,
  TablePagination,
  IconButton,
} from "@mui/material";
import AddCollector from "../../../components/admin/AddCollectors";
import { API_URL } from "../../../config/config";
import axios from "axios";
import { Delete } from "@mui/icons-material";
import CustomSnackbar from "../../../components/CustomSnackbar";
import DeleteCollectorConfirmation from "../../../components/admin/DeleteCollectorConfirmation";

const Collectors = () => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [collectors, setCollectors] = useState([]); 
  const [selectedCollectors, setSelectedCollectors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(10); 
  const [openSnackbarDelete, setOpenSnackbarDelete] = useState(false);

  useEffect(() => {
    const fetchCollectors = async () => {
      setLoading(true); // Start loading
      try {
        const res = await axios.get(`${API_URL}/user/getusers?role=collector`, {
          withCredentials: true,
        });
        const data = res.data;
        setCollectors(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); 
      }
    };

    fetchCollectors();
  }, [open, openDelete]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbarDelete(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDelete = (collector) => {
    setSelectedCollectors(collector);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedCollectors(null);
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

  
  const paginatedCollectors = collectors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: 30, textAlign: "center" }}>Waste Collectors</h1>

    
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Collector
      </Button>

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
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>NIC</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCollectors.length > 0 ? (
                  paginatedCollectors.map((collector, index) => (
                    <TableRow key={index}>
                      <TableCell>{collector.username}</TableCell>
                      <TableCell>{collector.email}</TableCell>
                      <TableCell>{collector.nic}</TableCell>
                      <TableCell>{collector.phone}</TableCell>
                      <TableCell>{collector.address}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDelete(collector)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No Collectors Added
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Pagination */}
            <TablePagination
              component="div"
              count={collectors.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        )}
      </TableContainer>

      {/* Modal for adding collectors */}
      <AddCollector open={open} handleClose={handleClose} />

      {selectedCollectors && (
        <DeleteCollectorConfirmation
          open={openDelete}
          handleClose={handleCloseDelete}
          collector={selectedCollectors}
          success={successfulDelete}
        />
      )}
      <CustomSnackbar
        open={openSnackbarDelete}
        onClose={handleCloseSnackbar}
        message={"Collector deleted successfully"}
        severity={"success"}
      />
    </div>
  );
};

export default Collectors;
