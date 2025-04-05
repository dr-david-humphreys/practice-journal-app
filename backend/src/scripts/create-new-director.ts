import { User, UserRole } from '../models';
import bcrypt from 'bcryptjs';

async function createNewDirector() {
  try {
    // Check if test director already exists
    const existingUser = await User.findOne({
      where: { username: 'director' }
    });

    if (existingUser) {
      // Update the password for the existing user
      const hashedPassword = await bcrypt.hash('test123', 10);
      await existingUser.update({ password: hashedPassword });
      
      console.log('Director account password updated:');
      console.log({
        username: existingUser.username,
        password: 'test123',
        role: existingUser.role
      });
      return;
    }

    // Create test director account with a simple password
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const director = await User.create({
      username: 'director',
      email: 'director@example.com',
      password: hashedPassword,
      firstName: 'School',
      lastName: 'Director',
      role: UserRole.DIRECTOR
    });

    console.log('New director account created successfully:');
    console.log({
      username: director.username,
      password: 'test123',
      role: director.role
    });
  } catch (error) {
    console.error('Error creating/updating director account:', error);
  }
}

// Run the function
createNewDirector()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  });
