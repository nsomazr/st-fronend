import { getServiceIcon } from '../../utils/serviceIcons';
import { SERVICE_IMAGES } from '../../utils/constants';
import PriceDisplay from '../ui/PriceDisplay';

export default function ServicePicker({ services, value, onChange, error }) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${
        error ? 'rounded-xl ring-1 ring-red-400 p-0.5' : ''
      }`}
    >
      {services.map((service) => {
        const selected = Number(value) === service.id;
        const Icon = getServiceIcon(service.icon);
        const image = service.image || SERVICE_IMAGES[service.slug];

        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onChange(service.id)}
            className={`relative overflow-hidden rounded-xl border-2 text-left transition-all duration-200 h-[104px] ${
              selected
                ? 'border-brand-gold shadow-md ring-2 ring-brand-gold/30'
                : 'border-gray-200 hover:border-brand-purple/40 hover:shadow-sm'
            }`}
          >
            {image ? (
              <>
                <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/20 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-brand-light flex items-center justify-center">
                <Icon className="w-8 h-8 text-brand-gold" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className={`font-semibold text-sm leading-tight ${image ? 'text-white' : 'text-brand-navy'}`}>
                {service.name}
              </p>
              {service.price_from > 0 && (
                <p className={`text-xs mt-0.5 ${image ? 'text-brand-gold' : 'text-brand-purple'}`}>
                  <PriceDisplay usd={service.price_from} layout="stack" tzsClassName={image ? 'text-brand-gold/90' : ''} />
                </p>
              )}
            </div>
            {selected && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-brand-gold rounded-full flex items-center justify-center text-brand-navy text-[10px] font-bold">
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
