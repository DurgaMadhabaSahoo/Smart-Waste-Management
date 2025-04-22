import express from 'express';
import { verifyToken } from '../utils/verifyUser.js'; // Assuming this is where the JWT middleware is
import {
  addUsers,
  completeProfile,
  deleteUser,
  getUsersByRole,
} from '../controllers/user.controller.js';

const router = express.Router();

// 🔐 Protected Routes (Require JWT Token)

// Add a new user
router.post('/', verifyToken, addUsers); // POST /api/users

// Get users by role
router.get('/', verifyToken, getUsersByRole); // GET /api/users?role=manager

// Complete user profile
router.put('/:userId/complete-profile', verifyToken, completeProfile); // PUT /api/users/:userId/complete-profile

// Delete user by ID
router.delete('/:userId', verifyToken, deleteUser); // DELETE /api/users/:userId

export default router;
