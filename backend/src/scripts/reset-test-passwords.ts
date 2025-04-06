import { User } from '../models';
import bcrypt from 'bcryptjs';

async function resetTestPasswords() {
  try {
    console.log('Resetting passwords for test accounts...');
    
    // Reset director password
    const director = await User.findOne({
      where: { email: 'director@example.com' }
    });
    
    if (director) {
      const hashedPassword = await bcrypt.hash('test123', 10);
      await director.update({ password: hashedPassword });
      console.log('Director password reset successfully');
    } else {
      console.log('Director account not found');
    }
    
    // Reset student password
    const student = await User.findOne({
      where: { email: 'student@example.com' }
    });
    
    if (student) {
      const hashedPassword = await bcrypt.hash('test123', 10);
      await student.update({ password: hashedPassword });
      console.log('Student password reset successfully');
    } else {
      console.log('Student account not found');
    }
    
    // Reset parent password
    const parent = await User.findOne({
      where: { email: 'parent@example.com' }
    });
    
    if (parent) {
      const hashedPassword = await bcrypt.hash('test123', 10);
      await parent.update({ password: hashedPassword });
      console.log('Parent password reset successfully');
    } else {
      console.log('Parent account not found');
    }
    
    // Also reset testdirector password
    const testDirector = await User.findOne({
      where: { email: 'testdirector@example.com' }
    });
    
    if (testDirector) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await testDirector.update({ password: hashedPassword });
      console.log('Test director password reset successfully');
    }
    
    console.log('\nTest accounts available:');
    console.log('-------------------------');
    console.log('Director:');
    console.log('  Email: director@example.com');
    console.log('  Password: test123');
    console.log('\nStudent:');
    console.log('  Email: student@example.com');
    console.log('  Password: test123');
    console.log('\nParent:');
    console.log('  Email: parent@example.com');
    console.log('  Password: test123');
    
  } catch (error) {
    console.error('Error resetting passwords:', error);
  }
}

// Run the function
resetTestPasswords()
  .then(() => {
    console.log('\nPassword reset completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  });
