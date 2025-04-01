import express from 'express';
import * as settingsController from '../controllers/settings.controller';
import { verifyToken, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// Apply director role middleware to all routes
router.use(authorize(UserRole.DIRECTOR));

// Get settings
router.get('/', settingsController.getSettings);

// Update settings
router.put('/', settingsController.updateSettings);

// Upload logo
router.post('/logo', settingsController.upload.single('logo'), settingsController.uploadLogo);

// Delete logo
router.delete('/logo', settingsController.deleteLogo);

export default router;
