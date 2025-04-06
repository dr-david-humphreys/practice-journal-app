import { User, UserRole, StudentParent } from '../models';
import bcrypt from 'bcryptjs';

async function createTestAccounts() {
  try {
    // Create test student account
    let student = await User.findOne({
      where: { username: 'student' }
    });

    if (!student) {
      const hashedPassword = await bcrypt.hash('test123', 10);
      
      student = await User.create({
        username: 'student',
        email: 'student@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'Student',
        role: UserRole.STUDENT
      });
      console.log('Test student account created successfully');
    } else {
      const hashedPassword = await bcrypt.hash('test123', 10);
      await student.update({ password: hashedPassword });
      console.log('Test student account password updated');
    }

    // Create test parent account
    let parent = await User.findOne({
      where: { username: 'parent' }
    });

    if (!parent) {
      const hashedPassword = await bcrypt.hash('test123', 10);
      
      parent = await User.create({
        username: 'parent',
        email: 'parent@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'Parent',
        role: UserRole.PARENT
      });
      console.log('Test parent account created successfully');
    } else {
      const hashedPassword = await bcrypt.hash('test123', 10);
      await parent.update({ password: hashedPassword });
      console.log('Test parent account password updated');
    }

    // Link student and parent
    const relationship = await StudentParent.findOne({
      where: {
        studentId: student.id,
        parentId: parent.id
      }
    });

    if (!relationship) {
      await StudentParent.create({
        studentId: student.id,
        parentId: parent.id
      });
      console.log('Student and parent linked successfully');
    } else {
      console.log('Student and parent already linked');
    }

    console.log('\nTest accounts available:');
    console.log('-------------------------');
    console.log('Director:');
    console.log('  Username: director');
    console.log('  Email: director@example.com');
    console.log('  Password: test123');
    console.log('\nStudent:');
    console.log('  Username: student');
    console.log('  Email: student@example.com');
    console.log('  Password: test123');
    console.log('\nParent:');
    console.log('  Username: parent');
    console.log('  Email: parent@example.com');
    console.log('  Password: test123');

  } catch (error) {
    console.error('Error creating test accounts:', error);
  }
}

// Run the function
createTestAccounts()
  .then(() => {
    console.log('\nScript completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  });
