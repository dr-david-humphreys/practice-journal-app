import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { SchoolLevel, ProgramType } from '../../services/api';
import { getTextColorForBackground } from '../../utils/colorUtils';

const weekDays = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

const schoolLevels = [
  { value: SchoolLevel.MIDDLE_SCHOOL, label: 'Middle School' },
  { value: SchoolLevel.JUNIOR_HIGH, label: 'Junior High School' },
  { value: SchoolLevel.HIGH_SCHOOL, label: 'High School' },
  { value: SchoolLevel.SENIOR_HIGH, label: 'Senior High School' },
  { value: SchoolLevel.OTHER, label: 'Other' }
];

const programTypes = [
  { value: ProgramType.BAND, label: 'Band' },
  { value: ProgramType.ORCHESTRA, label: 'Orchestra' },
  { value: ProgramType.CHOIR, label: 'Choir' },
  { value: ProgramType.OTHER, label: 'Other' }
];

const DirectorSettings = () => {
  const { settings, isLoading, error, fetchSettings, updateSettings, uploadLogo, deleteLogo } = useSettingsStore();
  
  const [primaryColor, setPrimaryColor] = useState('#0284c7');
  const [secondaryColor, setSecondaryColor] = useState('#0369a1');
  const [weekStartDay, setWeekStartDay] = useState(0);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New state variables for school customization
  const [schoolName, setSchoolName] = useState('My School');
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>(SchoolLevel.HIGH_SCHOOL);
  const [programType, setProgramType] = useState<ProgramType>(ProgramType.BAND);
  const [customSchoolLevel, setCustomSchoolLevel] = useState<string>('');
  const [customProgramType, setCustomProgramType] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings().catch(console.error);
  }, [fetchSettings]);

  // Update local state when settings are loaded
  useEffect(() => {
    if (settings) {
      setPrimaryColor(settings.primaryColor);
      setSecondaryColor(settings.secondaryColor);
      setWeekStartDay(settings.weekStartDay);
      setPreviewUrl(settings.logoUrl);
      setSchoolName(settings.schoolName);
      setSchoolLevel(settings.schoolLevel);
      setProgramType(settings.programType);
      setCustomSchoolLevel(settings.customSchoolLevel || '');
      setCustomProgramType(settings.customProgramType || '');
    }
  }, [settings]);

  // Handle color change
  const handleColorChange = (e: ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(e.target.value);
  };

  // Handle week start day change
  const handleWeekStartDayChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setWeekStartDay(Number(e.target.value));
  };

  // Handle school level change
  const handleSchoolLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSchoolLevel(e.target.value as SchoolLevel);
  };

  // Handle program type change
  const handleProgramTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setProgramType(e.target.value as ProgramType);
  };

  // Handle logo file selection
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo removal
  const handleRemoveLogo = async () => {
    try {
      setIsSubmitting(true);
      await deleteLogo();
      setLogoFile(null);
      setPreviewUrl(null);
      setSuccessMessage('Logo removed successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error removing logo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Update settings
      await updateSettings({
        primaryColor,
        secondaryColor,
        weekStartDay,
        schoolName,
        schoolLevel,
        programType,
        customSchoolLevel: schoolLevel === SchoolLevel.OTHER ? customSchoolLevel : null,
        customProgramType: programType === ProgramType.OTHER ? customProgramType : null
      });
      
      // Upload logo if selected
      if (logoFile) {
        await uploadLogo(logoFile);
      }
      
      setSuccessMessage('Settings updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading && !settings) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">School Settings</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* School Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">School Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    School Name
                  </label>
                  <input
                    type="text"
                    id="schoolName"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="input w-full"
                    placeholder="Enter your school name"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="schoolLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      School Level
                    </label>
                    <select
                      id="schoolLevel"
                      value={schoolLevel}
                      onChange={handleSchoolLevelChange}
                      className="input w-full"
                    >
                      {schoolLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="programType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Program Type
                    </label>
                    <select
                      id="programType"
                      value={programType}
                      onChange={handleProgramTypeChange}
                      className="input w-full"
                    >
                      {programTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {schoolLevel === SchoolLevel.OTHER && (
                  <div>
                    <label htmlFor="customSchoolLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Custom School Level
                    </label>
                    <input
                      type="text"
                      id="customSchoolLevel"
                      value={customSchoolLevel}
                      onChange={(e) => setCustomSchoolLevel(e.target.value)}
                      className="input w-full"
                      placeholder="Enter custom school level"
                    />
                  </div>
                )}
                
                {programType === ProgramType.OTHER && (
                  <div>
                    <label htmlFor="customProgramType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Custom Program Type
                    </label>
                    <input
                      type="text"
                      id="customProgramType"
                      value={customProgramType}
                      onChange={(e) => setCustomProgramType(e.target.value)}
                      className="input w-full"
                      placeholder="Enter custom program type"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* School Colors */}
            <div>
              <h2 className="text-lg font-semibold mb-4">School Colors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="color"
                      id="primaryColor"
                      value={primaryColor}
                      onChange={(e) => handleColorChange(e, setPrimaryColor)}
                      className="h-10 w-10 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="input flex-grow"
                      pattern="^#([A-Fa-f0-9]{6})$"
                      title="Hex color code (e.g. #0284c7)"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Used for primary buttons and header
                  </p>
                </div>
                
                <div>
                  <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="color"
                      id="secondaryColor"
                      value={secondaryColor}
                      onChange={(e) => handleColorChange(e, setSecondaryColor)}
                      className="h-10 w-10 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="input flex-grow"
                      pattern="^#([A-Fa-f0-9]{6})$"
                      title="Hex color code (e.g. #0369a1)"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Used for navigation and accents
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-4 rounded-md" style={{ 
                backgroundColor: primaryColor,
                color: getTextColorForBackground(primaryColor)
              }}>
                <div className="p-3 rounded-md" style={{ 
                  backgroundColor: secondaryColor, 
                  color: getTextColorForBackground(secondaryColor) 
                }}>
                  <p className="font-medium">Color Preview</p>
                </div>
              </div>
            </div>
            
            {/* School Logo */}
            <div>
              <h2 className="text-lg font-semibold mb-4">School Logo</h2>
              <div className="flex flex-col items-center space-y-4">
                {previewUrl ? (
                  <div className="relative">
                    <img 
                      src={previewUrl.startsWith('data:') ? previewUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${previewUrl}`} 
                      alt="School logo" 
                      className="h-32 object-contain rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      disabled={isSubmitting}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No logo uploaded</p>
                  </div>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  accept="image/*"
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-secondary"
                >
                  {previewUrl ? 'Change Logo' : 'Upload Logo'}
                </button>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Recommended size: 200x200 pixels. Max file size: 5MB.
                </p>
              </div>
            </div>
            
            {/* Week Start Day */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Week Configuration</h2>
              <div>
                <label htmlFor="weekStartDay" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Week Start Day
                </label>
                <select
                  id="weekStartDay"
                  value={weekStartDay}
                  onChange={handleWeekStartDayChange}
                  className="input w-full"
                >
                  {weekDays.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This determines when the practice week starts and ends for grading purposes.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary flex items-center"
              >
                {isSubmitting && (
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                )}
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DirectorSettings;
