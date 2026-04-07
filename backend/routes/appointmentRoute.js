import express from "express";
import { protect, requireAdmin } from '../middleware/authmiddleware.js';
import {
  scheduleViewing,
  getAllAppointments,
  updateAppointmentStatus,
  getAppointmentsByUser,
  cancelAppointment,
  rescheduleAppointment,
  updateAppointmentMeetingLink,
  getAppointmentStats,
  submitAppointmentFeedback,
  getUpcomingAppointments,
  adminListAppointments,
  adminGetAppointmentById,
  adminCreateAppointment,
  adminUpdateAppointment,
  adminDeleteAppointment,
} from "../controller/appointmentController.js";


const router = express.Router();

// User routes
router.post("/schedule", protect, scheduleViewing);  // Add protect middleware
router.get("/user", getAppointmentsByUser);
router.put("/cancel/:id", cancelAppointment);
router.put("/reschedule/:id", protect, rescheduleAppointment);
router.put("/feedback/:id", submitAppointmentFeedback);
router.get("/upcoming", getUpcomingAppointments);

// Admin routes
router.get("/all",protect, getAllAppointments);
router.get("/stats", getAppointmentStats);
router.put("/status", updateAppointmentStatus);
router.put("/update-meeting", updateAppointmentMeetingLink);

// Admin-only CRUD routes
router.get('/manage', protect, requireAdmin, adminListAppointments);
router.get('/manage/:id', protect, requireAdmin, adminGetAppointmentById);
router.post('/manage', protect, requireAdmin, adminCreateAppointment);
router.put('/manage/:id', protect, requireAdmin, adminUpdateAppointment);
router.delete('/manage/:id', protect, requireAdmin, adminDeleteAppointment);

export default router;