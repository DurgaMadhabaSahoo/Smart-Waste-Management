import express from 'express';
import {
  addTrucks,
  deleteTruck,
  getAllTrucks,
  getTruckById,
  updateTruck,
  getAllTruckNumbers
} from '../controllers/truck.controller.js';

import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// POST - Add a new truck
router.post('/', verifyToken, addTrucks);

// GET - Get all trucks
router.get('/', verifyToken, getAllTrucks);

// GET - Get truck numbers only (optional endpoint, placed logically)
router.get('/numbers', verifyToken, getAllTruckNumbers);

// GET - Get truck by ID
router.get('/:id', verifyToken, getTruckById);

// PUT - Update truck
router.put('/:id', verifyToken, updateTruck);

// DELETE - Delete truck
router.delete('/:id', verifyToken, deleteTruck);

export default router;
