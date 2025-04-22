import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from "../../../config/config";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Select,
    MenuItem,
    IconButton,
    TextField,
    Snackbar,
    Alert,
    TablePagination,
    Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import autoTable

const AdminRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editedRequest, setEditedRequest] = useState(null); // State to track changes for each row
    const [successMessage, setSuccessMessage] = useState(false); // State to show success message

    // Pagination state
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`${API_URL}/device/getDevices`);
                setRequests(response.data.requests);
            } catch (err) {
                setError('Failed to fetch requests.');
                console.error("Error fetching requests:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    // Handle changes in the waste type, address, or status
    const handleEditRequest = (id, field, value) => {
        setEditedRequest((prevEditedRequest) => ({
            ...prevEditedRequest,
            [id]: {
                ...prevEditedRequest?.[id],
                [field]: value,
            },
        }));
    };

    // Save the updated request and show a success message
    const handleSaveRequest = async (id) => {
        if (editedRequest && editedRequest[id]) {
            const updatedFields = editedRequest[id];
            try {
                await axios.put(`${API_URL}/device/updateRequest/${id}`, updatedFields);
                setRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request._id === id ? { ...request, ...updatedFields } : request
                    )
                );
                setSuccessMessage(true); // Show success message
                setEditedRequest((prevEditedRequest) => ({
                    ...prevEditedRequest,
                    [id]: null,
                }));
            } catch (err) {
                console.error("Error updating request:", err);
            }
        }
    };

    // Close success message after a few seconds
    const handleCloseSnackbar = () => {
        setSuccessMessage(false);
    };

    // Delete request
    const handleDeleteRequest = async (id) => {
        if (window.confirm("Are you sure you want to delete this request?")) {
            try {
                await axios.delete(`${API_URL}/device/deleteRequest/${id}`);
                setRequests((prevRequests) => prevRequests.filter((request) => request._id !== id));
            } catch (err) {
                console.error("Error deleting request:", err);
            }
        }
    };

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page changes
    };

    // Generate PDF report
    const generateReport = () => {
        const doc = new jsPDF();
        doc.text('Waste Tracking Device Requests Report', 10, 10);

        // Create table data
        const tableData = requests.map((request) => [
            request.user.email,
            request.wasteType,
            request.address,
            request.status,
        ]);

        // Add autoTable
        doc.autoTable({
            head: [['User Email', 'Waste Type', 'Address', 'Status']],
            body: tableData,
            startY: 20, // Position of the table start
        });

        doc.save('Waste_Tracking_Requests_Report.pdf');
    };

    return (
        <>
            <Typography variant="h4" sx={{ textAlign: 'center', margin: 2, fontWeight: 'bold' }}>
                All Waste Tracking Device Requests
            </Typography>

            <Button 
                variant="contained" 
                color="primary" 
                onClick={generateReport}
                sx={{ margin: 2 }}
            >
                Generate Report
            </Button>

            <TableContainer component={Paper} sx={{ margin: 2 }}>
                {loading ? (
                    <Typography variant="h6" sx={{ textAlign: 'center' }}>
                        Loading...
                    </Typography>
                ) : error ? (
                    <Typography variant="h6" sx={{ textAlign: 'center', color: 'red' }}>
                        {error}
                    </Typography>
                ) : (
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>User Email</TableCell>
                                    <TableCell>Waste Type</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((request) => (
                                        <TableRow key={request._id}>
                                            {/* User Email - No editing */}
                                            <TableCell>{request.user.email}</TableCell>

                                            {/* Waste Type - Editable */}
                                            <TableCell>
                                                <Select
                                                    value={editedRequest?.[request._id]?.wasteType || request.wasteType}
                                                    onChange={(e) =>
                                                        handleEditRequest(request._id, 'wasteType', e.target.value)
                                                    }
                                                    sx={{ minWidth: 160 }}
                                                >
                                                    <MenuItem value="Recyclable">Recyclable</MenuItem>
                                                    <MenuItem value="Non-Recyclable">Non-Recyclable</MenuItem>
                                                    <MenuItem value="Organic">Organic</MenuItem>
                                                </Select>
                                            </TableCell>

                                            {/* Address - Editable */}
                                            <TableCell>
                                                <TextField
                                                    value={editedRequest?.[request._id]?.address || request.address}
                                                    onChange={(e) =>
                                                        handleEditRequest(request._id, 'address', e.target.value)
                                                    }
                                                    fullWidth
                                                />
                                            </TableCell>

                                            {/* Status - Editable */}
                                            <TableCell>
                                                <Select
                                                    value={editedRequest?.[request._id]?.status || request.status}
                                                    onChange={(e) => handleEditRequest(request._id, 'status', e.target.value)}
                                                    sx={{ minWidth: 120 }}
                                                >
                                                    <MenuItem value="Pending">Pending</MenuItem>
                                                    <MenuItem value="Approved">Approved</MenuItem>
                                                    <MenuItem value="Rejected">Rejected</MenuItem>
                                                </Select>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell>
                                                <IconButton onClick={() => handleSaveRequest(request._id)} color="primary">
                                                    <SaveIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteRequest(request._id)} color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <TablePagination
                            component="div"
                            count={requests.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </TableContainer>

            {/* Snackbar for Success Message */}
            <Snackbar
                open={successMessage}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Updated Successfully!
                </Alert>
            </Snackbar>
        </>
    );
};

export default AdminRequestsPage;
