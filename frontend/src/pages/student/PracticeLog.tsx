import { useState, useEffect } from 'react';
import { studentService } from '../../services/api';
import { PracticeRecord } from '../../types/practice-record';

const StudentPracticeLog = () => {
  const [record, setRecord] = useState<PracticeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingDay, setUpdatingDay] = useState<string | null>(null);
  const [parentPhoneNumber, setParentPhoneNumber] = useState('');
  const [sendingVerification, setSendingVerification] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentWeekRecord();
  }, []);

  const fetchCurrentWeekRecord = async () => {
    try {
      setLoading(true);
      const response = await studentService.getCurrentWeekRecord();
      setRecord(response.data.record);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load practice record');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMinutes = async (day: string, minutes: number) => {
    if (!record) return;
    
    try {
      setUpdatingDay(day);
      const response = await studentService.updatePracticeMinutes(record.id, {
        day,
        minutes
      });
      setRecord(response.data.record);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update practice minutes');
    } finally {
      setUpdatingDay(null);
    }
  };

  const handleSendVerification = async () => {
    if (!record) return;
    
    // Validate phone number
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(parentPhoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }
    
    try {
      setSendingVerification(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await studentService.sendVerificationText({
        parentPhoneNumber,
        recordId: record.id
      });
      
      setRecord(response.data.record);
      setSuccessMessage('Approval request sent successfully! Your parent will receive a text message asking them to reply Y or N.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send approval request');
    } finally {
      setSendingVerification(false);
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
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center">
        <p>No practice record found for this week.</p>
        <button 
          onClick={fetchCurrentWeekRecord}
          className="btn btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Weekly Practice Log</h1>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Week of {formatDate(record.weekStartDate)}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Practice Minutes</h3>
            <div className="space-y-4">
              {[
                { day: 'monday', label: 'Monday' },
                { day: 'tuesday', label: 'Tuesday' },
                { day: 'wednesday', label: 'Wednesday' },
                { day: 'thursday', label: 'Thursday' },
                { day: 'friday', label: 'Friday' },
                { day: 'saturday', label: 'Saturday' },
                { day: 'sunday', label: 'Sunday' }
              ].map(({ day, label }) => (
                <div key={day} className="flex items-center">
                  <label htmlFor={day} className="w-28 font-medium">{label}:</label>
                  <input
                    id={day}
                    type="number"
                    min="0"
                    value={record[`${day}Minutes` as keyof PracticeRecord] as number}
                    onChange={(e) => handleUpdateMinutes(day, parseInt(e.target.value) || 0)}
                    className="input w-20 text-center"
                    disabled={updatingDay === day}
                  />
                  <span className="ml-2">minutes</span>
                  {updatingDay === day && (
                    <span className="ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-600"></span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Summary</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Total Minutes:</span> {record.totalMinutes}</p>
              <p><span className="font-medium">Days Practiced:</span> {record.daysWithPractice} / 7</p>
              <p><span className="font-medium">Base Points:</span> {record.basePoints}</p>
              <p><span className="font-medium">Bonus Points:</span> {record.bonusPoints}</p>
              <p><span className="font-medium">Parent Approval:</span> {record.parentSignaturePoints} / 20</p>
              <p className="text-lg font-bold mt-4">Total Score: {record.totalPoints} / 105</p>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-2">Parent Approval Status</h3>
          {record.parentSignatureId ? (
            <div className="text-green-600 dark:text-green-400">
              <p>Approved on {formatDate(record.signatureDate || '')}</p>
            </div>
          ) : record.verificationCode === 'PENDING' ? (
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded mb-4">
              <p className="font-medium">Approval Request Pending</p>
              <p className="text-sm mt-1">
                We've sent a text message to your parent asking them to approve your practice record.
                They can reply with 'Y' to approve or 'N' to deny.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-yellow-600 dark:text-yellow-400 mb-4">
                Not yet approved by parent
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Request Parent Approval</h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="parentPhone" className="block text-sm font-medium mb-1">
                      Parent's Phone Number
                    </label>
                    <input
                      id="parentPhone"
                      type="tel"
                      placeholder="+1234567890"
                      value={parentPhoneNumber}
                      onChange={(e) => setParentPhoneNumber(e.target.value)}
                      className="input w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format: +[country code][number], e.g., +12025550123
                    </p>
                  </div>
                  
                  <button
                    onClick={handleSendVerification}
                    disabled={sendingVerification || !parentPhoneNumber}
                    className="btn btn-primary w-full flex justify-center items-center"
                  >
                    {sendingVerification ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                        Sending...
                      </>
                    ) : (
                      'Send Approval Request'
                    )}
                  </button>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Your parent will receive a text message with your practice details and can reply with 'Y' to approve or 'N' to deny.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Grading Scale</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Practice Minutes</h4>
            <ul className="space-y-1 text-sm">
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
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Additional Points</h4>
            <ul className="space-y-1 text-sm">
              <li>Parent approval: +20 points</li>
              <li>Practice 5+ days per week: +5 bonus points</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPracticeLog;
