declare interface DoctorDashboardResponse {
    patients: any[];
    user: {
      _id:string;
      type:string;
      ID:string;
      fullname:string;
      PFP:string;
      occupation:string;
      role:string;
      exp:number;
    };
  }

declare interface Doctor {
    fullname: string;
    ID: string;
}

declare interface PatientDetails {
    patient: any;
    user: any;
    chart_data: any[];
    missed_doses: any[];
}

declare interface DosageSchedule {
    day: string;
    dose: number;
}

declare interface ReportResponse {
    user: any;
    reports: any[];
}

declare interface PatientFormData {
  name: string;
  age: number;
  gender: string;
  contact: string;
  therapy_start_date: string;
  dosage_schedule: DosageSchedule[];
  [key: string]: any;
}

export interface Patient {
  ID: string;
  name: string;
  age: number;
  gender: string;
  doctor: string;
  caretakerName: string;
}