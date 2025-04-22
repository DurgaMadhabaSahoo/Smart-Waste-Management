import mongoose from "mongoose";
import User from "./user.model.js"; // Assuming you have a User model

const deviceSchema = new mongoose.Schema({
    wasteType: {
        type: String,
        required: true,
        enum: ["recyclable", "non-recyclable", "organic"],
    },
    wasteLevel: {
        organic: { type: Number, required: true },
        recycle: { type: Number, required: true },
        nonRecycle: { type: Number, required: true },
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
        required: true,
    },
}, { timestamps: true });

// Optional: Add a static method for getting device by userId
deviceSchema.statics.findByUserId = function(userId) {
    return this.findOne({ userId: userId });
};

// Optionally, you can add an index for userId to speed up lookups
deviceSchema.index({ userId: 1 });

const Device = mongoose.model('Device', deviceSchema);

export default Device;
