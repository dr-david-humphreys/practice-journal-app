import { Request, Response } from 'express';
import { SchoolSettings, SchoolLevel, ProgramType } from '../models';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'logo-' + uniqueSuffix + ext);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed') as any);
    }
  }
});

// Get current settings
export const getSettings = async (req: Request, res: Response) => {
  try {
    // Get settings or create with defaults if they don't exist
    let settings = await SchoolSettings.findOne({ where: { id: 1 } });
    
    if (!settings) {
      settings = await SchoolSettings.create({
        primaryColor: '#0284c7',
        secondaryColor: '#0369a1',
        logoUrl: null,
        weekStartDay: 0,
        schoolName: 'My School',
        schoolLevel: SchoolLevel.HIGH_SCHOOL,
        programType: ProgramType.BAND,
        customSchoolLevel: null,
        customProgramType: null
      });
    } else {
      // Handle case where new fields might not exist in the database yet
      const settingsData = settings.toJSON();
      if (!('schoolName' in settingsData) || !settingsData.schoolName) {
        settings.schoolName = 'My School';
      }
      if (!('schoolLevel' in settingsData) || !settingsData.schoolLevel) {
        settings.schoolLevel = SchoolLevel.HIGH_SCHOOL;
      }
      if (!('programType' in settingsData) || !settingsData.programType) {
        settings.programType = ProgramType.BAND;
      }
      if (!('customSchoolLevel' in settingsData)) {
        settings.customSchoolLevel = null;
      }
      if (!('customProgramType' in settingsData)) {
        settings.customProgramType = null;
      }
    }
    
    res.status(200).json({ settings });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ message: 'Error retrieving settings' });
  }
};

// Update settings
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { 
      primaryColor, 
      secondaryColor, 
      weekStartDay,
      schoolName,
      schoolLevel,
      programType,
      customSchoolLevel,
      customProgramType
    } = req.body;
    
    // Validate weekStartDay
    if (weekStartDay !== undefined && (weekStartDay < 0 || weekStartDay > 6)) {
      return res.status(400).json({ message: 'Week start day must be between 0 (Sunday) and 6 (Saturday)' });
    }
    
    // Get settings or create with defaults
    let settings = await SchoolSettings.findOne({ where: { id: 1 } });
    
    if (!settings) {
      settings = await SchoolSettings.create({
        primaryColor: primaryColor || '#0284c7',
        secondaryColor: secondaryColor || '#0369a1',
        logoUrl: null,
        weekStartDay: weekStartDay !== undefined ? weekStartDay : 0,
        schoolName: schoolName || 'My School',
        schoolLevel: schoolLevel || SchoolLevel.HIGH_SCHOOL,
        programType: programType || ProgramType.BAND,
        customSchoolLevel: schoolLevel === SchoolLevel.OTHER ? customSchoolLevel : null,
        customProgramType: programType === ProgramType.OTHER ? customProgramType : null
      });
    } else {
      // Create update object with only the fields that exist in the database
      const updateData: any = {};
      
      if (primaryColor !== undefined) updateData.primaryColor = primaryColor;
      if (secondaryColor !== undefined) updateData.secondaryColor = secondaryColor;
      if (weekStartDay !== undefined) updateData.weekStartDay = weekStartDay;
      
      // Check if the new fields exist in the model before updating them
      const settingsData = settings.toJSON();
      
      if ('schoolName' in settingsData && schoolName !== undefined) {
        updateData.schoolName = schoolName;
      }
      
      if ('schoolLevel' in settingsData && schoolLevel !== undefined) {
        updateData.schoolLevel = schoolLevel;
        
        if (schoolLevel === SchoolLevel.OTHER && 'customSchoolLevel' in settingsData) {
          updateData.customSchoolLevel = customSchoolLevel;
        } else if ('customSchoolLevel' in settingsData) {
          updateData.customSchoolLevel = null;
        }
      }
      
      if ('programType' in settingsData && programType !== undefined) {
        updateData.programType = programType;
        
        if (programType === ProgramType.OTHER && 'customProgramType' in settingsData) {
          updateData.customProgramType = customProgramType;
        } else if ('customProgramType' in settingsData) {
          updateData.customProgramType = null;
        }
      }
      
      // Update only provided fields
      await settings.update(updateData);
      
      // Refresh settings
      settings = await SchoolSettings.findOne({ where: { id: 1 } });
    }
    
    res.status(200).json({ 
      message: 'Settings updated successfully',
      settings 
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
};

// Upload logo
export const uploadLogo = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Get settings or create with defaults
    let settings = await SchoolSettings.findOne({ where: { id: 1 } });
    
    // Create relative URL for the logo
    const logoUrl = `/uploads/${req.file.filename}`;
    
    if (!settings) {
      settings = await SchoolSettings.create({
        primaryColor: '#0284c7',
        secondaryColor: '#0369a1',
        logoUrl,
        weekStartDay: 0,
        schoolName: 'My School',
        schoolLevel: SchoolLevel.HIGH_SCHOOL,
        programType: ProgramType.BAND,
        customSchoolLevel: null,
        customProgramType: null
      });
    } else {
      // Delete old logo if exists
      if (settings.logoUrl) {
        const oldLogoPath = path.join(__dirname, '../..', settings.logoUrl);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      
      // Update logo URL
      await settings.update({ logoUrl });
      
      // Refresh settings
      settings = await SchoolSettings.findOne({ where: { id: 1 } });
    }
    
    res.status(200).json({ 
      message: 'Logo uploaded successfully',
      settings 
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ message: 'Error uploading logo' });
  }
};

// Delete logo
export const deleteLogo = async (req: Request, res: Response) => {
  try {
    // Get settings
    const settings = await SchoolSettings.findOne({ where: { id: 1 } });
    
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    
    // Delete logo file if exists
    if (settings.logoUrl) {
      const logoPath = path.join(__dirname, '../..', settings.logoUrl);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
      
      // Update settings
      await settings.update({ logoUrl: null });
      
      res.status(200).json({ 
        message: 'Logo deleted successfully',
        settings: await SchoolSettings.findOne({ where: { id: 1 } })
      });
    } else {
      res.status(400).json({ message: 'No logo to delete' });
    }
  } catch (error) {
    console.error('Error deleting logo:', error);
    res.status(500).json({ message: 'Error deleting logo' });
  }
};
