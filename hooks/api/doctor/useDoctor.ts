import { useState } from 'react';
import apiClient from '../apiClient';

export const useDoctor = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getDoctorDashboard = async (): Promise<DoctorDashboardResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<DoctorDashboardResponse>('/doctor');
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch doctor dashboard');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get list of all doctors
   */
  const getAllDoctors = async (): Promise<Doctor[] | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<Doctor[]>('/doctor/list-api');
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch doctors list');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reassign doctor or caretaker to patient
   */
  const reassignDoctor = async (patientId: string, doctorId: string, type: 'doctor' | 'caretaker'): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.post(`/doctor/reassign/${patientId}?doc=${doctorId}&typ=${type}`);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to reassign doctor');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add a new patient
   */
  const addPatient = async (patientData: PatientFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.post('/doctor/add-patient', patientData);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add patient');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * View patient details
   */
  const getPatientDetails = async (patientId: string): Promise<PatientDetails | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<PatientDetails>(`/doctor/view-patient/${patientId}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch patient details');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Edit patient dosage schedule
   */
  const editDosage = async (patientId: string, dosageSchedule: DosageSchedule[]): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.post(`/doctor/edit-dosage/${patientId}`, dosageSchedule);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update dosage');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get patient reports
   * @param type 'today' for today's reports or a patient ID for specific patient reports
   */
  const getReports = async (type: string): Promise<ReportResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<ReportResponse>(`/doctor/reports?typ=${type}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch reports');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getDoctorDashboard,
    getAllDoctors,
    reassignDoctor,
    addPatient,
    getPatientDetails,
    editDosage,
    getReports,
    isLoading,
    error
  };
};

export default useDoctor;
