// models/requestTrackingDevice.model.js

import mongoose from 'mongoose';

const RequestTrackingDeviceSchema = new mongoose.Schema({

    user: {
        type: Object, // Reference to the User model
        required: true,
        //ref: 'User' // Assuming you have a User model
    },

    address: {
        type: String,
        required: true, // Delivery address is required
    },
    wasteType: {
        type: String,
        enum: ['Recyclable', 'Non-Recyclable', 'Organic'], // Allowed waste types
        required: true, // Waste type is required
    },

    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'], // Possible statuses for the request
        default: 'Pending', // Default status is Pending
    },




    
});

// Create the model
const RequestTrackingDevice = mongoose.model('RequestTrackingDevice', RequestTrackingDeviceSchema);

export default RequestTrackingDevice;
