import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({


    user: {
        type: Object, // Reference to the User model
        required: true,
        //ref: 'User' // Assuming you have a User model
    },

    cardNumber: {
        type: String,
        required: true,
        minlength: 16,
        maxlength: 16
    },
    expiryDate: {
        type: String,
        required: true,
    },
    cvv: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 3
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    

}, {
    timestamps: true // Automatically create `createdAt` and `updatedAt` fields
});

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
