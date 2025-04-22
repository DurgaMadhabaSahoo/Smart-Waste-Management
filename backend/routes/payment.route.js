import express from 'express';
import {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
} from '../controllers/payment.controller.js';

const router = express.Router();

// Create a new payment
router.post('/payments', createPayment); 

// Get all payments
router.get('/payments', getAllPayments); 

// Get a payment by ID
router.get('/payments/:id', getPaymentById); 

// Update a payment by ID
router.put('/payments/:id', updatePayment); 

// Delete a payment by ID
router.delete('/payments/:id', deletePayment); 

export default router;
