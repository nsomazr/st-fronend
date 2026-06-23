import * as yup from 'yup';

const dateField = (label, required = true) =>
  required
    ? yup.string().required(`${label} is required`)
    : yup
        .string()
        .nullable()
        .transform((v) => (v === '' || v == null ? null : v));

const travelersField = yup
  .number()
  .required('Required')
  .min(1, 'At least 1 traveler')
  .max(50, 'Maximum 50 travelers');

const budgetField = yup.string().required('Please select a budget range');

const returnDateTest = yup
  .string()
  .nullable()
  .transform((v) => (v === '' || v == null ? null : v))
  .test('after-travel', 'Return date must be after travel date', function (value) {
    if (!value) return true;
    return value > this.parent.travel_date;
  });

/** Extra fields stored in special_requests (not top-level API fields). */
export const SERVICE_FORMS = {
  'travel-consultancy': {
    stepTitle: 'Consultation details',
    stepSubtitle: 'Help us understand your travel goals',
    summaryTitle: 'Consultation request',
    fields: [
      {
        name: 'trip_purpose',
        type: 'options',
        label: 'What are you planning?',
        required: true,
        options: [
          { value: 'leisure', label: 'Leisure holiday' },
          { value: 'family', label: 'Family trip' },
          { value: 'honeymoon', label: 'Honeymoon' },
          { value: 'business', label: 'Business travel' },
          { value: 'group', label: 'Group tour' },
          { value: 'undecided', label: 'Not sure yet' },
        ],
      },
      {
        name: 'destination',
        type: 'destination',
        label: 'Where would you like to go?',
        required: true,
      },
      {
        name: 'travel_date',
        type: 'date',
        label: 'Preferred travel date',
        required: true,
        minToday: true,
      },
      {
        name: 'return_date',
        type: 'date',
        label: 'Return date (if known)',
        required: false,
      },
      {
        name: 'num_travelers',
        type: 'travelers',
        label: 'Number of travelers',
        required: true,
      },
      {
        name: 'budget_range',
        type: 'budget',
        label: 'Estimated budget',
        required: true,
      },
      {
        name: 'consultation_notes',
        type: 'textarea',
        label: 'Questions or preferences',
        placeholder: 'Destinations you are considering, travel style, must-haves…',
        required: false,
        extra: true,
      },
    ],
    schema: yup.object({
      trip_purpose: yup.string().required('Please select a trip purpose'),
      destination: yup.string().required('Destination is required'),
      travel_date: dateField('Travel date'),
      return_date: returnDateTest,
      num_travelers: travelersField,
      budget_range: budgetField,
      consultation_notes: yup.string(),
    }),
  },

  'air-ticketing': {
    stepTitle: 'Flight details',
    stepSubtitle: 'Tell us about your route and preferences',
    summaryTitle: 'Flight request',
    fields: [
      {
        name: 'departure_city',
        type: 'text',
        label: 'Flying from',
        placeholder: 'e.g. Dar es Salaam',
        required: true,
        extra: true,
      },
      {
        name: 'destination',
        type: 'destination',
        label: 'Flying to',
        required: true,
      },
      {
        name: 'trip_type',
        type: 'options',
        label: 'Trip type',
        required: true,
        options: [
          { value: 'round_trip', label: 'Round trip' },
          { value: 'one_way', label: 'One way' },
          { value: 'multi_city', label: 'Multi-city' },
        ],
      },
      {
        name: 'travel_date',
        type: 'date',
        label: 'Departure date',
        required: true,
        minToday: true,
      },
      {
        name: 'return_date',
        type: 'date',
        label: 'Return date',
        required: false,
        showWhen: (v) => v.trip_type === 'round_trip',
      },
      {
        name: 'flight_class',
        type: 'options',
        label: 'Cabin class',
        required: true,
        options: [
          { value: 'economy', label: 'Economy' },
          { value: 'premium_economy', label: 'Premium economy' },
          { value: 'business', label: 'Business' },
          { value: 'first', label: 'First class' },
        ],
      },
      {
        name: 'num_travelers',
        type: 'travelers',
        label: 'Passengers',
        required: true,
      },
      {
        name: 'budget_range',
        type: 'budget',
        label: 'Budget per person',
        required: true,
      },
      {
        name: 'flexible_dates',
        type: 'options',
        label: 'Date flexibility',
        required: false,
        extra: true,
        options: [
          { value: 'fixed', label: 'Fixed dates' },
          { value: 'flexible_1_3', label: '±1–3 days' },
          { value: 'flexible_week', label: '±1 week' },
        ],
      },
    ],
    schema: yup.object({
      departure_city: yup.string().required('Departure city is required'),
      destination: yup.string().required('Destination is required'),
      trip_type: yup.string().required('Please select trip type'),
      travel_date: dateField('Departure date'),
      return_date: returnDateTest.when('trip_type', {
        is: 'round_trip',
        then: (s) => s.required('Return date is required for round trips'),
        otherwise: (s) => s.nullable(),
      }),
      flight_class: yup.string().required('Please select cabin class'),
      num_travelers: travelersField,
      budget_range: budgetField,
      flexible_dates: yup.string(),
    }),
  },

  'visa-documentation-assistance': {
    stepTitle: 'Visa application details',
    stepSubtitle: 'We will guide you through the documentation',
    summaryTitle: 'Visa assistance request',
    fields: [
      {
        name: 'destination',
        type: 'destination',
        label: 'Country you are applying for',
        required: true,
      },
      {
        name: 'visa_type',
        type: 'options',
        label: 'Visa type',
        required: true,
        options: [
          { value: 'tourist', label: 'Tourist' },
          { value: 'business', label: 'Business' },
          { value: 'student', label: 'Student' },
          { value: 'transit', label: 'Transit' },
          { value: 'work', label: 'Work' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        name: 'passport_country',
        type: 'country',
        label: 'Passport nationality',
        required: true,
        extra: true,
      },
      {
        name: 'travel_date',
        type: 'date',
        label: 'Intended travel date',
        required: true,
        minToday: true,
      },
      {
        name: 'urgency',
        type: 'options',
        label: 'Processing urgency',
        required: true,
        extra: true,
        options: [
          { value: 'standard', label: 'Standard' },
          { value: 'express', label: 'Express / urgent' },
        ],
      },
      {
        name: 'num_travelers',
        type: 'travelers',
        label: 'Applicants',
        required: true,
      },
      {
        name: 'budget_range',
        type: 'budget',
        label: 'Service budget',
        required: true,
      },
      {
        name: 'visa_notes',
        type: 'textarea',
        label: 'Previous visa history or notes',
        placeholder: 'Prior refusals, dependents, special circumstances…',
        required: false,
        extra: true,
      },
    ],
    schema: yup.object({
      destination: yup.string().required('Destination country is required'),
      visa_type: yup.string().required('Please select visa type'),
      passport_country: yup.string().required('Passport nationality is required'),
      travel_date: dateField('Travel date'),
      urgency: yup.string().required('Please select urgency'),
      num_travelers: travelersField,
      budget_range: budgetField,
      visa_notes: yup.string(),
    }),
  },

  'holiday-planning': {
    stepTitle: 'Holiday package details',
    stepSubtitle: 'Design your dream getaway with us',
    summaryTitle: 'Holiday package request',
    fields: [
      {
        name: 'destination',
        type: 'destination',
        label: 'Holiday destination',
        required: true,
      },
      {
        name: 'travel_date',
        type: 'date',
        label: 'Departure date',
        required: true,
        minToday: true,
      },
      {
        name: 'return_date',
        type: 'date',
        label: 'Return date',
        required: true,
      },
      {
        name: 'num_travelers',
        type: 'travelers',
        label: 'Travelers',
        required: true,
      },
      {
        name: 'accommodation',
        type: 'options',
        label: 'Accommodation preference',
        required: true,
        extra: true,
        options: [
          { value: 'hotel', label: 'Hotel' },
          { value: 'resort', label: 'Resort' },
          { value: 'apartment', label: 'Apartment' },
          { value: 'villa', label: 'Villa' },
          { value: 'any', label: 'Open to suggestions' },
        ],
      },
      {
        name: 'trip_style',
        type: 'options',
        label: 'Trip style',
        required: true,
        extra: true,
        options: [
          { value: 'relaxed', label: 'Relaxed' },
          { value: 'adventure', label: 'Adventure' },
          { value: 'family', label: 'Family-friendly' },
          { value: 'romantic', label: 'Romantic' },
          { value: 'luxury', label: 'Luxury' },
        ],
      },
      {
        name: 'budget_range',
        type: 'budget',
        label: 'Total package budget',
        required: true,
      },
      {
        name: 'holiday_notes',
        type: 'textarea',
        label: 'Activities & special requests',
        placeholder: 'Safari, beach days, celebrations, dietary needs…',
        required: false,
        extra: true,
      },
    ],
    schema: yup.object({
      destination: yup.string().required('Destination is required'),
      travel_date: dateField('Departure date'),
      return_date: dateField('Return date').concat(returnDateTest),
      num_travelers: travelersField,
      accommodation: yup.string().required('Please select accommodation'),
      trip_style: yup.string().required('Please select trip style'),
      budget_range: budgetField,
      holiday_notes: yup.string(),
    }),
  },
};

export function getServiceFormConfig(slug) {
  return SERVICE_FORMS[slug] || SERVICE_FORMS['travel-consultancy'];
}

export function getOptionLabel(field, value) {
  if (!value || !field.options) return value;
  return field.options.find((o) => o.value === value)?.label || value;
}

const API_FIELD_NAMES = new Set([
  'destination',
  'travel_date',
  'return_date',
  'num_travelers',
  'budget_range',
]);

export function buildSpecialRequests(slug, data) {
  const config = getServiceFormConfig(slug);
  const lines = [];

  for (const field of config.fields) {
    if (API_FIELD_NAMES.has(field.name)) continue;
    const value = data[field.name];
    if (!value) continue;
    const display = field.options ? getOptionLabel(field, value) : value;
    lines.push(`${field.label}: ${display}`);
  }

  return lines.join('\n');
}

export function getSummaryRows(slug, data) {
  const config = getServiceFormConfig(slug);
  const rows = [];

  for (const field of config.fields) {
    const value = data[field.name];
    if (!value) continue;
    if (field.type === 'date') {
      rows.push({ label: field.label, value });
      continue;
    }
    if (field.options) {
      rows.push({ label: field.label, value: getOptionLabel(field, value) });
      continue;
    }
    rows.push({ label: field.label, value: String(value) });
  }

  return rows;
}
