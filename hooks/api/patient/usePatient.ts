import { useState } from 'react';
import apiClient from '../apiClient';


export interface INRReport {
  inr_value: number;
  location_of_test: string;
  date: string;
  file_name: string;
  file_path: string;
  type: string;
  file?: File;
}

export interface TakeDoseFormResponse {
  patient: any;
  missed_doses: any[];
}
export interface PatientDashboardResponse {
  patient: {
    _id: string;
    name: string;
    age: number;
    gender: string;
    target_inr_min: number;
    target_inr_max: number;
    therapy: string;
    medical_history: {
      diagnosis: string;
      duration_value: number;
      duration_unit: string;
    }[];
    therapy_start_date: string;
    dosage_schedule: {
      day: string;
      dosage: number;
    }[];
    contact: string;
    kin_name: string;
    kin_contact: string;
    type: string;
    doctor: string;
    ID: string;
    inr_reports: INRReport[];
    taken_doses: string[];
    role: string;
    exp: number;
  };
  chart_data: {
    [month: string]: number;
  };
  missed_doses: string[];
}



export interface ReportFormResponse {
  patient: any;
  message: string;
  type: string;
  page: string;
}


export const usePatient = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get patient dashboard data
   */
  const getPatientDashboard = async (): Promise<PatientDashboardResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<PatientDashboardResponse>('/patient');
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch patient dashboard');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Submit INR report with file upload
   */
  const updateINR = async (inrData: INRReport): Promise<any> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('inr_value', inrData.inr_value.toString());
      formData.append('location_of_test', inrData.location_of_test);
      formData.append('date', inrData.date);
      
      if (inrData.file) {
        formData.append('file', inrData.file);
      }
      
      const response = await apiClient.post('/patient/update-inr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update INR report');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get report form by type
   */
  const getReportForm = async (reportType: string): Promise<ReportFormResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<ReportFormResponse>(`/patient/report?type=${reportType}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to get report form');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Submit patient report
   */
  const submitReport = async (reportType: string, reportField: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('typ', reportType);
      formData.append('field', reportField);
      
      await apiClient.post('/patient/report', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit report');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get take dose form with missed doses
   */
  const getDoseForm = async (): Promise<TakeDoseFormResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<TakeDoseFormResponse>('/patient/take-dose');
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to get dose form');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Submit dose taken
   */
  const takeDose = async (date: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.post(`/patient/take-dose?date=${date}`);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to record dose');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getPatientDashboard,
    updateINR,
    getReportForm,
    submitReport,
    getDoseForm,
    takeDose,
    isLoading,
    error
  };
};

export default usePatient;
