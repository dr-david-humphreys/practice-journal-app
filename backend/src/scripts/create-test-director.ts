import { User, UserRole } from '../models';
import bcrypt from 'bcryptjs';

async function createTestDirector() {
  try {
    // Check if test director already exists
    const existingUser = await User.findOne({
      where: { username: 'testdirector' }
    });

    if (existingUser) {
      console.log('Test director account already exists:');
      console.log({
        username: existingUser.username,
        password: 'password123', // Default password for existing account
        role: existingUser.role
      });
      return;
    }

    // Create test director account
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const director = await User.create({
      username: 'testdirector',
      email: 'testdirector@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'Director',
      role: UserRole.DIRECTOR
    });

    console.log('Test director account created successfully:');
    console.log({
      username: director.username,
      password: 'password123',
      role: director.role
    });
  } catch (error) {
    console.error('Error creating test director account:', error);
  }
}

// Run the function
createTestDirector()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  });
