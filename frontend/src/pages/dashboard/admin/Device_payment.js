import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../config/config'; // Ensure this is the correct path to your config
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    TablePagination,
    Snackbar,
    Alert,
    Button,
} from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import autoTable to handle table formatting in PDF

const PaymentDetailsPage = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(false); // State to show success message

    // Pagination state
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get(`${API_URL}/payment/payments`); // Adjust the endpoint as necessary
                setPayments(response.data.payments);
            } catch (err) {
                const errorMessage = err.response ? err.response.data : err.message;
                setError(`Failed to fetch payments: ${errorMessage}`);
                console.error("Error fetching payments:", errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page changes
    };

    // Close success message after a few seconds
    const handleCloseSnackbar = () => {
        setSuccessMessage(false);
    };

    // Generate PDF report
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Payment Details Report', 10, 10);
        
        const tableData = payments.map(payment => [
            payment.user ? payment.user.email : 'N/A',
            new Date(payment.paymentDate).toLocaleDateString(),
            new Date(payment.paymentDate).toLocaleTimeString(),
            payment.amount.toFixed(2),
        ]);

        // Use autoTable to add the table
        doc.autoTable({
            head: [['User Email', 'Payment Date', 'Payment Time', 'Amount ($)']],
            body: tableData,
            startY: 20,
        });

        // Calculate total amount
        const totalAmount = payments.reduce((acc, payment) => acc + payment.amount, 0);
        
        // Add total amount to the PDF
        doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 10, doc.autoTable.previous.finalY + 10);

        // Save the generated PDF
        doc.save('payment-details-report.pdf');
    };

    return (
        <>
            <Typography variant="h4" sx={{ textAlign: 'center', margin: 2, fontWeight: 'bold' }}>
                Payment Details
            </Typography>

            <Button 
                variant="contained" 
                color="primary" 
                onClick={generatePDF}
                sx={{ margin: 2 }}
            >
                Generate PDF Report
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
                                    <TableCell>Payment Date</TableCell>
                                    <TableCell>Payment Time</TableCell>
                                    <TableCell>Amount ($)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payments
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((payment) => (
                                        <TableRow key={payment._id}>
                                            <TableCell>
                                                {payment.user && payment.user.email ? payment.user.email : 'N/A'}
                                            </TableCell>
                                            <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                                            <TableCell>{new Date(payment.paymentDate).toLocaleTimeString()}</TableCell>
                                            <TableCell>{payment.amount.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <TablePagination
                            component="div"
                            count={payments.length}
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
                    Action completed successfully!
                </Alert>
            </Snackbar>
        </>
    );
};

export default PaymentDetailsPage;
