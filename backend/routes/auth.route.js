import express from 'express';
import { signup, signin, signout } from '../controllers/auth.controller.js';

const router = express.Router();

// Auth Routes
router.post('/signup', signup);     // User registration
router.post('/signin', signin);     // User login
router.post('/signout', signout);   // User logout

export default router;
