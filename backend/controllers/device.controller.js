import Device from '../models/device.model.js';
import { errorHandler } from '../utils/error.js';
import { isValidObjectId } from 'mongoose';

// Generate a random waste level (0–100)
const getRandomWasteLevel = () => Math.floor(Math.random() * 101);

// @desc    Add a new device for a user
// @route   POST /api/devices
export const addDevice = async (req, res, next) => {
  const { wasteType, userId } = req.body;

  if (!wasteType || !userId) {
    return next(errorHandler(400, "Waste type and User ID are required"));
  }

  if (!isValidObjectId(userId)) {
    return next(errorHandler(400, "Invalid User ID"));
  }

  try {
    const existingDevice = await Device.findOne({ userId });
    if (existingDevice) {
      return next(errorHandler(400, "User already has a linked device"));
    }

    const wasteLevel = {
      organic: getRandomWasteLevel(),
      recycle: getRandomWasteLevel(),
      nonRecycle: getRandomWasteLevel(),
    };

    const newDevice = new Device({ wasteType, wasteLevel, userId });
    await newDevice.save();

    res.status(201).json({
      message: "Device added successfully",
      device: newDevice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get devices for the logged-in user
// @route   GET /api/devices
export const getDevices = async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId || !isValidObjectId(userId)) {
    return next(errorHandler(400, "Invalid or missing user ID"));
  }

  try {
    const devices = await Device.find({ userId });

    if (devices.length === 0) {
      return res.status(404).json({ message: "No devices found for this user." });
    }

    res.json(devices);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all devices (Admin)
// @route   GET /api/devices/all
export const getAllDevices = async (req, res, next) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    next(error);
  }
};

// @desc    Get device by user ID
// @route   GET /api/devices/user/:userId
export const getDeviceByUserId = async (req, res, next) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid User ID format." });
  }

  try {
    const device = await Device.findOne({ userId });
    if (!device) {
      return res.status(404).json({
        message: "Device not found for this user. Please request device and complete profile.",
      });
    }

    res.json(device);
  } catch (error) {
    next(error);
  }
};

// ✅ FIXED: Response now matches frontend structure
// @desc    Get waste level by user ID
// @route   GET /api/devices/wasteLevel/:userId
export const getWasteLevelByUserId = async (req, res, next) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid User ID format." });
  }

  try {
    const device = await Device.findOne({ userId });
    if (!device) {
      return res.status(404).json({
        message: "Device not found for this user. Please request device and complete profile.",
      });
    }

    // ✅ Return wasteLevel wrapped inside an object
    res.json({ wasteLevel: device.wasteLevel });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user's waste level
// @route   PUT /api/devices/update/:userId
export const updateWasteLevel = async (req, res, next) => {
  const { userId } = req.params;
  const { wasteType, level } = req.body;

  if (!wasteType || !['organic', 'recycle', 'nonRecycle'].includes(wasteType)) {
    return next(errorHandler(400, "Invalid waste type. Must be 'organic', 'recycle', or 'nonRecycle'"));
  }

  if (typeof level !== 'number' || level < 0 || level > 100) {
    return next(errorHandler(400, "Level must be a number between 0 and 100"));
  }

  if (!isValidObjectId(userId)) {
    return next(errorHandler(400, "Invalid User ID"));
  }

  try {
    const device = await Device.findOne({ userId });

    if (!device) {
      return res.status(404).json({ message: "Device not found." });
    }

    device.wasteLevel[wasteType] = level;
    await device.save();

    res.json({
      message: "Waste level updated successfully",
      wasteLevel: device.wasteLevel,
    });
  } catch (error) {
    next(error);
  }
};
