import express from 'express';
import { 
  getAdminStats,
  getAllAppointments,
  updateAppointmentStatus,
  updateAppointmentMeetingLink
} from '../controller/adminController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

router.get('/stats', protect, getAdminStats);
router.get('/appointments', protect, getAllAppointments);
router.put('/appointments/status', protect, updateAppointmentStatus);
router.put('/appointments/meeting-link', protect, updateAppointmentMeetingLink);

export default router;