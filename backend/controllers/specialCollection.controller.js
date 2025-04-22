import mongoose from 'mongoose';
import SpecialCollection from '../models/specialCollection.model.js';
import User from '../models/user.model.js';

// @desc    Add a new special collection
// @route   POST /api/specialCollection
export const addSpecialCollection = async (req, res) => {
  try {
    const {
      wasteType,
      chooseDate,
      wasteDescription,
      emergencyCollection,
      user,
    } = req.body;

    if (!wasteType || !chooseDate || !wasteDescription || !user) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    if (!mongoose.isValidObjectId(user)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const parsedDate = new Date(chooseDate);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: 'Invalid date format.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate < today) {
      return res.status(400).json({ message: 'Choose date must be today or in the future.' });
    }

    const collection = new SpecialCollection({
      wasteType: wasteType.trim(),
      chooseDate: parsedDate,
      wasteDescription: wasteDescription.trim(),
      emergencyCollection: emergencyCollection === true || emergencyCollection === 'true',
      user,
    });

    const saved = await collection.save();
    return res.status(201).json(saved);

  } catch (error) {
    console.error('Add Special Collection Error:', error);
    return res.status(500).json({ message: 'Server error. Failed to add collection.', error: error.message });
  }
};

// @desc    Get all special collections
// @route   GET /api/specialCollection
export const getSpecialCollections = async (req, res) => {
  try {
    const collections = await SpecialCollection.find().populate('user', 'name email');
    return res.status(200).json(collections);
  } catch (error) {
    console.error('Fetch All Error:', error);
    return res.status(500).json({ message: 'Failed to fetch collections.', error: error.message });
  }
};

// @desc    Get collection by ID
// @route   GET /api/specialCollection/:id
export const getSpecialCollectionsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid collection ID.' });
    }

    const collection = await SpecialCollection.findById(id).populate('user', 'name email');
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found.' });
    }

    return res.status(200).json(collection);
  } catch (error) {
    console.error('Fetch by ID Error:', error);
    return res.status(500).json({ message: 'Failed to fetch collection.', error: error.message });
  }
};

// @desc    Update collection
// @route   PUT /api/specialCollection/:id
export const updateSpecialCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid collection ID.' });
    }

    if (updates.chooseDate) {
      const parsedDate = new Date(updates.chooseDate);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ message: 'Invalid date format.' });
      }
      updates.chooseDate = parsedDate;
    }

    if (updates.emergencyCollection !== undefined) {
      updates.emergencyCollection = updates.emergencyCollection === true || updates.emergencyCollection === 'true';
    }

    const updated = await SpecialCollection.findByIdAndUpdate(id, updates, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Collection not found.' });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error('Update Error:', error);
    return res.status(500).json({ message: 'Failed to update collection.', error: error.message });
  }
};

// @desc    Update only the status
// @route   PUT /api/specialCollection/:id/status
export const updateSpecialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const updated = await SpecialCollection.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Collection not found.' });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error('Status Update Error:', error);
    return res.status(500).json({ message: 'Failed to update status.', error: error.message });
  }
};

// @desc    Delete collection
// @route   DELETE /api/specialCollection/:id
export const deleteSpecialCollection = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid collection ID.' });
    }

    const deleted = await SpecialCollection.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Collection not found.' });
    }

    return res.status(200).json({ message: 'Collection deleted successfully.' });
  } catch (error) {
    console.error('Delete Error:', error);
    return res.status(500).json({ message: 'Failed to delete collection.', error: error.message });
  }
};
