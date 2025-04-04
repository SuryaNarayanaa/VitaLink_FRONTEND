// Export API client for direct access if needed
export { default as apiClient } from './apiClient';

// Export auth hooks
export { default as useAuth } from './auth/useAuth';
export type { LoginCredentials, LoginResponse } from './auth/useAuth';

// Export admin hooks
export { default as useAdmin } from './admin/useAdmin';
export type { AdminDashboardResponse, Item } from './admin/useAdmin';

// Export doctor hooks
export { default as useDoctor } from './doctor/useDoctor';
export type { 
  DoctorDashboardResponse,
  Doctor, 
  PatientDetails,
  DosageSchedule,
  ReportResponse,
  PatientFormData
} from './doctor/useDoctor';

// Export patient hooks
export { default as usePatient } from './patient/usePatient';

