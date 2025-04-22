import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js"; // Make sure errorHandler is correctly implemented

// ✅ Add User (admin only)
export const addUsers = async (req, res, next) => {
  try {
    // Only admin should be able to add users
    if (req.user.role !== "admin") {
      return next(errorHandler(403, "You are not allowed to add a user"));
    }

    const { role } = req.query;  // Get role from query string
    const { username, email, nic, phone, address } = req.body;  // Extract user details

    // Check if all required fields are present
    if (!username || !email || !nic || !phone || !address) {
      return next(errorHandler(400, "All fields are required"));
    }

    // Validate role if present
    const allowedRoles = ['collector', 'manager'];
    if (!role || !allowedRoles.includes(role)) {
      return next(errorHandler(400, 'Invalid or missing role'));
    }

    // Check if the user already exists based on email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(errorHandler(400, 'User with this email or username already exists'));
    }

    // Hash password using bcryptjs
    const hashedPassword = bcryptjs.hashSync(nic, 10); // Use NIC as password for hashing

    // Create a new user
    const newUser = new User({
      username,
      email,
      nic,
      phone,
      address,
      password: hashedPassword,
      role,
    });

    await newUser.save();  // Save user to database
    res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} added successfully` });
  } catch (error) {
    next(error);  // Pass errors to the errorHandler
  }
};

// ✅ Get Users by Role (admin only)
export const getUsersByRole = async (req, res, next) => {
  try {
    // Only admin can get users by role
    if (req.user.role !== "admin") {
      return next(errorHandler(403, "You are not allowed to access this resource"));
    }

    const { role } = req.query;
    if (!role) {
      return next(errorHandler(400, "Role is required"));
    }

    // Find users by role
    const users = await User.find({ role });

    // If no users found for the role, return an error
    if (!users.length) {
      return next(errorHandler(404, `No users found for role: ${role}`));
    }

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// ✅ Complete User Profile (self only)
export const completeProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    
    // Check if the logged-in user is trying to update their own profile
    if (req.user.id !== userId) {
      return next(errorHandler(403, 'You are not allowed to update this user'));
    }

    const { phone, address, nic } = req.body;
    if (!phone || !address || !nic) {
      return next(errorHandler(400, "Phone, address, and NIC are required"));
    }

    // Update the user's profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { phone, address, nic, isCompleted: true },  // Mark profile as complete
      { new: true }  // Return the updated user document
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, ...userWithoutPassword } = updatedUser._doc;
    res.status(200).json({ message: "Profile updated successfully", user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete User (admin only)
export const deleteUser = async (req, res, next) => {
  try {
    // Only admin can delete users
    if (req.user.role !== "admin") {
      return next(errorHandler(403, "You are not allowed to delete a user"));
    }

    const userId = req.params.userId;
    
    // Find and delete the user by ID
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
