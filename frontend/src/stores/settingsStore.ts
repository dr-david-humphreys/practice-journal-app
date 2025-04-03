import { create } from 'zustand';
import { settingsService, SchoolSettings, UpdateSettingsRequest, SchoolLevel, ProgramType } from '../services/api';

interface SettingsState {
  settings: SchoolSettings | null;
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (data: UpdateSettingsRequest) => Promise<void>;
  uploadLogo: (file: File) => Promise<void>;
  deleteLogo: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const settings = await settingsService.getSettings();
      
      // Ensure all required fields exist with default values
      const completeSettings: SchoolSettings = {
        ...settings,
        // Set defaults for any missing fields
        schoolName: settings.schoolName || 'My School',
        schoolLevel: settings.schoolLevel || SchoolLevel.HIGH_SCHOOL,
        programType: settings.programType || ProgramType.BAND,
        customSchoolLevel: settings.customSchoolLevel || null,
        customProgramType: settings.customProgramType || null
      };
      
      set({ settings: completeSettings, isLoading: false });
    } catch (error) {
      console.error('Error fetching settings:', error);
      set({ error: 'Failed to load settings', isLoading: false });
    }
  },

  updateSettings: async (data: UpdateSettingsRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSettings = await settingsService.updateSettings(data);
      
      // Ensure all required fields exist with default values
      const completeSettings: SchoolSettings = {
        ...updatedSettings,
        // Set defaults for any missing fields
        schoolName: updatedSettings.schoolName || 'My School',
        schoolLevel: updatedSettings.schoolLevel || SchoolLevel.HIGH_SCHOOL,
        programType: updatedSettings.programType || ProgramType.BAND,
        customSchoolLevel: updatedSettings.customSchoolLevel || null,
        customProgramType: updatedSettings.customProgramType || null
      };
      
      set({ settings: completeSettings, isLoading: false });
    } catch (error) {
      console.error('Error updating settings:', error);
      set({ error: 'Failed to update settings', isLoading: false });
    }
  },

  uploadLogo: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      const logoUrl = await settingsService.uploadLogo(file);
      
      // Update local state with new logo URL
      set((state) => ({
        settings: state.settings ? { ...state.settings, logoUrl } : null,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error uploading logo:', error);
      set({ error: 'Failed to upload logo', isLoading: false });
    }
  },

  deleteLogo: async () => {
    set({ isLoading: true, error: null });
    try {
      await settingsService.deleteLogo();
      
      // Update local state to remove logo URL
      set((state) => ({
        settings: state.settings ? { ...state.settings, logoUrl: null } : null,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting logo:', error);
      set({ error: 'Failed to delete logo', isLoading: false });
    }
  }
}));
