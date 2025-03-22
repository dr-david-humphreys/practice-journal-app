import { Model, DataTypes } from 'sequelize';
import { sequelize } from './db';
import User from './user.model';

interface PracticeRecordAttributes {
  id: number;
  studentId: number;
  weekStartDate: Date;
  mondayMinutes: number;
  tuesdayMinutes: number;
  wednesdayMinutes: number;
  thursdayMinutes: number;
  fridayMinutes: number;
  saturdayMinutes: number;
  sundayMinutes: number;
  totalMinutes: number;
  daysWithPractice: number;
  parentSignatureId: number | null;
  signatureDate: Date | null;
  basePoints: number;
  bonusPoints: number;
  parentSignaturePoints: number;
  totalPoints: number;
  verificationCode: string | null;
  verificationExpiry: Date | null;
}

interface PracticeRecordCreationAttributes extends Omit<PracticeRecordAttributes, 'id' | 'totalMinutes' | 'daysWithPractice' | 'basePoints' | 'bonusPoints' | 'parentSignaturePoints' | 'totalPoints'> {}

class PracticeRecord extends Model<PracticeRecordAttributes, PracticeRecordCreationAttributes> implements PracticeRecordAttributes {
  public id!: number;
  public studentId!: number;
  public weekStartDate!: Date;
  public mondayMinutes!: number;
  public tuesdayMinutes!: number;
  public wednesdayMinutes!: number;
  public thursdayMinutes!: number;
  public fridayMinutes!: number;
  public saturdayMinutes!: number;
  public sundayMinutes!: number;
  public totalMinutes!: number;
  public daysWithPractice!: number;
  public parentSignatureId!: number | null;
  public signatureDate!: Date | null;
  public basePoints!: number;
  public bonusPoints!: number;
  public parentSignaturePoints!: number;
  public totalPoints!: number;
  public verificationCode!: string | null;
  public verificationExpiry!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Calculate total minutes practiced
  private calculateTotalMinutes(): number {
    return (
      this.mondayMinutes +
      this.tuesdayMinutes +
      this.wednesdayMinutes +
      this.thursdayMinutes +
      this.fridayMinutes +
      this.saturdayMinutes +
      this.sundayMinutes
    );
  }

  // Calculate days with practice
  private calculateDaysWithPractice(): number {
    return [
      this.mondayMinutes,
      this.tuesdayMinutes,
      this.wednesdayMinutes,
      this.thursdayMinutes,
      this.fridayMinutes,
      this.saturdayMinutes,
      this.sundayMinutes
    ].filter(minutes => minutes > 0).length;
  }

  // Calculate base points based on total minutes
  private calculateBasePoints(totalMinutes: number): number {
    if (totalMinutes >= 100) return 80;
    if (totalMinutes >= 90) return 75;
    if (totalMinutes >= 80) return 70;
    if (totalMinutes >= 70) return 65;
    if (totalMinutes >= 60) return 60;
    if (totalMinutes >= 50) return 55;
    if (totalMinutes >= 40) return 50;
    if (totalMinutes >= 30) return 45;
    if (totalMinutes >= 20) return 40;
    return 35; // 19 or fewer minutes
  }

  // Calculate bonus points (5 points if practiced 5+ days)
  private calculateBonusPoints(daysWithPractice: number): number {
    return daysWithPractice >= 5 ? 5 : 0;
  }

  // Calculate parent signature points (20 points if signed)
  private calculateParentSignaturePoints(): number {
    return this.parentSignatureId ? 20 : 0;
  }

  // Calculate total points
  private calculateTotalPoints(): number {
    return this.basePoints + this.bonusPoints + this.parentSignaturePoints;
  }

  // Update all calculated fields
  public updateCalculatedFields(): void {
    this.totalMinutes = this.calculateTotalMinutes();
    this.daysWithPractice = this.calculateDaysWithPractice();
    this.basePoints = this.calculateBasePoints(this.totalMinutes);
    this.bonusPoints = this.calculateBonusPoints(this.daysWithPractice);
    this.parentSignaturePoints = this.calculateParentSignaturePoints();
    this.totalPoints = this.calculateTotalPoints();
  }
}

PracticeRecord.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    weekStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    mondayMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    tuesdayMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    wednesdayMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    thursdayMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    fridayMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    saturdayMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    sundayMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    totalMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    daysWithPractice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    parentSignatureId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    signatureDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    basePoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bonusPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    parentSignaturePoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    totalPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    verificationExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'practice_records',
    hooks: {
      beforeCreate: (record: PracticeRecord) => {
        record.updateCalculatedFields();
      },
      beforeUpdate: (record: PracticeRecord) => {
        record.updateCalculatedFields();
      }
    }
  }
);

// Define associations
PracticeRecord.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
PracticeRecord.belongsTo(User, { foreignKey: 'parentSignatureId', as: 'parent' });

export default PracticeRecord;
