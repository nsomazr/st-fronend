import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Card from './Card';
import { SERVICE_IMAGES } from '../../utils/constants';
import { getServiceIcon } from '../../utils/serviceIcons';

export default function ServiceCard({ service, variant = 'grid' }) {
  const Icon = getServiceIcon(service.icon);
  const image = service.image || SERVICE_IMAGES[service.slug];

  if (variant === 'list') {
    return (
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
          {image && (
            <div className="sm:w-2/5 lg:w-1/3 shrink-0 overflow-hidden rounded-2xl">
              <img
                src={image}
                alt={service.name}
                className="w-full h-48 sm:h-full min-h-[12rem] object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex-1 p-5 sm:p-6 flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-brand-gold/10 rounded-lg flex items-center justify-center text-brand-gold shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-brand-navy">{service.name}</h3>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed flex-1">{service.description}</p>
            <div className="mt-4 flex justify-end">
              <Link to={`/book?service=${service.slug}`}>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-purple hover:gap-2 transition-all duration-300">
                  Book This Service <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card hover className="h-full flex flex-col p-4 sm:p-5 group">
      {image && (
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-4">
          <img
            src={image}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 to-transparent rounded-2xl" />
          <div className="absolute bottom-3 left-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-brand-gold shadow-md">
            <Icon className="w-5 h-5" />
          </div>
        </div>
      )}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {!image && (
          <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold mb-4">
            <Icon className="w-6 h-6" />
          </div>
        )}
        <h3 className="font-bold text-brand-navy text-base sm:text-lg mb-2">{service.name}</h3>
        <p className="text-gray-600 text-sm flex-1 mb-4 line-clamp-3">{service.description}</p>
        <Link
          to={`/book?service=${service.slug}`}
          className="text-brand-purple text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all duration-300 mt-auto"
        >
          Book Now <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </Card>
  );
}
