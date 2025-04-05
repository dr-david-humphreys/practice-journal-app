import { User } from './user';

export interface PracticeRecord {
  id: number;
  studentId: number;
  weekStartDate: string;
  mondayMinutes: number;
  tuesdayMinutes: number;
  wednesdayMinutes: number;
  thursdayMinutes: number;
  fridayMinutes: number;
  saturdayMinutes: number;
  sundayMinutes: number;
  totalMinutes: number;
  daysWithPractice: number;
  parentSignatureId: number | null;
  signatureDate: string | null;
  basePoints: number;
  bonusPoints: number;
  parentSignaturePoints: number;
  totalPoints: number;
  student?: User;
  parent?: User;
  verificationCode?: string;
  verificationExpiry?: string;
}

export interface UpdatePracticeMinutesRequest {
  day: string;
  minutes: number;
}

export interface PracticeRecordWithStudent extends PracticeRecord {
  student: User;
}

export interface WeeklyStatistics {
  weekStartDate: string;
  averageMinutes: number;
  averagePoints: number;
  signatureRate: number;
  studentCount: number;
}

export interface StudentStatistics {
  studentId: number;
  firstName: string;
  lastName: string;
  totalMinutes: number;
  averageMinutesPerWeek: number;
  averagePointsPerWeek: number;
  weekCount: number;
  signatureRate: number;
}

export interface SendVerificationRequest {
  parentPhoneNumber: string;
  recordId: number;
}

export interface VerifyPracticeRequest {
  parentResponse: string;
  recordId: number;
}
