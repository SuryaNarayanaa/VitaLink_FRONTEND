
export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    doctorName: string;
    caretakerName: string;
    targetINR?: string;
    latestINR?: number;
    latestINRDate?: string;
    medicalHistory?: string;
    medicalCondition?: string;
    yearsDiagnosed?: number;
    therapy?: string;
    therapyStartDate?: string;
    contactNumber?: string;
    kinName?: string;
    kinContact?: string;
    missedDoses?: string[];
    prescription?: { [key: string]: string };
    sideEffects?: string;
    lifestyleChanges?: string;
    otherMedication?: string;
    prolongedIllness?: string;
  }
  
  export interface Person {
    id: string;
    name: string;
    role: 'Doctor' | 'Caretaker';
  }
  