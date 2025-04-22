import RequestTrackingDevice from '../models/requestDevice.model.js';
import { errorHandler } from '../utils/error.js'; // Assuming you have an error handling utility

// Function to handle device request creation
export const requestDevice = async (req, res, next) => {
    const {  address, wasteType, user  } = req.body;
    //const userId = req.user.id;

    if ( !address || !wasteType ) {
        return next(errorHandler(400, "All fields are required"));
    }

    const newRequest = new RequestTrackingDevice({

        address,
        wasteType,
        user,
    });

    try {
        await newRequest.save();
        res.status(201).json({ success: true, message: "Request submitted successfully!", request: newRequest });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

// Function to fetch all requests
export const getAllRequests = async (req, res, next) => {
    try {
        const requests = await RequestTrackingDevice.find();// Populating user details
        res.status(200).json({ success: true, requests });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

// Function to get a specific request by ID
export const getRequestById = async (req, res, next) => {
    //get the id off the url
    const  id  = req.params.id;

    try {
        const request = await RequestTrackingDevice.findById(id);
        if (!request) {
            return next(errorHandler(404, "Request not found"));
        }
        res.status(200).json({ success: true, request });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

// Function to update the request
export const updateRequest = async (req, res, next) => {
    const { id } = req.params;
    const { address, wasteType, status } = req.body; // Expecting new address, wasteType, and status in the request body

    try {
        const updatedData = {};

        if (address) updatedData.address = address;
        if (wasteType) updatedData.wasteType = wasteType;
        if (status) updatedData.status = status;

        const request = await RequestTrackingDevice.findByIdAndUpdate(id, updatedData, { new: true });
        if (!request) {
            return next(errorHandler(404, "Request not found"));
        }

        res.status(200).json({ success: true, message: "Request updated successfully", request });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

// Function to delete a request
export const deleteRequest = async (req, res, next) => {
    const { id } = req.params;

    try {
        const request = await RequestTrackingDevice.findByIdAndDelete(id);
        if (!request) {
            return next(errorHandler(404, "Request not found"));
        }
        res.status(200).json({ success: true, message: "Request deleted successfully" });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};



