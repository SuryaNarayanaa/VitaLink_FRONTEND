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
      .matches(/^\d+(\.\d+)?$/, 'Dosage must be a number')
      .test('within-range', 'Dosage must be within the target INR range', function (value) {
         const root = this.options.context?.values || {};
        const target_inr_min = root.target_inr_min;
        const target_inr_max = root.target_inr_max;
        if (value === undefined) return true;
        const dosage = parseFloat(value);
        const min = parseFloat(target_inr_min);
        const max = parseFloat(target_inr_max);
        return dosage >= min && dosage <= max;
      }),
    otherwise: () => Yup.string().notRequired(),
  }),
});

export const patientSchema = Yup.object({
  name: Yup.string().trim().required('Patient name is required'),
  age: Yup.string().trim().required('Patient age is required').matches(/^\d+$/, 'Age must be numeric'),
  gender: Yup.string().required('Gender selection is required'),
  target_inr_min: Yup.string().trim().required('Target INR Min value is required').matches(/^\d+(\.\d+)?$/, 'Target INR Min must be numeric'),
  target_inr_max: Yup.string().trim().required('Target INR Max value is required').matches(/^\d+(\.\d+)?$/, 'Target INR Max must be numeric'),
  // Caregiver is optional
  therapy: Yup.string().trim(),
  medical_history: Yup.array().nullable().transform((value) => (!value ? [] : value)).of(
    Yup.object({
      diagnosis: Yup.string().trim().nullable(),
      duration: Yup.string().trim().nullable()
        .transform((value) => (!value ? null : value))
        .test('duration', 'Duration must be numeric', (value) => {
          if (!value) return true;
          return /^\d+(\.\d+)?$/.test(value);
        }),
      durationUnit: Yup.string().nullable()
        .oneOf(['Days', 'Weeks', 'Months', 'Years'], 'Invalid duration unit'),
    })
  ),
  therapy_start_date: Yup.string().trim().required('Therapy start date is required').matches(/^\d{2}-\d{2}-\d{4}$/, 'Therapy start date must be in dd-mm-yyyy format'),
  dosage_schedule: Yup.object({
    mon: dosageSchema,
    tue: dosageSchema,
    wed: dosageSchema,
    thu: dosageSchema,
    fri: dosageSchema,
    sat: dosageSchema,
    sun: dosageSchema,
  }).required('At least one day must be selected for dosage schedule'),
  contact: Yup.string().trim().required('Patient contact number is required').matches(/^\d{10}$/, 'Contact must be a 10-digit number'),
  kin_name: Yup.string().trim().required('kin name is required'),
  kin_contact: Yup.string().trim().required('kin contact is required').matches(/^\d{10}$/, 'Kin contact must be a 10-digit number'),
});
