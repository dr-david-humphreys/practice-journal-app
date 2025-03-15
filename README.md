# Practice Journal App

A web application for music directors to track and manage student practice records. This app allows students to log their practice time, parents to verify practice sessions, and directors to monitor progress and customize the application to match their school's branding.

## Features

### For Students
- Log daily practice minutes
- Track progress over time
- View practice history and weekly scores

### For Parents
- Verify children's practice records
- View practice history and progress

### For Directors
- View all student practice records
- Generate weekly reports
- Access statistics and insights
- Customize the application with school branding

### Customization Features
- School name customization
- School level selection (middle school, junior high, high school, senior high, or custom)
- Program type selection (band, orchestra, choir, or custom)
- School color customization (primary and secondary colors with adaptive text colors)
- Custom school logo upload
- Configurable week start day

## Technology Stack

### Frontend
- React with TypeScript
- Zustand for state management
- Tailwind CSS for styling
- Vite for development and building

### Backend
- Node.js with Express
- TypeScript
- Sequelize ORM
- SQLite database (can be configured for other databases)
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/practice-journal-app.git
cd practice-journal-app
```

2. Install dependencies for the backend
```bash
cd backend
npm install
```

3. Install dependencies for the frontend
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run build
npm start
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

3. Access the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## License

This project is licensed under the MIT License - see the LICENSE file for details.
