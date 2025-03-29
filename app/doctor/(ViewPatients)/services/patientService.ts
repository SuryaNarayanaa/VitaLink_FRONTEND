import { Patient, Person } from "../types";

// Sample data - kept the same as the original web version
const patients: Patient[] = [
  {
    id: '1',
    name: 'Sathiya A',
    age: 47,
    gender: 'F',
    doctorName: 'Dr. K. Tamilarasu',
    caretakerName: 'Dr. P. Ramasamy',
    targetINR: '2.5 - 3.5',
    latestINR: 0,
    latestINRDate: '1900-01-01',
    medicalHistory: 'RHD- Post MVR/ Recurrent CVA',
    yearsDiagnosed: 27,
    therapy: 'Acitrom',
    therapyStartDate: '24/01/2025',
    contactNumber: '+91 99946 92093',
    kinName: 'Nandini',
    kinContact: '+91 98947 69912',
    missedDoses: [
      '03-03-2025', '04-02-2025', '04-03-2025', '05-02-2025', 
      '05-03-2025', '06-02-2025', '06-03-2025', '07-02-2025', 
      '07-03-2025', '08-02-2025', '08-03-2025'
    ],
    prescription: {
      'MON': '4.0 mg',
      'TUE': '4.0 mg',
      'WED': '4.0 mg',
      'THU': '4.0 mg',
      'FRI': '4.0 mg',
      'SAT': '4.0 mg',
      'SUN': '4.0 mg',
    },
    sideEffects: 'None',
    lifestyleChanges: 'None',
    otherMedication: 'None',
    prolongedIllness: 'None'
  },
  { 
    id: '2', 
    name: 'John Doe', 
    age: 34, 
    gender: 'M', 
    doctorName: 'Dr. K. Tamilarasu', 
    caretakerName: 'Dr. S. Kumar' 
  },
  { 
    id: '3', 
    name: 'Jane Smith', 
    age: 29, 
    gender: 'F', 
    doctorName: 'Dr. K. Tamilarasu', 
    caretakerName: 'Dr. R. Nair' 
  },
  { 
    id: '4', 
    name: 'Alex Johnson', 
    age: 40, 
    gender: 'M', 
    doctorName: 'Dr. K. Tamilarasu', 
    caretakerName: 'Dr. L. Bose' 
  },
  { 
    id: '5', 
    name: 'Maria Lopez', 
    age: 55, 
    gender: 'F', 
    doctorName: 'Dr. K. Tamilarasu', 
    caretakerName: 'Dr. P. Sharma' 
  },
];

const people: Person[] = [
  { id: '1', name: 'Dr. K. Tamilarasu', role: 'Doctor' },
  { id: '2', name: 'Dr. P. Ramasamy', role: 'Caretaker' },
  { id: '3', name: 'Dr. S. Kumar', role: 'Caretaker' },
  { id: '4', name: 'Dr. R. Nair', role: 'Caretaker' },
  { id: '5', name: 'Dr. L. Bose', role: 'Caretaker' },
  { id: '6', name: 'Dr. P. Sharma', role: 'Caretaker' },
  { id: '7', name: 'Dr. S. Patel', role: 'Doctor' },
];

export const getPatients = (): Promise<Patient[]> => {
  return Promise.resolve([...patients]);
};

export const getPatient = (id: string): Promise<Patient | undefined> => {
  const patient = patients.find(p => p.id === id);
  return Promise.resolve(patient);
};

export const getPeople = (role?: 'Doctor' | 'Caretaker'): Promise<Person[]> => {
  if (role) {
    return Promise.resolve(people.filter(p => p.role === role));
  }
  return Promise.resolve([...people]);
};

export const updatePatientDoctor = (patientId: string, doctorName: string): Promise<Patient | undefined> => {
  const patientIndex = patients.findIndex(p => p.id === patientId);
  if (patientIndex >= 0) {
    patients[patientIndex] = {
      ...patients[patientIndex],
      doctorName,
    };
    return Promise.resolve(patients[patientIndex]);
  }
  return Promise.resolve(undefined);
};

export const updatePatientCaretaker = (patientId: string, caretakerName: string): Promise<Patient | undefined> => {
  const patientIndex = patients.findIndex(p => p.id === patientId);
  if (patientIndex >= 0) {
    patients[patientIndex] = {
      ...patients[patientIndex],
      caretakerName,
    };
    return Promise.resolve(patients[patientIndex]);
  }
  return Promise.resolve(undefined);
};
