import { sequelize } from '../models/db';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Database connection established');

    // Create a hashed password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert admin user directly using SQL query
    const [results, metadata] = await sequelize.query(`
      INSERT INTO users (username, email, password, firstName, lastName, role, createdAt, updatedAt)
      VALUES ('admin', 'admin@example.com', '${hashedPassword}', 'Admin', 'User', 'director', datetime('now'), datetime('now'))
      ON CONFLICT(username) DO UPDATE SET
      password = '${hashedPassword}',
      updatedAt = datetime('now')
    `);

    console.log('Admin user created or updated successfully');
    console.log({
      username: 'admin',
      password: password,
      role: 'director'
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdmin();
