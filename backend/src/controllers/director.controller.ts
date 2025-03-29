import { Request, Response } from 'express';
import { PracticeRecord, User, UserRole } from '../models';
import { Op } from 'sequelize';

// Get all students (for band director)
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await User.findAll({
      where: {
        role: UserRole.STUDENT
      },
      attributes: ['id', 'username', 'firstName', 'lastName', 'email'],
      order: [['lastName', 'ASC'], ['firstName', 'ASC']]
    });

    res.status(200).json({ students });
  } catch (error) {
    console.error('Error getting all students:', error);
    res.status(500).json({ message: 'Error retrieving students' });
  }
};

// Get all practice records for a specific week
export const getWeeklyRecords = async (req: Request, res: Response) => {
  try {
    const { weekStartDate } = req.params;
    
    // Validate date format
    const date = new Date(weekStartDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    // Get all practice records for the specified week
    const records = await PracticeRecord.findAll({
      where: {
        weekStartDate: date
      },
      include: [{
        model: User,
        as: 'student',
        attributes: ['id', 'firstName', 'lastName']
      }],
      order: [
        [{ model: User, as: 'student' }, 'lastName', 'ASC'],
        [{ model: User, as: 'student' }, 'firstName', 'ASC']
      ]
    });

    res.status(200).json({ records });
  } catch (error) {
    console.error('Error getting weekly records:', error);
    res.status(500).json({ message: 'Error retrieving practice records' });
  }
};

// Get practice records for a specific student
export const getStudentRecords = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    // Verify student exists
    const student = await User.findOne({
      where: {
        id: studentId,
        role: UserRole.STUDENT
      }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get the student's practice records
    const records = await PracticeRecord.findAll({
      where: {
        studentId
      },
      order: [['weekStartDate', 'DESC']]
    });

    res.status(200).json({
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName
      },
      records
    });
  } catch (error) {
    console.error('Error getting student records:', error);
    res.status(500).json({ message: 'Error retrieving practice records' });
  }
};

// Get summary statistics for all students
export const getStatistics = async (req: Request, res: Response) => {
  try {
    // Get current date and date 4 weeks ago
    const today = new Date();
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(today.getDate() - 28);

    // Get all practice records for the last 4 weeks
    const records = await PracticeRecord.findAll({
      where: {
        weekStartDate: {
          [Op.gte]: fourWeeksAgo
        }
      },
      include: [{
        model: User,
        as: 'student',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });

    // Calculate statistics per student
    const studentStats: Record<number, any> = {};
    
    records.forEach(record => {
      const studentId = record.studentId;
      
      if (!studentStats[studentId]) {
        studentStats[studentId] = {
          studentId,
          // @ts-ignore - student is included in the query
          firstName: record.student?.firstName,
          // @ts-ignore - student is included in the query
          lastName: record.student?.lastName,
          totalMinutes: 0,
          averageMinutesPerWeek: 0,
          averagePointsPerWeek: 0,
          weekCount: 0,
          signatureRate: 0
        };
      }
      
      studentStats[studentId].totalMinutes += record.totalMinutes;
      studentStats[studentId].weekCount += 1;
      studentStats[studentId].averagePointsPerWeek += record.totalPoints;
      
      if (record.parentSignatureId) {
        studentStats[studentId].signatureRate += 1;
      }
    });
    
    // Calculate averages
    Object.keys(studentStats).forEach(key => {
      const studentId = parseInt(key);
      const stats = studentStats[studentId];
      
      if (stats.weekCount > 0) {
        stats.averageMinutesPerWeek = Math.round(stats.totalMinutes / stats.weekCount);
        stats.averagePointsPerWeek = Math.round(stats.averagePointsPerWeek / stats.weekCount);
        stats.signatureRate = Math.round((stats.signatureRate / stats.weekCount) * 100);
      }
    });

    res.status(200).json({
      statistics: Object.values(studentStats),
      period: {
        start: fourWeeksAgo,
        end: today
      }
    });
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({ message: 'Error retrieving statistics' });
  }
};
