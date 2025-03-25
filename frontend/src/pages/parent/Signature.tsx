import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parentService } from '../../services/api';
import { PracticeRecord } from '../../types/practice-record';

const ParentSignature = () => {
  const { childId, recordId } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState<PracticeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (childId && recordId) {
      fetchRecord();
    }
  }, [childId, recordId]);

  const fetchRecord = async () => {
    if (!childId || !recordId) return;
    
    try {
      setLoading(true);
      const response = await parentService.getChildRecordById(
        parseInt(childId), 
        parseInt(recordId)
      );
      setRecord(response.data.record);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load practice record');
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!childId || !recordId) return;
    
    try {
      setSigning(true);
      const response = await parentService.signRecord(
        parseInt(childId), 
        parseInt(recordId)
      );
      setRecord(response.data.record);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign practice record');
    } finally {
      setSigning(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
        <button 
          onClick={() => navigate('/children')}
          className="btn btn-secondary mt-4"
        >
          Back to Children
        </button>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center">
        <p>No practice record found.</p>
        <button 
          onClick={() => navigate('/children')}
          className="btn btn-primary mt-4"
        >
          Back to Children
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Practice Record Signature</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Week of {formatDate(record.weekStartDate)}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Practice Minutes</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Monday:</span> {record.mondayMinutes} minutes</p>
              <p><span className="font-medium">Tuesday:</span> {record.tuesdayMinutes} minutes</p>
              <p><span className="font-medium">Wednesday:</span> {record.wednesdayMinutes} minutes</p>
              <p><span className="font-medium">Thursday:</span> {record.thursdayMinutes} minutes</p>
              <p><span className="font-medium">Friday:</span> {record.fridayMinutes} minutes</p>
              <p><span className="font-medium">Saturday:</span> {record.saturdayMinutes} minutes</p>
              <p><span className="font-medium">Sunday:</span> {record.sundayMinutes} minutes</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Summary</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Total Minutes:</span> {record.totalMinutes}</p>
              <p><span className="font-medium">Days Practiced:</span> {record.daysWithPractice} / 7</p>
              <p><span className="font-medium">Base Points:</span> {record.basePoints}</p>
              <p><span className="font-medium">Bonus Points:</span> {record.bonusPoints}</p>
              <p><span className="font-medium">Parent Signature:</span> {record.parentSignaturePoints} / 20</p>
              <p className="text-lg font-bold mt-4">Total Score: {record.totalPoints} / 105</p>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-3">Parent Signature</h3>
          
          {record.parentSignatureId ? (
            <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded">
              <p>You signed this practice record on {formatDate(record.signatureDate || '')}.</p>
            </div>
          ) : (
            <div>
              <p className="mb-4">
                By signing this practice record, you confirm that your child has practiced 
                for the minutes recorded above.
              </p>
              
              <button
                onClick={handleSign}
                disabled={signing}
                className="btn btn-primary flex items-center"
              >
                {signing ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                    Signing...
                  </>
                ) : (
                  'Sign Practice Record'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={() => navigate('/children')}
          className="btn btn-secondary"
        >
          Back to Children
        </button>
      </div>
    </div>
  );
};

export default ParentSignature;
