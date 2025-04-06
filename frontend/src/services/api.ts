import axios from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/user';
import { PracticeRecord, UpdatePracticeMinutesRequest, SendVerificationRequest, VerifyPracticeRequest } from '../types/practice-record';

const API_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const authService = {
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

// Student services
export const studentService = {
  getCurrentWeekRecord: () => api.get<{ record: PracticeRecord }>('/student/current-week'),
  getRecordById: (id: number) => api.get<{ record: PracticeRecord }>(`/student/records/${id}`),
  getAllRecords: () => api.get<{ records: PracticeRecord[] }>('/student/records'),
  updatePracticeMinutes: (id: number, data: UpdatePracticeMinutesRequest) => 
    api.patch<{ record: PracticeRecord }>(`/student/records/${id}/practice`, data),
  getParents: () => api.get('/student/parents'),
  sendVerificationText: (data: SendVerificationRequest) => 
    api.post<{ message: string, record: PracticeRecord }>('/student/send-verification', data),
  verifyPracticeRecord: (data: VerifyPracticeRequest) => 
    api.post<{ message: string, record: PracticeRecord }>('/student/verify-practice', data),
};

// Parent services
export const parentService = {
  getChildren: () => api.get('/parent/children'),
  getChildRecords: (childId: number) => 
    api.get<{ records: PracticeRecord[] }>(`/parent/children/${childId}/records`),
  getChildRecordById: (childId: number, recordId: number) => 
    api.get<{ record: PracticeRecord }>(`/parent/children/${childId}/records/${recordId}`),
  signRecord: (childId: number, recordId: number) => 
    api.post<{ record: PracticeRecord }>(`/parent/children/${childId}/records/${recordId}/sign`),
};

// Director services
export const directorService = {
  getAllStudents: () => api.get('/director/students'),
  getWeeklyRecords: (weekStartDate: string) => 
    api.get<{ records: PracticeRecord[] }>(`/director/records/week/${weekStartDate}`),
  getStudentRecords: (studentId: number) => 
    api.get<{ records: PracticeRecord[] }>(`/director/students/${studentId}/records`),
  getStatistics: () => api.get('/director/statistics'),
};

// Settings services
export enum SchoolLevel {
  MIDDLE_SCHOOL = 'middle_school',
  JUNIOR_HIGH = 'junior_high',
  HIGH_SCHOOL = 'high_school',
  SENIOR_HIGH = 'senior_high',
  OTHER = 'other'
}

export enum ProgramType {
  BAND = 'band',
  ORCHESTRA = 'orchestra',
  CHOIR = 'choir',
  OTHER = 'other'
}

export interface SchoolSettings {
  id: number;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  weekStartDay: number;
  schoolName: string;
  schoolLevel: SchoolLevel;
  programType: ProgramType;
  customSchoolLevel: string | null;
  customProgramType: string | null;
}

export interface UpdateSettingsRequest {
  primaryColor?: string;
  secondaryColor?: string;
  weekStartDay?: number;
  schoolName?: string;
  schoolLevel?: SchoolLevel;
  programType?: ProgramType;
  customSchoolLevel?: string | null;
  customProgramType?: string | null;
}

export const settingsService = {
  getSettings: async (): Promise<SchoolSettings> => {
    try {
      const response = await api.get('/settings');
      return response.data.settings;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  updateSettings: async (data: UpdateSettingsRequest): Promise<SchoolSettings> => {
    try {
      const response = await api.put('/settings', data);
      return response.data.settings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  uploadLogo: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await api.post('/settings/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.settings.logoUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  },

  deleteLogo: async (): Promise<void> => {
    try {
      await api.delete('/settings/logo');
    } catch (error) {
      console.error('Error deleting logo:', error);
      throw error;
    }
  }
};

export default api;
