import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useServices } from '../../hooks/useServices';
import { ServiceCardSkeleton } from '../../components/ui/Skeleton';
import { SERVICE_IMAGES, FALLBACK_SERVICES, SERVICE_DETAILS } from '../../utils/constants';

export default function Services() {
  const { services, loading, error, refetch } = useServices();
  const [expanded, setExpanded] = useState(null);

  const list = services.length > 0 ? services : FALLBACK_SERVICES;
  const showSkeleton = loading && list.length === 0;

  return (
    <>
      <section className="bg-brand-navy py-16 sm:py-20 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
        >
          Our Services
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto px-2"
        >
          Expert travel solutions designed to make your journey seamless
        </motion.p>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
        {error && !loading && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>Showing cached services. Live data unavailable.</span>
            <button
              type="button"
              onClick={refetch}
              className="text-brand-navy font-semibold hover:text-brand-purple transition-all duration-300"
            >
              Retry
            </button>
          </div>
        )}

        {showSkeleton
          ? Array.from({ length: 4 }).map((_, i) => <ServiceCardSkeleton key={i} withImage />)
          : list.map((service, i) => {
            const image = service.image || SERVICE_IMAGES[service.slug];
            const details = SERVICE_DETAILS[service.slug];
            const isOpen = expanded === service.id;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-4 sm:p-5">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-5">
                    {image && (
                      <div className="md:w-2/5 lg:w-2/5 shrink-0 overflow-hidden rounded-2xl">
                        <img
                          src={image}
                          alt={service.name}
                          className="w-full h-52 md:h-full min-h-[200px] object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-5 sm:p-6">
                      <h3 className="text-xl font-bold text-brand-navy mb-2">{service.name}</h3>

                      <p className={`text-gray-600 text-sm leading-relaxed ${isOpen ? '' : 'line-clamp-2'}`}>
                        {service.description}
                      </p>

                      <AnimatePresence initial={false}>
                        {isOpen && details && (
                          <motion.div
                            key="details"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 mt-4 border-t border-gray-100">
                              <p className="text-xs font-semibold uppercase tracking-wide text-brand-purple mb-3">
                                What&apos;s Included
                              </p>
                              <ul className="space-y-2 mb-4">
                                {details.highlights.map((item) => (
                                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                                    <Check className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                              <p className="text-xs font-semibold uppercase tracking-wide text-brand-purple mb-1">
                                Ideal For
                              </p>
                              <p className="text-sm text-gray-600">{details.idealFor}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                        {details ? (
                          <button
                            type="button"
                            onClick={() => setExpanded(isOpen ? null : service.id)}
                            className="text-brand-navy text-sm font-medium flex items-center gap-1 hover:text-brand-purple transition-all duration-300"
                          >
                            {isOpen ? (
                              <>Less <ChevronUp className="w-4 h-4" /></>
                            ) : (
                              <>More details <ChevronDown className="w-4 h-4" /></>
                            )}
                          </button>
                        ) : (
                          <span />
                        )}
                        <Link to={`/book?service=${service.slug}`}>
                          <Button size="sm" className="w-full sm:w-auto">Book This Service</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
      </section>
    </>
  );
}
