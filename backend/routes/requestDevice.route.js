import express from 'express';
import {
    requestDevice,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
    
} from '../controllers/requestDevice.controller.js';

const router = express.Router();

router.post('/requestDevices', requestDevice); // Create a new request
router.get('/getDevices', getAllRequests); // Get all requests
router.get('/requestDevices/:id', getRequestById); // Get a specific request by ID
router.put('/updateRequest/:id', updateRequest); // Update the request status
router.delete('/deleteRequest/:id', deleteRequest); // Delete a specific request









export default router;
