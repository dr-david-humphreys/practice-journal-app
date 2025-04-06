import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize, initDatabase } from './models/db';
import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';
import parentRoutes from './routes/parent.routes';
import directorRoutes from './routes/director.routes';
import settingsRoutes from './routes/settings.routes';
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://127.0.0.1:5173',
  credentials: true
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/director', directorRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Database connection and server start
const startServer = async () => {
  try {
    // Initialize database (create if it doesn't exist)
    await initDatabase();
    
    // Connect to the database
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database models
    await sequelize.sync({ alter: false });
    console.log('Database models synchronized.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
