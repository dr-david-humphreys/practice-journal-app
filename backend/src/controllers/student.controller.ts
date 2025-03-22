import { Request, Response } from 'express';
import { PracticeRecord, User, UserRole } from '../models';
import { Op } from 'sequelize';

// Get current week's practice record for the logged-in student
export const getCurrentWeekRecord = async (req: Request, res: Response) => {
  try {
    // Get the current week's start date (Monday)
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    // Find or create the current week's practice record
    const [record, created] = await PracticeRecord.findOrCreate({
      where: {
        studentId: req.userId,
        weekStartDate: monday
      },
      defaults: {
        studentId: req.userId!,
        weekStartDate: monday,
        mondayMinutes: 0,
        tuesdayMinutes: 0,
        wednesdayMinutes: 0,
        thursdayMinutes: 0,
        fridayMinutes: 0,
        saturdayMinutes: 0,
        sundayMinutes: 0
      }
    });

    res.status(200).json({
      message: created ? 'New practice record created' : 'Practice record found',
      record
    });
  } catch (error) {
    console.error('Error getting current week record:', error);
    res.status(500).json({ message: 'Error retrieving practice record' });
  }
};

// Get practice record by ID
export const getRecordById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const record = await PracticeRecord.findOne({
      where: {
        id,
        studentId: req.userId
      }
    });

    if (!record) {
      return res.status(404).json({ message: 'Practice record not found' });
    }

    res.status(200).json({ record });
  } catch (error) {
    console.error('Error getting practice record:', error);
    res.status(500).json({ message: 'Error retrieving practice record' });
  }
};

// Get all practice records for the logged-in student
export const getAllRecords = async (req: Request, res: Response) => {
  try {
    const records = await PracticeRecord.findAll({
      where: {
        studentId: req.userId
      },
      order: [['weekStartDate', 'DESC']]
    });

    res.status(200).json({ records });
  } catch (error) {
    console.error('Error getting all practice records:', error);
    res.status(500).json({ message: 'Error retrieving practice records' });
  }
};

// Update practice minutes for a specific day
export const updatePracticeMinutes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { day, minutes } = req.body;

    // Validate day
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (!validDays.includes(day.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid day' });
    }

    // Validate minutes
    if (typeof minutes !== 'number' || minutes < 0) {
      return res.status(400).json({ message: 'Minutes must be a non-negative number' });
    }

    // Find the practice record
    const record = await PracticeRecord.findOne({
      where: {
        id,
        studentId: req.userId
      }
    });

    if (!record) {
      return res.status(404).json({ message: 'Practice record not found' });
    }

    // Update the minutes for the specified day
    const dayField = `${day.toLowerCase()}Minutes` as keyof PracticeRecord;
    await record.update({
      [dayField]: minutes
    });

    res.status(200).json({
      message: 'Practice minutes updated successfully',
      record
    });
  } catch (error) {
    console.error('Error updating practice minutes:', error);
    res.status(500).json({ message: 'Error updating practice minutes' });
  }
};

// Get parents associated with the student
export const getParents = async (req: Request, res: Response) => {
  try {
    const student = await User.findByPk(req.userId, {
      include: [{
        model: User,
        as: 'parents',
        attributes: ['id', 'username', 'firstName', 'lastName', 'email']
      }]
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      // @ts-ignore - parents is defined in the association
      parents: student.parents
    });
  } catch (error) {
    console.error('Error getting parents:', error);
    res.status(500).json({ message: 'Error retrieving parents' });
  }
};

// Send approval text to parent
export const sendVerificationText = async (req: Request, res: Response) => {
  try {
    const { parentPhoneNumber, recordId } = req.body;
    
    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(parentPhoneNumber)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }
    
    // Find the practice record
    const record = await PracticeRecord.findOne({
      where: {
        id: recordId,
        studentId: req.userId
      },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['firstName', 'lastName']
        }
      ]
    });

    if (!record) {
      return res.status(404).json({ message: 'Practice record not found' });
    }
    
    // Set expiry (24 hours from now)
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    // Update the record with pending status and expiry
    await record.update({
      verificationCode: 'PENDING',
      verificationExpiry
    });
    
    // Get student name for the message
    const student = record.get('student') as User | undefined;
    const studentName = student ? `${student.firstName} ${student.lastName}` : 'Your student';
    
    // In a real implementation, you would use a service like Twilio to send the text
    // The message would include the student's name, practice minutes, and ask for Y/N response
    const messageText = `${studentName} has logged ${record.totalMinutes} minutes of practice for the week of ${record.weekStartDate}. Reply Y to approve or N to deny.`;
    
    console.log(`Text message sent to ${parentPhoneNumber}: ${messageText}`);
    
    // Return success response
    res.status(200).json({
      message: 'Approval request sent successfully',
      record
    });
  } catch (error) {
    console.error('Error sending approval text:', error);
    res.status(500).json({ message: 'Error sending approval text' });
  }
};

// Process parent response (Y/N)
export const verifyPracticeRecord = async (req: Request, res: Response) => {
  try {
    const { parentResponse, recordId } = req.body;
    
    // Find the practice record
    const record = await PracticeRecord.findOne({
      where: {
        id: recordId,
        studentId: req.userId,
        verificationCode: 'PENDING'
      }
    });

    if (!record) {
      return res.status(404).json({ message: 'Pending practice record not found' });
    }
    
    // Check if verification has expired
    if (!record.verificationExpiry || new Date() > record.verificationExpiry) {
      return res.status(400).json({ message: 'Approval request has expired' });
    }
    
    // Process the response
    const approved = parentResponse.toUpperCase() === 'Y';
    
    // Update the record based on the response
    if (approved) {
      await record.update({
        parentSignatureId: 0, // Using 0 as a placeholder since we don't have an actual parent user
        signatureDate: new Date(),
        verificationCode: null,
        verificationExpiry: null
      });
      
      res.status(200).json({
        message: 'Practice record approved successfully',
        record
      });
    } else {
      await record.update({
        verificationCode: null,
        verificationExpiry: null
      });
      
      res.status(200).json({
        message: 'Practice record was not approved',
        record
      });
    }
  } catch (error) {
    console.error('Error processing parent response:', error);
    res.status(500).json({ message: 'Error processing parent response' });
  }
};
