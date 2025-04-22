import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import OrderConfirmationDialog from '../../../components/user/OrderConfirmationDialog'; // Import the dialog component
import { jsPDF } from 'jspdf'; // Import jsPDF

const CardDetailsPage = () => {
    const { currentUser } = useSelector((state) => state.user); // Access current user from Redux
    const user = currentUser;

    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [amount] = useState(100); // Fixed payment amount
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error
        setLoading(true); // Start loading

        // Validate inputs
        if (!/^\d{16}$/.test(cardNumber)) {
            setError("Invalid card number. It should be 16 digits.");
            setLoading(false);
            return;
        }
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            setError("Invalid expiry date. Format should be MM/YY.");
            setLoading(false);
            return;
        }
        if (!/^\d{3}$/.test(cvv)) {
            setError("Invalid CVV. It should be 3 digits.");
            setLoading(false);
            return;
        }

        // Construct the payment details
        const paymentDetails = {
            cardNumber,
            expiryDate,
            cvv,
            amount,
            user
            
           //userId: currentUser?._id // Include the user ID if available

           
        };

        try {
            // Send a POST request to your payment endpoint
            const response = await axios.post('http://localhost:5002/api/payment/payments', paymentDetails, {
                
                withCredentials: true, // Include credentials for CORS
                
            });

            // Handle success response
            console.log("Payment Success:", response.data);
            generateReceipt(); // Call the function to generate the receipt
            setDialogOpen(true); // Open the confirmation dialog
        } catch (err) {
            console.error("Payment Error:", err);
            setError(err.response?.data?.message || "An error occurred during payment.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const generateReceipt = () => {
        const doc = new jsPDF();
        const currentDate = new Date();

        // Add content to the PDF
        doc.text("Receipt", 20, 20);
        doc.text(`Name: ${currentUser?.name}`, 20, 30);
        doc.text(`Email: ${currentUser?.email}`, 20, 40);
        doc.text(`Total Amount: $${amount}`, 20, 50);
        doc.text(`Date: ${currentDate.toLocaleDateString()}`, 20, 60);
        doc.text(`Time: ${currentDate.toLocaleTimeString()}`, 20, 70);
        
        // Save the PDF
        doc.save(`Receipt_${currentUser?.name}_${currentDate.toISOString()}.pdf`);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false); // Close the dialog
        // You can redirect the user or perform any other action here if needed
    };

    return (
        <Box sx={{ padding: { xs: 2, md: 5 }, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
                Enter Card Details
            </Typography>
            <Typography variant="h6" gutterBottom>
                Total: ${amount} {/* Display total amount */}
            </Typography>
            {error && <Typography color="error">{error}</Typography>} {/* Display error message */}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TextField
                    label="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Expiry Date (MM/YY)"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    fullWidth
                    margin="normal"
                    type="password"
                />
                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 3 }} disabled={loading}>
                    {loading ? "Processing..." : "Submit"}
                </Button>
            </Box>
            <OrderConfirmationDialog open={dialogOpen} onClose={handleCloseDialog} /> {/* Render dialog */}
        </Box>
    );
};

export default CardDetailsPage;
