import { Request, Response } from 'express';
import { PracticeRecord, User, UserRole } from '../models';
import { Op } from 'sequelize';

// Get all children associated with the parent
export const getChildren = async (req: Request, res: Response) => {
  try {
    const parent = await User.findByPk(req.userId, {
      include: [{
        model: User,
        as: 'children',
        attributes: ['id', 'username', 'firstName', 'lastName', 'email']
      }]
    });

    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    res.status(200).json({
      // @ts-ignore - children is defined in the association
      children: parent.children
    });
  } catch (error) {
    console.error('Error getting children:', error);
    res.status(500).json({ message: 'Error retrieving children' });
  }
};

// Get all practice records for a specific child
export const getChildRecords = async (req: Request, res: Response) => {
  try {
    const { childId } = req.params;

    // Verify that the child is associated with the parent
    const parent = await User.findByPk(req.userId, {
      include: [{
        model: User,
        as: 'children',
        where: { id: childId },
        attributes: ['id']
      }]
    });

    if (!parent || !parent.get('children') || (parent.get('children') as any).length === 0) {
      return res.status(403).json({ message: 'Not authorized to view this child\'s records' });
    }

    // Get the child's practice records
    const records = await PracticeRecord.findAll({
      where: {
        studentId: childId
      },
      order: [['weekStartDate', 'DESC']]
    });

    res.status(200).json({ records });
  } catch (error) {
    console.error('Error getting child records:', error);
    res.status(500).json({ message: 'Error retrieving practice records' });
  }
};

// Get a specific practice record for a child
export const getChildRecordById = async (req: Request, res: Response) => {
  try {
    const { childId, recordId } = req.params;

    // Verify that the child is associated with the parent
    const parent = await User.findByPk(req.userId, {
      include: [{
        model: User,
        as: 'children',
        where: { id: childId },
        attributes: ['id']
      }]
    });

    if (!parent || !parent.get('children') || (parent.get('children') as any).length === 0) {
      return res.status(403).json({ message: 'Not authorized to view this child\'s records' });
    }

    // Get the specific practice record
    const record = await PracticeRecord.findOne({
      where: {
        id: recordId,
        studentId: childId
      }
    });

    if (!record) {
      return res.status(404).json({ message: 'Practice record not found' });
    }

    res.status(200).json({ record });
  } catch (error) {
    console.error('Error getting child record:', error);
    res.status(500).json({ message: 'Error retrieving practice record' });
  }
};

// Sign a practice record
export const signRecord = async (req: Request, res: Response) => {
  try {
    const { childId, recordId } = req.params;

    // Verify that the child is associated with the parent
    const parent = await User.findByPk(req.userId, {
      include: [{
        model: User,
        as: 'children',
        where: { id: childId },
        attributes: ['id']
      }]
    });

    if (!parent || !parent.get('children') || (parent.get('children') as any).length === 0) {
      return res.status(403).json({ message: 'Not authorized to sign this child\'s records' });
    }

    // Get the practice record
    const record = await PracticeRecord.findOne({
      where: {
        id: recordId,
        studentId: childId
      }
    });

    if (!record) {
      return res.status(404).json({ message: 'Practice record not found' });
    }

    // Update the record with parent signature
    await record.update({
      parentSignatureId: req.userId,
      signatureDate: new Date()
    });

    res.status(200).json({
      message: 'Practice record signed successfully',
      record
    });
  } catch (error) {
    console.error('Error signing record:', error);
    res.status(500).json({ message: 'Error signing practice record' });
  }
};
