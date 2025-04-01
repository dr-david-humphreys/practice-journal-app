import { Model, DataTypes } from 'sequelize';
import { sequelize } from './db';

export enum SchoolLevel {
  MIDDLE_SCHOOL = 'middle_school',
  JUNIOR_HIGH = 'junior_high',
  HIGH_SCHOOL = 'high_school',
  SENIOR_HIGH = 'senior_high',
  OTHER = 'other'
}

export enum ProgramType {
  BAND = 'band',
  ORCHESTRA = 'orchestra',
  CHOIR = 'choir',
  OTHER = 'other'
}

export interface SchoolSettingsAttributes {
  id: number;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  weekStartDay: number; // 0 = Sunday, 1 = Monday, etc.
  schoolName: string;
  schoolLevel: SchoolLevel;
  programType: ProgramType;
  customSchoolLevel: string | null;
  customProgramType: string | null;
}

export interface SchoolSettingsCreationAttributes extends Omit<SchoolSettingsAttributes, 'id'> {}

class SchoolSettings extends Model<SchoolSettingsAttributes, SchoolSettingsCreationAttributes> implements SchoolSettingsAttributes {
  public id!: number;
  public primaryColor!: string;
  public secondaryColor!: string;
  public logoUrl!: string | null;
  public weekStartDay!: number;
  public schoolName!: string;
  public schoolLevel!: SchoolLevel;
  public programType!: ProgramType;
  public customSchoolLevel!: string | null;
  public customProgramType!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SchoolSettings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    primaryColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#0284c7' // Default primary color (primary-600)
    },
    secondaryColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#0369a1' // Default secondary color (primary-700)
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    weekStartDay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default to Sunday
      validate: {
        min: 0,
        max: 6
      }
    },
    schoolName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'My School'
    },
    schoolLevel: {
      type: DataTypes.ENUM(...Object.values(SchoolLevel)),
      allowNull: false,
      defaultValue: SchoolLevel.HIGH_SCHOOL
    },
    programType: {
      type: DataTypes.ENUM(...Object.values(ProgramType)),
      allowNull: false,
      defaultValue: ProgramType.BAND
    },
    customSchoolLevel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customProgramType: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'school_settings'
  }
);

export default SchoolSettings;
