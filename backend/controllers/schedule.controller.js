import Schedule from "../models/schedule.model.js"; // Adjust the path as necessary

// Get all schedules
export const getAllSchedules = async (req, res, next) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (error) {
    next(error);
  }
};

// Create a new schedule
export const createSchedule = async (req, res, next) => {
  try {
    const { time, address, status, code ,special,truckNumber} = req.body;
    const newSchedule = new Schedule({ time, address, status ,special,truckNumber});
    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    next(error);
  }
};

// Update schedule with additional fields
export const updateSchedule = async (req, res, next) => {
    try {
      const {
        status,
        weight,
        type,
        garbageCollectorId,
        time,
        address,
        code,
        special,
        truckNumber,
      } = req.body;
  
      // Convert weight to a number or set it to null if not provided
      const updatedWeight = weight ? Number(weight) : null;
  
      const updatedSchedule = await Schedule.findByIdAndUpdate(
        req.params.id,
        {
          status,
          weight: updatedWeight,
          type,
          garbageCollectorId,
          time,
          address,
          code,
          special,
          truckNumber,
        },
        { new: true }
      );
  
      // Respond with the updated schedule
      res.json(updatedSchedule);
    } catch (error) {
      next(error);
    }
  };

// Get a schedule by ID
export const getScheduleById = async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.json(schedule);
  } catch (error) {
    next(error);
  }
};

// Delete a schedule
export const deleteSchedule = async (req, res, next) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    next(error);
  }
};