import express from 'express';
import { 
  getOwnerStats,
  getAdminOverviewStats,
  getAllAppointments,
  updateAppointmentStatus,
  updateAppointmentMeetingLink,
  exportAllAppointments,
} from '../controller/adminController.js';
import { protect, requireAdmin } from '../middleware/authmiddleware.js';

const router = express.Router();

router.get('/stats', protect, getOwnerStats);
router.get('/overview', protect, requireAdmin, getAdminOverviewStats);
router.get('/appointments', protect, getAllAppointments);
router.get('/appointments/exportCsv', protect, exportAllAppointments);
router.put('/appointments/status', protect, updateAppointmentStatus);
router.put('/appointments/meeting-link', protect, updateAppointmentMeetingLink);

export default router;