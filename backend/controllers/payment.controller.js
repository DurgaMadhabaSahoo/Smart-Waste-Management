import Payment from '../models/payment.model.js'; // Ensure this is the correct path to your Payment model
import { errorHandler } from '../utils/error.js'; // Assuming you have an error handling utility

// Function to create a new payment
export const createPayment = async (req, res, next) => {
    const { cardNumber, expiryDate, cvv, amount,user } = req.body;

    console.log("Received data:", req.body); // Log the received body

    if (!cardNumber || !expiryDate || !cvv || !amount) {
        return next(errorHandler(400, "All fields are required"));
    }

    // Create a new Payment instance
    const newPayment = new Payment({
        cardNumber,
        expiryDate,
        cvv,
        amount,
        user,
        
    });

    try {
        await newPayment.save(); // Save the payment to the database
        res.status(201).json({ success: true, message: "Payment created successfully!", payment: newPayment });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

// Function to fetch all payments
export const getAllPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find(); // Fetch all payments
        res.status(200).json({ success: true, payments });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

// Function to get a specific payment by ID
export const getPaymentById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const payment = await Payment.findById(id);
        if (!payment) {
            return next(errorHandler(404, "Payment not found"));
        }
        res.status(200).json({ success: true, payment });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

// Function to update a payment by ID
export const updatePayment = async (req, res, next) => {
    const { id } = req.params;
    const { amount, cardNumber, expiryDate, cvv } = req.body; // Expecting new amount and other fields in the request body

    try {
        const updatedData = {};

        if (amount) updatedData.amount = amount;
        if (cardNumber) updatedData.cardNumber = cardNumber;
        if (expiryDate) updatedData.expiryDate = expiryDate;
        if (cvv) updatedData.cvv = cvv;

        const payment = await Payment.findByIdAndUpdate(id, updatedData, { new: true });
        if (!payment) {
            return next(errorHandler(404, "Payment not found"));
        }

        res.status(200).json({ success: true, message: "Payment updated successfully", payment });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

// Function to delete a payment by ID
export const deletePayment = async (req, res, next) => {
    const { id } = req.params;

    try {
        const payment = await Payment.findByIdAndDelete(id);
        if (!payment) {
            return next(errorHandler(404, "Payment not found"));
        }
        res.status(200).json({ success: true, message: "Payment deleted successfully" });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};
