import React, { useState } from 'react';
import { Button, TextField, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box } from '@mui/material';
import SensorsIcon from '@mui/icons-material/Sensors';
import axios from 'axios'; // Import axios to make API calls
import { useSelector } from "react-redux";

const RequestTrackingDevice = () => {
    const { currentUser } = useSelector((state) => state.user);
    const user = currentUser;
    const [address, setAddress] = useState('');
    const [wasteType, setWasteType] = useState('Recyclable'); // Default waste type
    const [error, setError] = useState(''); // State for error messages
    const [successMessage, setSuccessMessage] = useState(''); // State for success messages

    // Remove navigation
    // const navigate = useNavigate(); // Initialize navigate
        // Generate a random waste level between 0 and 100
        const randomWasteLevel = Math.floor(Math.random() * 101);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Basic validation
        if (!address) {
            setError("Delivery address is required.");
            return;
        }

        // Reset error message on successful submission
        setError('');

        try {
            // Make a POST request to the API
            const response = await axios.post('http://localhost:5002/api/device/requestDevices', {
                address,
                wasteType,
                user
            });

            // Check for success and set success message
            if (response.data.success) {
                setSuccessMessage('Request submitted successfully!');

                // Remove navigation
                // navigate('/dashboard/order-process');
            }
        } catch (error) {
            // Handle any errors
            setError('Failed to submit the request. Please try again.');
            console.error("Error submitting the request:", error);
        }

        // Reset form fields after submission
        setAddress('');
        setWasteType('Recyclable');
    };

    return (
        <Box sx={{ padding: { xs: 2, md: 5 }, textAlign: 'center' }}>
            {/* Current Waste Level Title */}
            <Typography variant="h6" gutterBottom>
                Current Waste Level: {randomWasteLevel}%
            </Typography>

            {/* Icon */}
            <SensorsIcon sx={{ fontSize: { xs: 40, md: 50 }, marginBottom: 2 }} />
            
            {/* Title */}
            <Typography variant="h5" gutterBottom>
                Request Waste Tracking Device
            </Typography>

            <Box 
                component="form" 
                onSubmit={handleSubmit} // Add form submission handler
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    width: { xs: '100%', md: 'auto' } 
                }}
            >
                {/* Address Field */}
                <TextField
                    label="Delivery Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                    error={!!error} // Show error state
                    helperText={error} // Display error message
                />

                {/* Waste Type Selection (Radio Buttons) */}
                <FormControl component="fieldset" fullWidth sx={{ marginTop: 2 }}>
                    <FormLabel component="legend">Select Waste Type</FormLabel>
                    <RadioGroup
                        value={wasteType}
                        onChange={(e) => setWasteType(e.target.value)}
                    >
                        <FormControlLabel value="Recyclable" control={<Radio />} label="Recyclable" />
                        <FormControlLabel value="Non-Recyclable" control={<Radio />} label="Non-Recyclable" />
                        <FormControlLabel value="Organic" control={<Radio />} label="Organic" />
                    </RadioGroup>
                </FormControl>

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 3, padding: { xs: 1, md: 1.5 }, width: { xs: '100%', md: 'auto' } }}
                >
                    Request Device
                </Button>

                {/* Success Message */}
                {successMessage && (
                    <Typography variant="body1" color="success.main" sx={{ marginTop: 2 }}>
                        {successMessage}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default RequestTrackingDevice;
