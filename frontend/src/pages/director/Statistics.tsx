import { useState, useEffect } from 'react';
import { directorService } from '../../services/api';
import { StudentStatistics } from '../../types/practice-record';

const DirectorStatistics = () => {
  const [statistics, setStatistics] = useState<StudentStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await directorService.getStatistics();
      setStatistics(response.data.statistics);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (statistics.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Student Statistics</h1>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
          <p>No statistics available. Students need to submit practice records first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Student Statistics</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Last 4 Weeks Summary</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Avg. Minutes/Week
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Avg. Points/Week
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Signature Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Weeks Recorded
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {statistics.map((stat) => (
                <tr key={stat.studentId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {stat.firstName} {stat.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {stat.averageMinutesPerWeek}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <span className={`px-2 py-1 rounded-full ${
                      stat.averagePointsPerWeek >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      stat.averagePointsPerWeek >= 70 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      stat.averagePointsPerWeek >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {stat.averagePointsPerWeek}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <span className={`px-2 py-1 rounded-full ${
                      stat.signatureRate >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      stat.signatureRate >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {stat.signatureRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {stat.weekCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="p-4 rounded-lg" 
            style={{ 
              backgroundColor: 'var(--color-primary-600)',
              color: 'var(--primary-text-color)'
            }}
          >
            <h3 className="font-medium mb-2">Average Practice Time</h3>
            <p className="text-2xl font-bold">
              {statistics.reduce((acc, stat) => acc + stat.averageMinutesPerWeek, 0) / statistics.length} min
            </p>
            <p className="text-sm mt-1">Per student per week</p>
          </div>
          
          <div 
            className="p-4 rounded-lg" 
            style={{ 
              backgroundColor: 'var(--color-primary-700)',
              color: 'var(--secondary-text-color)'
            }}
          >
            <h3 className="font-medium mb-2">Average Score</h3>
            <p className="text-2xl font-bold">
              {Math.round(statistics.reduce((acc, stat) => acc + stat.averagePointsPerWeek, 0) / statistics.length)} / 105
            </p>
            <p className="text-sm mt-1">Points per week</p>
          </div>
          
          <div 
            className="p-4 rounded-lg" 
            style={{ 
              backgroundColor: 'var(--color-primary-600)',
              color: 'var(--primary-text-color)'
            }}
          >
            <h3 className="font-medium mb-2">Signature Rate</h3>
            <p className="text-2xl font-bold">
              {Math.round(statistics.reduce((acc, stat) => acc + stat.signatureRate, 0) / statistics.length)}%
            </p>
            <p className="text-sm mt-1">Parent verification</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorStatistics;
