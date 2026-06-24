import { COUNTRIES } from './countries';

export { COUNTRIES };

export const DEFAULT_COUNTRY = 'Tanzania';

const POPULAR_COUNTRY_CODES = [
  'TZ', 'KE', 'UG', 'RW', 'ZA', 'AE', 'GB', 'US', 'FR', 'DE', 'TR', 'IN', 'CN', 'TH',
];

/** Quick-pick countries for destination fields (not cities). */
export const POPULAR_COUNTRIES = POPULAR_COUNTRY_CODES.map((code) =>
  COUNTRIES.find((c) => c.code === code),
).filter(Boolean);

export const STEP_MESSAGES = [
  { title: 'Choose your service', subtitle: 'Select the service that best fits your travel needs' },
  { title: 'Your details', subtitle: 'Tell us about you and your trip' },
  { title: 'Review & confirm', subtitle: 'Check everything looks right before submitting' },
];
