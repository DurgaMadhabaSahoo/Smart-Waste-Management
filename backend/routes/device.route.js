import express from 'express';
import {
  addDevice,
  getDevices,
  getAllDevices,
  getDeviceByUserId,
  getWasteLevelByUserId,
  updateWasteLevel,
} from '../controllers/device.controller.js';

const router = express.Router();

// POST - Add a new device for a user
router.post('/', addDevice);

// GET - Get devices for the logged-in user
router.get('/', getDevices);

// GET - Get all devices (Admin)
router.get('/all', getAllDevices);

// GET - Get device by user ID
router.get('/user/:userId', getDeviceByUserId);

// GET - Get waste level by user ID
router.get('/wasteLevel/:userId', getWasteLevelByUserId);

// PUT - Update a user's waste level
router.put('/update/:userId', updateWasteLevel);

export default router;
