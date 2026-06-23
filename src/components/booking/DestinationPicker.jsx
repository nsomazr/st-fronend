import { POPULAR_DESTINATIONS } from '../../utils/bookingData';
import CountryPicker from './CountryPicker';
import { chipClass } from './formStyles';

export default function DestinationPicker({ value, onChange, error }) {
  const isPopular = POPULAR_DESTINATIONS.some((d) => d.label === value);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {POPULAR_DESTINATIONS.map((dest) => {
          const selected = value === dest.label;
          return (
            <button
              key={dest.label}
              type="button"
              onClick={() => onChange(dest.label)}
              className={chipClass(selected)}
            >
              <span className="leading-none">{dest.emoji}</span>
              {dest.label}
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
