import { POPULAR_COUNTRIES } from '../../utils/bookingData';
import CountryPicker from './CountryPicker';
import { chipClass } from './formStyles';

export default function DestinationPicker({ value, onChange, error }) {
  const isPopular = POPULAR_COUNTRIES.some((c) => c.name === value);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {POPULAR_COUNTRIES.map((country) => {
          const selected = value === country.name;
          return (
            <button
              key={country.code}
              type="button"
              onClick={() => onChange(country.name)}
              className={chipClass(selected)}
            >
              <span className="leading-none">{country.flag}</span>
              {country.name}
            </button>
          );
        })}
      </div>
      <CountryPicker
        value={isPopular ? '' : value}
        onChange={onChange}
        placeholder="Or search all countries"
        error={!isPopular ? error : undefined}
      />
    </div>
  );
}
