import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parentService } from '../../services/api';
import { User } from '../../types/user';

interface ChildWithRecords {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  recordCount: number;
  unsignedRecords: number;
}

const ParentChildren = () => {
  const [children, setChildren] = useState<ChildWithRecords[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await parentService.getChildren();
      
      // Process children data to get records
      const childrenWithRecords = await Promise.all(
        response.data.children.map(async (child: User) => {
          try {
            const recordsResponse = await parentService.getChildRecords(child.id);
            const records = recordsResponse.data.records;
            const unsignedRecords = records.filter(record => !record.parentSignatureId).length;
            
            return {
              ...child,
              recordCount: records.length,
              unsignedRecords
            };
          } catch (err) {
            return {
              ...child,
              recordCount: 0,
              unsignedRecords: 0
            };
          }
        })
      );
      
      setChildren(childrenWithRecords);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load children');
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

  if (children.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Children</h1>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
          <p className="mb-4">You don't have any children associated with your account yet.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Note: Children need to be linked to your account by a band director or administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Children</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child) => (
          <div key={child.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                {child.firstName} {child.lastName}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">{child.username}</p>
              
              <div className="space-y-2 mb-4">
                <p>
                  <span className="font-medium">Total Records:</span> {child.recordCount}
                </p>
                <p>
                  <span className="font-medium">Unsigned Records:</span>{' '}
                  <span className={child.unsignedRecords > 0 ? 'text-yellow-600 dark:text-yellow-400 font-medium' : ''}>
                    {child.unsignedRecords}
                  </span>
                </p>
              </div>
              
              {child.recordCount > 0 && (
                <div className="mt-4">
                  <Link 
                    to={`/children/${child.id}/records`}
                    className="btn btn-primary w-full text-center"
                  >
                    View Practice Records
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentChildren;
