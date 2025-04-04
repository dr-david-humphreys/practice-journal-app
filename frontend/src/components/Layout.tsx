import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { UserRole } from '../types/user';
import { SchoolLevel, ProgramType } from '../services/api';
import { getTextColorForBackground } from '../utils/colorUtils';

const Layout = () => {
  const { user, userRole, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const navigate = useNavigate();

  // Determine text color based on primary color brightness
  const headerTextColor = settings?.primaryColor 
    ? getTextColorForBackground(settings.primaryColor)
    : '#FFFFFF'; // Default to white text
    
  // Determine text color based on secondary color brightness
  const navTextColor = settings?.secondaryColor
    ? getTextColorForBackground(settings.secondaryColor)
    : '#FFFFFF'; // Default to white text

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper function to format school level for display
  const formatSchoolLevel = (level: SchoolLevel | undefined, customLevel: string | null): string => {
    if (!level) return 'High School';
    
    switch (level) {
      case SchoolLevel.MIDDLE_SCHOOL:
        return 'Middle School';
      case SchoolLevel.JUNIOR_HIGH:
        return 'Junior High School';
      case SchoolLevel.HIGH_SCHOOL:
        return 'High School';
      case SchoolLevel.SENIOR_HIGH:
        return 'Senior High School';
      case SchoolLevel.OTHER:
        return customLevel || 'School';
      default:
        return 'School';
    }
  };

  // Helper function to format program type for display
  const formatProgramType = (type: ProgramType | undefined, customType: string | null): string => {
    if (!type) return 'Band';
    
    switch (type) {
      case ProgramType.BAND:
        return 'Band';
      case ProgramType.ORCHESTRA:
        return 'Orchestra';
      case ProgramType.CHOIR:
        return 'Choir';
      case ProgramType.OTHER:
        return customType || 'Music';
      default:
        return 'Music';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header 
        className="shadow-md" 
        style={{ 
          backgroundColor: settings?.primaryColor || undefined,
          color: headerTextColor
        }}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            {settings?.logoUrl && (
              <img 
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${settings.logoUrl}`}
                alt="School logo"
                className="h-8 mr-3"
              />
            )}
            <div className="flex flex-col sm:flex-row sm:items-baseline">
              <h1 className="text-xl font-bold">
                {settings?.schoolName || 'My School'}{' '}
                <span className="text-lg font-medium">
                  {formatSchoolLevel(settings?.schoolLevel, settings?.customSchoolLevel || null)}{' '}
                  {formatProgramType(settings?.programType, settings?.customProgramType || null)}{' '}
                </span>
                <span className="text-lg">Practice Journal</span>
              </h1>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <span className="hidden md:inline">
                Welcome, {user.firstName} {user.lastName}
              </span>
              
              <button 
                onClick={handleLogout}
                className="px-3 py-1 rounded-md hover:bg-opacity-80 transition-colors"
                style={{ 
                  backgroundColor: settings?.secondaryColor || '#0369a1',
                  color: navTextColor
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
        
        {user && (
          <nav 
            className="shadow-inner" 
            style={{ 
              backgroundColor: settings?.secondaryColor || '#0369a1',
              color: navTextColor
            }}
          >
            <div className="container mx-auto px-4">
              <ul className="flex overflow-x-auto">
                {userRole === UserRole.STUDENT && (
                  <>
                    <li>
                      <Link 
                        to="/practice" 
                        className="block px-4 py-2 hover:bg-opacity-80 transition-colors"
                        style={{ color: navTextColor }}
                      >
                        Practice Log
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/history" 
                        className="block px-4 py-2 hover:bg-opacity-80 transition-colors"
                        style={{ color: navTextColor }}
                      >
                        History
                      </Link>
                    </li>
                  </>
                )}
                
                {userRole === UserRole.PARENT && (
                  <li>
                    <Link 
                      to="/children" 
                      className="block px-4 py-2 hover:bg-opacity-80 transition-colors"
                      style={{ color: navTextColor }}
                    >
                      My Children
                    </Link>
                  </li>
                )}
                
                {userRole === UserRole.DIRECTOR && (
                  <>
                    <li>
                      <Link 
                        to="/students" 
                        className="block px-4 py-2 hover:bg-opacity-80 transition-colors"
                        style={{ color: navTextColor }}
                      >
                        Students
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/weekly-reports" 
                        className="block px-4 py-2 hover:bg-opacity-80 transition-colors"
                        style={{ color: navTextColor }}
                      >
                        Weekly Reports
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/statistics" 
                        className="block px-4 py-2 hover:bg-opacity-80 transition-colors"
                        style={{ color: navTextColor }}
                      >
                        Statistics
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 hover:bg-opacity-80 transition-colors"
                        style={{ color: navTextColor }}
                      >
                        Settings
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </nav>
        )}
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      <footer 
        className="py-4"
        style={{ 
          backgroundColor: settings?.primaryColor || '#0284c7',
          color: headerTextColor
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Practice Journal App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
