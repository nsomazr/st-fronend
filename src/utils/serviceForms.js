import * as yup from 'yup';
import { BUDGET_RANGES } from './formatters';

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

const SERVICE_SLUG_ALIASES = {
  'holiday-planning': 'travel-consultancy',
  'maasai-experience-tour': 'safari-and-tours',
};

const API_FIELD_NAMES = new Set([
  'destination',
  'travel_date',
  'return_date',
  'num_travelers',
  'budget_range',
]);

export const SERVICE_FORMS = {
  'travel-consultancy': {
    stepTitle: 'Travel & holiday planning',
    stepSubtitle: 'Share your trip idea — we\'ll handle the rest',
    summaryTitle: 'Travel & holiday planning',
    sections: [
      {
        title: 'Your trip',
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
              { value: 'consultation', label: 'Consultation only' },
              { value: 'undecided', label: 'Not sure yet' },
            ],
          },
          {
            name: 'destination',
            type: 'destination',
            label: 'Destination country',
            required: true,
          },
        ],
      },
      {
        title: 'Dates & travelers',
        fields: [
          { name: 'travel_date', type: 'date', label: 'Departure date', required: true, minToday: true, group: 'dates' },
          { name: 'return_date', type: 'date', label: 'Return date', required: false, group: 'dates' },
          { name: 'num_travelers', type: 'travelers', label: 'Travelers', required: true },
        ],
      },
      {
        title: 'Preferences',
        showWhen: (v) => v.trip_purpose && v.trip_purpose !== 'consultation',
        fields: [
          {
            name: 'accommodation',
            type: 'options',
            label: 'Accommodation',
            required: false,
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
            required: false,
            options: [
              { value: 'relaxed', label: 'Relaxed' },
              { value: 'adventure', label: 'Adventure' },
              { value: 'family', label: 'Family-friendly' },
              { value: 'romantic', label: 'Romantic' },
              { value: 'luxury', label: 'Luxury' },
            ],
          },
        ],
      },
      {
        title: 'Budget & notes',
        fields: [
          { name: 'budget_range', type: 'budget', label: 'Estimated budget', required: true },
          {
            name: 'consultation_notes',
            type: 'textarea',
            label: 'Anything else we should know?',
            placeholder: 'Safari, beach, celebrations, dietary needs…',
            required: false,
          },
        ],
      },
    ],
    schema: yup.object({
      trip_purpose: yup.string().required('Please select a trip purpose'),
      destination: yup.string().required('Country is required'),
      travel_date: dateField('Departure date'),
      return_date: returnDateTest,
      num_travelers: travelersField,
      accommodation: yup.string(),
      trip_style: yup.string(),
      budget_range: budgetField,
      consultation_notes: yup.string(),
    }),
  },

  'air-ticketing': {
    stepTitle: 'Flight booking',
    stepSubtitle: 'Your route, dates, and cabin preference',
    summaryTitle: 'Flight request',
    sections: [
      {
        title: 'Route',
        fields: [
          { name: 'departure_country', type: 'country', label: 'From (country)', required: true, group: 'route' },
          { name: 'destination', type: 'destination', label: 'To (country)', required: true, group: 'route' },
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
        ],
      },
      {
        title: 'Dates',
        fields: [
          { name: 'travel_date', type: 'date', label: 'Departure date', required: true, minToday: true, group: 'dates' },
          {
            name: 'return_date',
            type: 'date',
            label: 'Return date',
            required: false,
            group: 'dates',
            showWhen: (v) => v.trip_type === 'round_trip',
          },
        ],
      },
      {
        title: 'Passengers & cabin',
        fields: [
          { name: 'num_travelers', type: 'travelers', label: 'Passengers', required: true },
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
        ],
      },
      {
        title: 'Budget',
        fields: [
          { name: 'budget_range', type: 'budget', label: 'Budget per person', required: true },
          {
            name: 'flexible_dates',
            type: 'options',
            label: 'Date flexibility',
            required: false,
            options: [
              { value: 'fixed', label: 'Fixed dates' },
              { value: 'flexible_1_3', label: '±1–3 days' },
              { value: 'flexible_week', label: '±1 week' },
            ],
          },
        ],
      },
    ],
    schema: yup.object({
      departure_country: yup.string().required('Departure country is required'),
      destination: yup.string().required('Destination country is required'),
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
    stepTitle: 'Visa assistance',
    stepSubtitle: 'Tell us about your visa application',
    summaryTitle: 'Visa assistance request',
    sections: [
      {
        title: 'Application',
        fields: [
          { name: 'destination', type: 'destination', label: 'Country applying for', required: true },
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
          { name: 'passport_country', type: 'country', label: 'Passport nationality', required: true },
        ],
      },
      {
        title: 'Travel & applicants',
        fields: [
          { name: 'travel_date', type: 'date', label: 'Intended travel date', required: true, minToday: true },
          { name: 'num_travelers', type: 'travelers', label: 'Applicants', required: true },
          {
            name: 'urgency',
            type: 'options',
            label: 'How urgent?',
            required: true,
            options: [
              { value: 'standard', label: 'Standard' },
              { value: 'express', label: 'Express / urgent' },
            ],
          },
        ],
      },
      {
        title: 'Notes',
        fields: [
          {
            name: 'visa_notes',
            type: 'textarea',
            label: 'Additional information',
            placeholder: 'Prior refusals, dependents, Schengen requirements…',
            required: false,
          },
        ],
      },
    ],
    schema: yup.object({
      destination: yup.string().required('Country is required'),
      visa_type: yup.string().required('Please select visa type'),
      passport_country: yup.string().required('Passport nationality is required'),
      travel_date: dateField('Travel date'),
      num_travelers: travelersField,
      urgency: yup.string().required('Please select urgency'),
      visa_notes: yup.string(),
    }),
  },

  'hotel-reservations': {
    stepTitle: 'Hotel reservation',
    stepSubtitle: 'Where and when you need a room',
    summaryTitle: 'Hotel reservation request',
    sections: [
      {
        title: 'Stay details',
        fields: [
          { name: 'destination', type: 'destination', label: 'Country', required: true },
          { name: 'travel_date', type: 'date', label: 'Check-in', required: true, minToday: true, group: 'dates' },
          { name: 'return_date', type: 'date', label: 'Check-out', required: true, group: 'dates' },
          { name: 'num_travelers', type: 'travelers', label: 'Guests', required: true },
          {
            name: 'room_type',
            type: 'options',
            label: 'Room type',
            required: true,
            options: [
              { value: 'single', label: 'Single' },
              { value: 'double', label: 'Double' },
              { value: 'twin', label: 'Twin' },
              { value: 'suite', label: 'Suite' },
              { value: 'family', label: 'Family room' },
            ],
          },
        ],
      },
      {
        title: 'Budget & preferences',
        fields: [
          { name: 'budget_range', type: 'budget', label: 'Nightly budget', required: true },
          {
            name: 'hotel_notes',
            type: 'textarea',
            label: 'Hotel preferences',
            placeholder: 'Preferred area, breakfast, sea view…',
            required: false,
          },
        ],
      },
    ],
    schema: yup.object({
      destination: yup.string().required('Country is required'),
      travel_date: dateField('Check-in date'),
      return_date: dateField('Check-out date').concat(returnDateTest),
      num_travelers: travelersField,
      room_type: yup.string().required('Please select room type'),
      budget_range: budgetField,
      hotel_notes: yup.string(),
    }),
  },

  'corporate-travels': {
    stepTitle: 'Corporate travel',
    stepSubtitle: 'Business travel for your team',
    summaryTitle: 'Corporate travel request',
    sections: [
      {
        title: 'Company',
        fields: [
          {
            name: 'company_name',
            type: 'text',
            label: 'Company / organization',
            placeholder: 'Your company name',
            required: true,
          },
          {
            name: 'corporate_need',
            type: 'options',
            label: 'What do you need?',
            required: true,
            options: [
              { value: 'flights', label: 'Flights' },
              { value: 'hotels', label: 'Hotels' },
              { value: 'transfers', label: 'Transfers' },
              { value: 'full_package', label: 'Full package' },
            ],
          },
        ],
      },
      {
        title: 'Trip details',
        fields: [
          { name: 'destination', type: 'destination', label: 'Destination country', required: true },
          { name: 'travel_date', type: 'date', label: 'Departure date', required: true, minToday: true, group: 'dates' },
          { name: 'return_date', type: 'date', label: 'Return date', required: false, group: 'dates' },
          { name: 'num_travelers', type: 'travelers', label: 'Travelers', required: true },
        ],
      },
      {
        title: 'Notes',
        fields: [
          {
            name: 'corporate_notes',
            type: 'textarea',
            label: 'Purpose & requirements',
            placeholder: 'Conference, meetings, VIP handling…',
            required: false,
          },
        ],
      },
    ],
    schema: yup.object({
      company_name: yup.string().required('Company name is required'),
      corporate_need: yup.string().required('Please select what you need'),
      destination: yup.string().required('Country is required'),
      travel_date: dateField('Departure date'),
      return_date: returnDateTest,
      num_travelers: travelersField,
      corporate_notes: yup.string(),
    }),
  },

  'airport-pickups-drop-off': {
    stepTitle: 'Airport transfer',
    stepSubtitle: 'Pickup or drop-off details',
    summaryTitle: 'Airport transfer request',
    sections: [
      {
        title: 'Route',
        fields: [
          {
            name: 'pickup_location',
            type: 'text',
            label: 'Pickup from',
            placeholder: 'e.g. Julius Nyerere Airport',
            required: true,
          },
          {
            name: 'destination',
            type: 'text',
            label: 'Drop-off at',
            placeholder: 'e.g. Hotel name or address',
            required: true,
          },
        ],
      },
      {
        title: 'When',
        fields: [
          { name: 'travel_date', type: 'date', label: 'Date', required: true, minToday: true, group: 'when' },
          {
            name: 'pickup_time',
            type: 'text',
            label: 'Time / flight arrival',
            placeholder: 'e.g. 14:30 or KQ483',
            required: true,
            group: 'when',
          },
        ],
      },
      {
        title: 'Vehicle',
        fields: [
          { name: 'num_travelers', type: 'travelers', label: 'Passengers', required: true },
          {
            name: 'vehicle_type',
            type: 'options',
            label: 'Vehicle type',
            required: true,
            options: [
              { value: 'sedan', label: 'Sedan' },
              { value: 'suv', label: 'SUV' },
              { value: 'van', label: 'Van' },
              { value: 'luxury', label: 'Luxury' },
            ],
          },
        ],
      },
      {
        title: 'Notes',
        fields: [
          {
            name: 'transfer_notes',
            type: 'textarea',
            label: 'Special requests',
            placeholder: 'Luggage, child seat, meet-and-greet…',
            required: false,
          },
        ],
      },
    ],
    schema: yup.object({
      pickup_location: yup.string().required('Pickup location is required'),
      destination: yup.string().required('Drop-off location is required'),
      travel_date: dateField('Transfer date'),
      pickup_time: yup.string().required('Pickup time is required'),
      num_travelers: travelersField,
      vehicle_type: yup.string().required('Please select vehicle type'),
      transfer_notes: yup.string(),
    }),
  },

  'safari-and-tours': {
    stepTitle: 'Safari & tours',
    stepSubtitle: 'Wildlife safaris and Maasai cultural experiences',
    summaryTitle: 'Safari & tour request',
    sections: [
      {
        title: 'Tour',
        fields: [
          {
            name: 'tour_type',
            type: 'options',
            label: 'Experience type',
            required: true,
            options: [
              { value: 'game_drive', label: 'Game drive safari' },
              { value: 'walking', label: 'Walking safari' },
              { value: 'balloon', label: 'Balloon safari' },
              { value: 'combo', label: 'Multi-park combo' },
              { value: 'maasai_village', label: 'Maasai village visit' },
              { value: 'cultural_day', label: 'Cultural day tour' },
              { value: 'maasai_overnight', label: 'Maasai overnight' },
              { value: 'ceremony', label: 'Ceremony & dance' },
            ],
          },
          { name: 'destination', type: 'destination', label: 'Country', required: true },
        ],
      },
      {
        title: 'Dates & group',
        fields: [
          { name: 'travel_date', type: 'date', label: 'Start date', required: true, minToday: true, group: 'dates' },
          { name: 'return_date', type: 'date', label: 'End date (if multi-day)', required: false, group: 'dates' },
          { name: 'num_travelers', type: 'travelers', label: 'Travelers', required: true },
        ],
      },
      {
        title: 'Budget & notes',
        fields: [
          { name: 'budget_range', type: 'budget', label: 'Package budget', required: true },
          {
            name: 'tour_notes',
            type: 'textarea',
            label: 'Special requests',
            placeholder: 'Lodges, photography, accessibility…',
            required: false,
          },
        ],
      },
    ],
    schema: yup.object({
      tour_type: yup.string().required('Please select experience type'),
      destination: yup.string().required('Country is required'),
      travel_date: dateField('Start date'),
      return_date: returnDateTest,
      num_travelers: travelersField,
      budget_range: budgetField,
      tour_notes: yup.string(),
    }),
  },

  'travel-insurance': {
    stepTitle: 'Travel insurance',
    stepSubtitle: 'Cover for your upcoming trip',
    summaryTitle: 'Travel insurance request',
    sections: [
      {
        title: 'Trip details',
        fields: [
          { name: 'destination', type: 'destination', label: 'Destination country', required: true },
          { name: 'travel_date', type: 'date', label: 'Trip start', required: true, minToday: true, group: 'dates' },
          { name: 'return_date', type: 'date', label: 'Trip end', required: true, group: 'dates' },
          { name: 'num_travelers', type: 'travelers', label: 'Travelers to cover', required: true },
        ],
      },
      {
        title: 'Coverage',
        fields: [
          {
            name: 'coverage_type',
            type: 'options',
            label: 'Coverage level',
            required: true,
            options: [
              { value: 'basic', label: 'Basic' },
              { value: 'standard', label: 'Standard' },
              { value: 'comprehensive', label: 'Comprehensive' },
              { value: 'medical_only', label: 'Medical only' },
            ],
          },
        ],
      },
      {
        title: 'Notes',
        fields: [
          {
            name: 'insurance_notes',
            type: 'textarea',
            label: 'Additional information',
            placeholder: 'Pre-existing conditions, Schengen visa, ages…',
            required: false,
          },
        ],
      },
    ],
    schema: yup.object({
      destination: yup.string().required('Country is required'),
      travel_date: dateField('Trip start date'),
      return_date: dateField('Trip end date').concat(returnDateTest),
      num_travelers: travelersField,
      coverage_type: yup.string().required('Please select coverage level'),
      insurance_notes: yup.string(),
    }),
  },
};

export function getServiceFormConfig(slug) {
  const resolved = SERVICE_SLUG_ALIASES[slug] || slug;
  return SERVICE_FORMS[resolved] || SERVICE_FORMS['travel-consultancy'];
}

export function getFormSections(config) {
  return config.sections ?? [{ title: null, fields: config.fields ?? [] }];
}

export function flattenFields(config) {
  return getFormSections(config).flatMap((section) => section.fields);
}

export function getOptionLabel(field, value) {
  if (!value || !field.options) return value;
  return field.options.find((o) => o.value === value)?.label || value;
}

export function buildSpecialRequests(slug, data) {
  const config = getServiceFormConfig(slug);
  const lines = [];

  for (const field of flattenFields(config)) {
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

  for (const field of flattenFields(config)) {
    const value = data[field.name];
    if (!value) continue;
    if (field.type === 'date') {
      rows.push({ label: field.label, value });
      continue;
    }
    if (field.type === 'budget') {
      const label = BUDGET_RANGES.find((b) => b.value === value)?.label;
      rows.push({ label: field.label, value: label || String(value) });
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
