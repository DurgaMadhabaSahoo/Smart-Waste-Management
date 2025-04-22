import Truck from "../models/truck.model.js";
import { errorHandler } from "../utils/error.js";

// Add a new truck
export const addTrucks = async (req, res, next) => {
  // if (req.user.role !== "admin") {
  //   return next(errorHandler(403, "You are not allowed to add a truck"));
  // }

  const { brand, numberPlate, capacity } = req.body;

  if (!brand || !numberPlate || !capacity) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const newTruck = new Truck({ brand, numberPlate, capacity });
    const savedTruck = await newTruck.save();
    res.status(201).json(savedTruck);
  } catch (error) {
    next(error);
  }
};

// Get all trucks (full info)
export const getAllTrucks = async (req, res, next) => {
  // if (req.user.role !== "admin") {
  //   return next(errorHandler(403, "You are not allowed to view trucks"));
  // }

  try {
    const trucks = await Truck.find();
    res.status(200).json(trucks);
  } catch (error) {
    next(error);
  }
};

// ✅ Get truck numbers only (optimized for dropdowns)
export const getAllTruckNumbers = async (req, res, next) => {
  try {
    const trucks = await Truck.find({}, 'numberPlate'); // Only return numberPlate
    res.status(200).json(trucks);
  } catch (error) {
    next(error);
  }
};

// Get truck by ID
export const getTruckById = async (req, res, next) => {
  // if (req.user.role !== "admin") {
  //   return next(errorHandler(403, "You are not allowed to view trucks"));
  // }

  try {
    const truck = await Truck.findById(req.params.id);
    if (!truck) {
      return next(errorHandler(404, "Truck not found"));
    }
    res.status(200).json(truck);
  } catch (error) {
    next(error);
  }
};

// Update truck
export const updateTruck = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(errorHandler(403, "You are not allowed to update trucks"));
  }

  try {
    const updatedTruck = await Truck.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTruck) {
      return next(errorHandler(404, "Truck not found"));
    }
    res.status(200).json(updatedTruck);
  } catch (error) {
    next(error);
  }
};

// Delete truck
export const deleteTruck = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(errorHandler(403, "You are not allowed to delete trucks"));
  }

  try {
    const deletedTruck = await Truck.findByIdAndDelete(req.params.id);
    if (!deletedTruck) {
      return next(errorHandler(404, "Truck not found"));
    }
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};
