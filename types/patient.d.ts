export interface Patient{
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
  dosage_schedule:DosageScheduleItem[]
  contact: string;
  kin_name: string;
  kin_contact: string;
  type: string;
  doctor: string;
  caretaker:string;
  ID: string;
  inr_reports: INRReport[];
  taken_doses: string[];
  sideeffects:string,
  lifestylechanges:string,
  othermedication:string,
  prolongedillness:string,
  role: string;
  exp: number;
  caretakerName?: string | null,
  doctorName : string
}

export interface DosageScheduleItem {
  day:string,
  dosage:number
}
export interface PatientDashboardResponse {
    patient: Patient
    chart_data: {
      [month: string]: number;
    };
    missed_doses: string[];
  }

  
  export interface INRReport {
    inr_value: number;
    location_of_test: string;
    date: string;
    file_name?: string;
    file_path?: string;
    type: string;
    file?: string;
  }

  export interface TakeDoseFormResponse {
    patient: any;
    missed_doses: any[];
  }
  
  
  
  
  export interface ReportFormResponse {
    patient: any;
    lifestyleChanges: string | null;
    otherMedication: string | null;
    sideEffects: string | null;
    prolongedIllness: string | null;
  }
  
  export interface fileProps  {
    uri: string;
    name: string;
    file: string;
    mimeType: string;
  }


  export interface PatientCreateRequest {
    name: string;
    contact: string;
    age: number;
    gender: string;
    target_inr_min: number;
    target_inr_max: number;
    therapy: string;
    medical_history: MedicalHistoryItem[];
    therapy_start_date: string;
    dosage_schedule: DosageScheduleItem[];
    kin_name: string;
    kin_contact: string;
  }