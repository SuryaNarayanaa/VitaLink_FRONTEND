
export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    doctorName: string;
    caretakerName: string;
    medicalHistory: string;
    medicalHistoryYears: number;
    targetINR: {
      min: number;
      max: number;
    };
    latestINR: number;
    latestINRDate: string;
    therapy: string;
    therapyStartDate: string;
    prescription: Record<string, string>;
    missedDoses: string[];
    sideEffects: string;
    lifestyleChanges: string;
    otherMedication: string;
    prolongedIllness: string;
    contact: string;
    kinName: string;
    kinContact: string;
  }
  
  export const patients: Patient[] = [
    {
      id: "1",
      name: "Sathiya A",
      age: 47,
      gender: "F",
      doctorName: "Dr. K. Tamilarasu",
      caretakerName: "Dr. P. Ramasamy",
      medicalHistory: "RHD- Post MVR/ Recurrent CVA",
      medicalHistoryYears: 27,
      targetINR: {
        min: 2.5,
        max: 3.5,
      },
      latestINR: 0,
      latestINRDate: "1900-01-01",
      therapy: "Acitrom",
      therapyStartDate: "24/01/2025",
      prescription: {
        MON: "4.0 mg",
        TUE: "4.0 mg",
        WED: "4.0 mg",
        THU: "4.0 mg",
        FRI: "4.0 mg",
        SAT: "4.0 mg",
        SUN: "4.0 mg",
      },
      missedDoses: [
        "01-02-2025",
        "01-03-2025",
        "02-02-2025",
        "02-03-2025",
        "03-02-2025",
        "03-03-2025",
        "04-02-2025",
        "04-03-2025",
        "05-02-2025",
        "05-03-2025",
      ],
      sideEffects: "None",
      lifestyleChanges: "None",
      otherMedication: "None",
      prolongedIllness: "None",
      contact: "+91 99946 92093",
      kinName: "Nandini",
      kinContact: "+91 98947 69912",
    },
    {
      id: "2",
      name: "Rajesh B",
      age: 52,
      gender: "M",
      doctorName: "Dr. K. Tamilarasu",
      caretakerName: "Dr. S. Venkatesh",
      medicalHistory: "Post CABG",
      medicalHistoryYears: 5,
      targetINR: {
        min: 2.0,
        max: 3.0,
      },
      latestINR: 2.1,
      latestINRDate: "2025-01-15",
      therapy: "Acitrom",
      therapyStartDate: "15/09/2024",
      prescription: {
        MON: "3.0 mg",
        TUE: "3.0 mg",
        WED: "3.0 mg",
        THU: "3.0 mg",
        FRI: "3.0 mg",
        SAT: "3.0 mg",
        SUN: "3.0 mg",
      },
      missedDoses: [
        "12-12-2024",
        "25-12-2024",
      ],
      sideEffects: "Occasional dizziness",
      lifestyleChanges: "Reduced alcohol intake",
      otherMedication: "Aspirin 75mg",
      prolongedIllness: "None",
      contact: "+91 98765 43210",
      kinName: "Lakshmi",
      kinContact: "+91 87654 32109",
    }
  ];
  