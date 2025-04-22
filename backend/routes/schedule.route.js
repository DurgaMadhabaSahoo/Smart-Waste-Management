import express from "express";
import {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  getScheduleById,
  deleteSchedule,
} from "../controllers/schedule.controller.js";

const router = express.Router();

// Routes
router.get("/", getAllSchedules);              // GET    /api/schedules       -> Get all schedules
router.post("/", createSchedule);             // POST   /api/schedules       -> Create a new schedule
router.get("/:id", getScheduleById);          // GET    /api/schedules/:id   -> Get a single schedule by ID
router.put("/:id", updateSchedule);           // PUT    /api/schedules/:id   -> Update a schedule
router.delete("/:id", deleteSchedule);        // DELETE /api/schedules/:id   -> Delete a schedule

export default router;
