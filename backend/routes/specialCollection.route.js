import express from 'express';
import {
  addSpecialCollection,
  getSpecialCollections,
  getSpecialCollectionsById,
  updateSpecialCollection,
  updateSpecialStatus,
  deleteSpecialCollection,
} from '../controllers/specialCollection.controller.js';

const router = express.Router();

// Create new special collection
router.post('/', addSpecialCollection);

// Get all special collections
router.get('/', getSpecialCollections);

// Get special collection by ID
router.get('/:id', getSpecialCollectionsById);

// Update special collection
router.put('/:id', updateSpecialCollection);

// Update special collection status
router.put('/:id/status', updateSpecialStatus);

// Delete special collection
router.delete('/:id', deleteSpecialCollection);

export default router;
