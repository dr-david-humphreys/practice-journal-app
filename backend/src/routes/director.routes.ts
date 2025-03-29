import { Router } from 'express';
import * as directorController from '../controllers/director.controller';
import { verifyToken, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models';

const router = Router();

// All routes require authentication and director role
router.use(verifyToken, authorize(UserRole.DIRECTOR));

// Get all students
router.get('/students', directorController.getAllStudents);

// Get all practice records for a specific week
router.get('/records/week/:weekStartDate', directorController.getWeeklyRecords);

// Get practice records for a specific student
router.get('/students/:studentId/records', directorController.getStudentRecords);

// Get summary statistics for all students
router.get('/statistics', directorController.getStatistics);

export default router;
