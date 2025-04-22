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
import { API_URL } from "../../../config/config";
import axios from "axios";
import AddManagers from "../../../components/admin/AddManagers";
import { Delete } from "@mui/icons-material";
import CustomSnackbar from "../../../components/CustomSnackbar";
import DeleteManagerConfirmation from "../../../components/admin/DeleteManagerConfirmation";

const Manager = () => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedManager, setSelectedManager] = useState(null);
  const [openSnackbarDelete, setOpenSnackbarDelete] = useState(false);

  useEffect(() => {
    const fetchManagers = async () => {
      setLoading(true); // Start loading
      try {
        const res = await axios.get(`${API_URL}/user/getusers?role=manager`, {
          withCredentials: true,
        });
        const data = res.data;
        setManagers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, [open,openDelete]);

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

  const handleOpenDelete = (manager) => {
    setSelectedManager(manager);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedManager(null);
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

  const paginatedCollectors = managers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: 30, textAlign: "center" }}>
        Managers
      </h1>

      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Managers
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
                  paginatedCollectors.map((manager, index) => (
                    <TableRow key={index}>
                      <TableCell>{manager.username}</TableCell>
                      <TableCell>{manager.email}</TableCell>
                      <TableCell>{manager.nic}</TableCell>
                      <TableCell>{manager.phone}</TableCell>
                      <TableCell>{manager.address}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDelete(manager)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No Managers Added
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Pagination */}
            <TablePagination
              component="div"
              count={managers.length}
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
      <AddManagers open={open} handleClose={handleClose} />

      {selectedManager && (
        <DeleteManagerConfirmation
          open={openDelete}
          handleClose={handleCloseDelete}
          manager={selectedManager}
          success={successfulDelete}
        />
      )}
      <CustomSnackbar
        open={openSnackbarDelete}
        onClose={handleCloseSnackbar}
        message={"Manager deleted successfully"}
        severity={"success"}
      />
    </div>
  );
};

export default Manager;
