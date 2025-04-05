import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Use SQLite for development
const dbPath = path.resolve(__dirname, '../../practice_journal.sqlite');

// Create the application database connection
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
});

// No need for initialization with SQLite
export const initDatabase = async () => {
  console.log(`Using SQLite database at: ${dbPath}`);
};
