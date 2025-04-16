import * as Yup from 'yup';

// Schema for the dosage schedule for a single day.
// If not enabled, you can allow an empty value.
const dosageSchema = Yup.object({
  enabled: Yup.boolean().required(),
  value: Yup.string().when('enabled', {
    is: true,
    then: () => Yup.string()
      .trim()
      .required('Dosage value is required when enabled')
      .matches(/^\d+(\.\d+)?$/, 'Dosage must be a number'),
    otherwise:() => Yup.string().notRequired(),
  }),
});

export const patientSchema = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  age: Yup.string().trim().required('Age is required').matches(/^\d+$/, 'Age must be numeric'),
  gender: Yup.string().required('Gender is required'),
  target_inr_min: Yup.string().trim().required('Target INR Min is required').matches(/^\d+(\.\d+)?$/, 'Target INR Min must be numeric'),
  target_inr_max: Yup.string().trim().required('Target INR Max is required').matches(/^\d+(\.\d+)?$/, 'Target INR Max must be numeric'),
  doctor: Yup.string().required('Doctor is required'),
  caregiver: Yup.string().required('Caregiver is required'),
  therapy: Yup.string().trim().required('Therapy is required'),
  medical_history: Yup.array().of(
    Yup.object({
      diagnosis: Yup.string().trim().required('Diagnosis is required'),
      duration: Yup.string().trim().required('Duration is required').matches(/^\d+(\.\d+)?$/, 'Duration must be numeric'),
      durationUnit: Yup.string().oneOf(['Days', 'Weeks', 'Months', 'Years'], 'Invalid duration unit').required('Duration unit is required'),
    })
  ).min(1, 'At least one medical history entry is required'),
  therapy_start_date: Yup.string().trim().required('Therapy start date is required').matches(/^\d{2}-\d{2}-\d{4}$/, 'Therapy start date must be in dd-mm-yyyy format'),
  dosage_schedule: Yup.object({
    mon: dosageSchema,
    tue: dosageSchema,
    wed: dosageSchema,
    thu: dosageSchema,
    fri: dosageSchema,
    sat: dosageSchema,
    sun: dosageSchema,
  }).required('Dosage schedule is required'),
  contact: Yup.string().trim().required('Contact is required').matches(/^\d+$/, 'Contact must contain only digits'),
  kin_name: Yup.string().trim().required('Kin name is required'),
  kin_contact: Yup.string().trim().required('Kin contact is required').matches(/^\d+$/, 'Kin contact must contain only digits'),
});
