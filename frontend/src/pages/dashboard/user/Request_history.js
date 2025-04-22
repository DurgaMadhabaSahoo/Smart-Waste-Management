import React, { useEffect, useState} from 'react';
import axios from 'axios'; // Import axios to make API calls
import { API_URL } from "../../../config/config"; // Import API URL
import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Paper,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
} from '@mui/material';
import { useSelector } from "react-redux";
import DeleteConfirmationDialog from "../../../components/user/DeleteConfirmationDialog";
import { useNavigate } from 'react-router-dom';
import { DashBoardPaths } from '../../../routes/Paths'; 



const FilteredRequests = () => {
    const { currentUser } = useSelector((state) => state.user);
    const user = currentUser;
    const [approvedRequests, setApprovedRequests] = useState([]); // State for approved requests
    const [rejectedRequests, setRejectedRequests] = useState([]); // State for rejected requests
    const [pendingRequests, setPendingRequests] = useState([]); // State for pending requests
    const [filter, setFilter] = useState('approved'); // Filter state for approved/rejected/pending requests


    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [requestIdToDelete, setRequestIdToDelete] = useState(null);

    const navigate = useNavigate(); // Initialize navigate

    // Fetch requests for the current user


    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`${API_URL}/device/getDevices`);
                const userRequests = response.data.requests.filter(request => request.user._id === user._id);
                
                // Separate requests into approved, rejected, and pending
                const approved = userRequests.filter(request => request.status === 'Approved');
                const rejected = userRequests.filter(request => request.status === 'Rejected');
                const pending = userRequests.filter(request => request.status === 'Pending');

                setApprovedRequests(approved);
                setRejectedRequests(rejected);
                setPendingRequests(pending);
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        };

        fetchRequests();
    }, [user._id]);

    // Function to change the filter
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    // Determine which requests to show based on the filter
    const displayedRequests = 
        filter === 'approved' ? approvedRequests :
        filter === 'rejected' ? rejectedRequests :
        pendingRequests; // Added condition for pending requests

    // Function to handle payment (placeholder)
    const handlePayment = (requestId) => {
        // Implement payment processing logic here
        console.log(`Payment for request ID: ${requestId}`);
        navigate('/dashboard/order-process');
    };

    const handleDeleteRequest = (requestId) => {
        setRequestIdToDelete(requestId);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (requestIdToDelete) {
            try {
                await axios.delete(`${API_URL}/device/deleteRequest/${requestIdToDelete}`);
                const updatedRequests = displayedRequests.filter(request => request._id !== requestIdToDelete);
                if (filter === 'approved') {
                    setApprovedRequests(updatedRequests);
                } else if (filter === 'rejected') {
                    setRejectedRequests(updatedRequests);
                } else {
                    setPendingRequests(updatedRequests);
                }
            } catch (error) {
                console.error("Error deleting request:", error);
            }
        }
        setOpenDeleteDialog(false);
    };


    

    return (
        <Box sx={{ padding: { xs: 2, md: 5 }, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ margin: 2 }}>Filtered Waste Tracking Requests</Typography>

            {/* Filter Options */}
            <FormControl component="fieldset" sx={{ marginTop: 4 }}>
                <FormLabel component="legend">Filter Requests</FormLabel>
                <RadioGroup row value={filter} onChange={handleFilterChange}>
                    <FormControlLabel value="approved" control={<Radio />} label="Approved" />
                    <FormControlLabel value="rejected" control={<Radio />} label="Rejected" />
                    <FormControlLabel value="pending" control={<Radio />} label="Pending" /> {/* New option for Pending */}
                </RadioGroup>
            </FormControl>

            {/* Table for Approved, Rejected, and Pending Requests */}
            <Typography variant="h5" sx={{ marginTop: 4 }} gutterBottom>
                {filter.charAt(0).toUpperCase() + filter.slice(1)} Requests
            </Typography>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell>Waste Type</TableCell>
                            <TableCell>Status</TableCell>
                            {filter === 'approved' && <TableCell>Payment</TableCell>} {/* Conditionally render Payment column */}
                            <TableCell>Actions</TableCell> {/* New Actions Column */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedRequests.length > 0 ? (
                            displayedRequests.map((request) => (
                                <TableRow key={request._id}>
                                    <TableCell>{request.address}</TableCell>
                                    <TableCell>{request.wasteType}</TableCell>
                                    <TableCell>{request.status}</TableCell>
                                    {filter === 'approved' && ( // Render payment button only for approved requests
                                        <TableCell>
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={() => handlePayment(request._id)}
                                            >
                                                Pay
                                            </Button>
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <Button 
                                            variant="outlined" 
                                            color="error" 
                                            onClick={() => handleDeleteRequest(request._id)} // Call delete handler
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={filter === 'approved' ? 5 : 4} align="center">No requests found.</TableCell> {/* Adjusted colspan for new column */}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={confirmDelete}
            />



        </Box>
    );
};

export default FilteredRequests;
