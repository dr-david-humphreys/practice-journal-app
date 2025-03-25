import { Model, DataTypes } from 'sequelize';
import { sequelize } from './db';
import User from './user.model';

interface StudentParentAttributes {
  id: number;
  studentId: number;
  parentId: number;
}

interface StudentParentCreationAttributes extends Omit<StudentParentAttributes, 'id'> {}

class StudentParent extends Model<StudentParentAttributes, StudentParentCreationAttributes> implements StudentParentAttributes {
  public id!: number;
  public studentId!: number;
  public parentId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

StudentParent.init(
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
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'student_parents',
    indexes: [
      {
        unique: true,
        fields: ['studentId', 'parentId']
      }
    ]
  }
);

// Define associations
User.belongsToMany(User, { 
  through: StudentParent,
  as: 'parents',
  foreignKey: 'studentId',
  otherKey: 'parentId'
});

User.belongsToMany(User, {
  through: StudentParent,
  as: 'children',
  foreignKey: 'parentId',
  otherKey: 'studentId'
});

export default StudentParent;
