import { ReactNode, useEffect, useState } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types/user';
import { isLightColor } from '../utils/colorUtils';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { settings, fetchSettings } = useSettingsStore();
  const { userRole } = useAuthStore();
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch settings on component mount if user is a director
  useEffect(() => {
    const loadSettings = async () => {
      if (userRole === UserRole.DIRECTOR) {
        try {
          await fetchSettings();
        } catch (error) {
          console.error('Error fetching settings:', error);
        }
      }
      setIsLoaded(true);
    };

    loadSettings();
  }, [fetchSettings, userRole]);

  // Apply theme settings to CSS variables
  useEffect(() => {
    if (settings) {
      // Apply primary color
      document.documentElement.style.setProperty('--color-primary-600', settings.primaryColor);
      
      // Generate lighter and darker shades for primary color
      const primaryRgb = hexToRgb(settings.primaryColor);
      if (primaryRgb) {
        // Lighter shades
        document.documentElement.style.setProperty('--color-primary-500', lightenDarkenColor(settings.primaryColor, 20));
        document.documentElement.style.setProperty('--color-primary-400', lightenDarkenColor(settings.primaryColor, 40));
        document.documentElement.style.setProperty('--color-primary-300', lightenDarkenColor(settings.primaryColor, 60));
        document.documentElement.style.setProperty('--color-primary-200', lightenDarkenColor(settings.primaryColor, 80));
        document.documentElement.style.setProperty('--color-primary-100', lightenDarkenColor(settings.primaryColor, 100));
        document.documentElement.style.setProperty('--color-primary-50', lightenDarkenColor(settings.primaryColor, 120));
        
        // Darker shades
        document.documentElement.style.setProperty('--color-primary-700', settings.secondaryColor);
        document.documentElement.style.setProperty('--color-primary-800', lightenDarkenColor(settings.secondaryColor, -20));
        document.documentElement.style.setProperty('--color-primary-900', lightenDarkenColor(settings.secondaryColor, -40));
        document.documentElement.style.setProperty('--color-primary-950', lightenDarkenColor(settings.secondaryColor, -60));
        
        // Set text colors based on background brightness
        const primaryTextColor = isLightColor(settings.primaryColor) ? '#000000' : '#FFFFFF';
        const secondaryTextColor = isLightColor(settings.secondaryColor) ? '#000000' : '#FFFFFF';
        
        document.documentElement.style.setProperty('--primary-text-color', primaryTextColor);
        document.documentElement.style.setProperty('--secondary-text-color', secondaryTextColor);
      }
    }
  }, [settings]);

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Helper function to lighten or darken a color
  const lightenDarkenColor = (hex: string, amount: number): string => {
    let result = '#';
    
    for (let i = 1; i < 7; i += 2) {
      const colorPart = parseInt(hex.substr(i, 2), 16);
      let adjustedColor = colorPart + amount;
      
      // Clamp the value between 0 and 255
      adjustedColor = Math.max(Math.min(255, adjustedColor), 0);
      
      // Convert to hex and pad with zeros if needed
      const adjustedColorHex = adjustedColor.toString(16).padStart(2, '0');
      result += adjustedColorHex;
    }
    
    return result;
  };

  if (!isLoaded) {
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default ThemeProvider;
