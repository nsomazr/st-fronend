import * as yup from 'yup';

export const personalInfoSchema = yup.object({
  full_name: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  country: yup.string().required('Country is required'),
});

export const tripDetailsSchema = yup.object({
  service_id: yup.number().required('Please select a service').positive('Please select a service'),
  destination: yup.string().required('Destination is required'),
  travel_date: yup.date().required('Travel date is required').typeError('Invalid date'),
  return_date: yup
    .date()
    .nullable()
    .typeError('Invalid date')
    .test('after-travel', 'Return date must be after travel date', function (value) {
      if (!value) return true;
      return value > this.parent.travel_date;
    }),
  num_travelers: yup.number().required('Required').min(1, 'At least 1 traveler').max(50, 'Maximum 50 travelers'),
  budget_range: yup.string().required('Please select a budget range'),
});

export const bookingDetailsSchema = personalInfoSchema.concat(tripDetailsSchema);

export const contactSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string(),
  message: yup.string().required('Message is required').min(10, 'Message must be at least 10 characters'),
});

export const loginSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});
