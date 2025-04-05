import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types/user';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, userRole } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Welcome to Practice Journal</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Hello, {user?.firstName} {user?.lastName}!
        </h2>
        
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {userRole === UserRole.STUDENT && 'Track your practice time and view your progress.'}
          {userRole === UserRole.PARENT && 'View and sign your children\'s practice records.'}
          {userRole === UserRole.DIRECTOR && 'Monitor student practice records and view statistics.'}
        </p>
        
        <div className="mt-6">
          {userRole === UserRole.STUDENT && (
            <Link to="/practice" className="btn btn-primary inline-block">
              Go to Practice Log
            </Link>
          )}
          
          {userRole === UserRole.PARENT && (
            <Link to="/children" className="btn btn-primary inline-block">
              View My Children
            </Link>
          )}
          
          {userRole === UserRole.DIRECTOR && (
            <Link to="/students" className="btn btn-primary inline-block">
              View Students
            </Link>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">How It Works</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Students log practice minutes for each day of the week</li>
            <li>Parents verify and sign the practice records</li>
            <li>Band directors review and grade student progress</li>
            <li>Grades are calculated automatically based on practice time</li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Grading System</h3>
          <p className="mb-2 text-gray-700 dark:text-gray-300">
            Practice time is converted to points:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            <li>100+ minutes: 80 points</li>
            <li>90-99 minutes: 75 points</li>
            <li>80-89 minutes: 70 points</li>
            <li>70-79 minutes: 65 points</li>
            <li>60-69 minutes: 60 points</li>
            <li>50-59 minutes: 55 points</li>
            <li>40-49 minutes: 50 points</li>
            <li>30-39 minutes: 45 points</li>
            <li>20-29 minutes: 40 points</li>
            <li>0-19 minutes: 35 points</li>
            <li>Parent signature: +20 points</li>
            <li>Practice 5+ days: +5 bonus points</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
