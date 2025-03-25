import { Router } from 'express';
import * as parentController from '../controllers/parent.controller';
import { verifyToken, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models';

const router = Router();

// All routes require authentication and parent role
router.use(verifyToken, authorize(UserRole.PARENT));

// Get all children associated with the parent
router.get('/children', parentController.getChildren);

// Get all practice records for a specific child
router.get('/children/:childId/records', parentController.getChildRecords);

// Get a specific practice record for a child
router.get('/children/:childId/records/:recordId', parentController.getChildRecordById);

// Sign a practice record
router.post('/children/:childId/records/:recordId/sign', parentController.signRecord);

export default router;
