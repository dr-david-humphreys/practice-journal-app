import { Router } from 'express';
import * as studentController from '../controllers/student.controller';
import { verifyToken, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models';

const router = Router();

// All routes require authentication and student role
router.use(verifyToken, authorize(UserRole.STUDENT));

// Get current week's practice record
router.get('/current-week', studentController.getCurrentWeekRecord);

// Get practice record by ID
router.get('/records/:id', studentController.getRecordById);

// Get all practice records
router.get('/records', studentController.getAllRecords);

// Update practice minutes for a specific day
router.patch('/records/:id/practice', studentController.updatePracticeMinutes);

// Get parents associated with the student
router.get('/parents', studentController.getParents);

// Send verification text to parent
router.post('/send-verification', studentController.sendVerificationText);

// Verify practice record with code
router.post('/verify-practice', studentController.verifyPracticeRecord);

export default router;
