import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Mail, Phone, User } from 'lucide-react';
import Stepper from '../ui/Stepper';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ConfirmCard from './ConfirmCard';
import CountryPicker from './CountryPicker';
import DestinationPicker from './DestinationPicker';
import ServicePicker from './ServicePicker';
import { TravelerCounter, BudgetPicker } from './TripPickers';
import { useServices } from '../../hooks/useServices';
import { useBooking } from '../../hooks/useBooking';
import { bookingDetailsSchema } from '../../utils/validators';
import { BUDGET_RANGES } from '../../utils/formatters';
import { DEFAULT_COUNTRY, STEP_MESSAGES } from '../../utils/bookingData';
import { formatDate } from '../../utils/formatters';
import { ServiceCardSkeleton } from '../ui/Skeleton';
import { controlClass, fieldLabelClass, gridClass, sectionClass } from './formStyles';

const STEPS = ['Details', 'Confirm'];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 24 : -24, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -24 : 24, opacity: 0 }),
};

function Field({ label, error, children, required, className = '' }) {
  return (
    <div className={className}>
      <label className={fieldLabelClass}>
        {label} {required && <span className="text-brand-gold">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className={sectionClass}>
      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-purple/80">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default function BookingForm() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const { services, loading: servicesLoading } = useServices();
  const { createBooking, booking, loading, error } = useBooking();

  const form = useForm({
    resolver: yupResolver(bookingDetailsSchema),
    defaultValues: {
      country: DEFAULT_COUNTRY,
      num_travelers: 1,
      special_requests: '',
    },
  });

  const goToStep = (next) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  useEffect(() => {
    const serviceSlug = searchParams.get('service');
    if (serviceSlug && services.length) {
      const svc = services.find((s) => s.slug === serviceSlug);
      if (svc) form.setValue('service_id', svc.id);
    }
  }, [searchParams, services, form]);

  if (booking) return <ConfirmCard booking={booking} />;

  const values = form.watch();
  const selectedService = services.find((s) => s.id === Number(values.service_id));
  const budgetLabel = BUDGET_RANGES.find((b) => b.value === values.budget_range)?.label;
  const stepMsg = STEP_MESSAGES[step];
  const { errors } = form.formState;

  const onDetailsSubmit = () => goToStep(1);

  const onFinalSubmit = async (data) => {
    const payload = {
      ...data,
      special_requests: data.special_requests || '',
      service_id: Number(data.service_id),
      num_travelers: Number(data.num_travelers),
    };
    await createBooking(payload);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-0">
        <div className="bg-gradient-to-r from-brand-navy to-brand-purple px-6 py-5 text-white rounded-t-2xl">
          <h2 className="text-xl font-bold">{stepMsg.title}</h2>
          <p className="text-white/75 text-sm mt-1">{stepMsg.subtitle}</p>
        </div>

        <div className="px-6 pt-5">
          <Stepper steps={STEPS} currentStep={step} />
        </div>

        <div className="px-6 pb-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {step === 0 && (
                <form onSubmit={form.handleSubmit(onDetailsSubmit)} className="space-y-6">
                  <Section title="Your details">
                    <div className={gridClass}>
                      <Field label="Full Name" error={errors.full_name?.message} required>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          <input
                            {...form.register('full_name')}
                            className={`${controlClass(errors.full_name)} pl-10`}
                            placeholder="Your name"
                          />
                        </div>
                      </Field>

                      <Field label="Email" error={errors.email?.message} required>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          <input
                            {...form.register('email')}
                            type="email"
                            className={`${controlClass(errors.email)} pl-10`}
                            placeholder="you@email.com"
                          />
                        </div>
                      </Field>

                      <Field label="Phone" error={errors.phone?.message} required>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          <input
                            {...form.register('phone')}
                            className={`${controlClass(errors.phone)} pl-10`}
                            placeholder="+255 7XX XXX XXX"
                          />
                        </div>
                      </Field>

                      <Field label="Your Country" error={errors.country?.message} required>
                        <Controller
                          name="country"
                          control={form.control}
                          render={({ field }) => (
                            <CountryPicker
                              value={field.value}
                              onChange={field.onChange}
                              error={errors.country?.message}
                            />
                          )}
                        />
                      </Field>
                    </div>
                  </Section>

                  <Section title="Trip details">
                    <Field label="Service" error={errors.service_id?.message} required>
                      {servicesLoading ? (
                        <ServiceCardSkeleton withImage />
                      ) : (
                        <Controller
                          name="service_id"
                          control={form.control}
                          render={({ field }) => (
                            <ServicePicker
                              services={services}
                              value={field.value}
                              onChange={field.onChange}
                              error={errors.service_id?.message}
                            />
                          )}
                        />
                      )}
                    </Field>

                    <Field label="Destination" error={errors.destination?.message} required>
                      <Controller
                        name="destination"
                        control={form.control}
                        render={({ field }) => (
                          <DestinationPicker
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.destination?.message}
                          />
                        )}
                      />
                    </Field>

                    <div className={gridClass}>
                      <Field label="Departure" error={errors.travel_date?.message} required>
                        <input
                          {...form.register('travel_date')}
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          className={controlClass(errors.travel_date)}
                        />
                      </Field>
                      <Field label="Return" error={errors.return_date?.message}>
                        <input
                          {...form.register('return_date')}
                          type="date"
                          className={controlClass(errors.return_date)}
                        />
                      </Field>
                    </div>

                    <Field label="Travelers" error={errors.num_travelers?.message} required>
                      <Controller
                        name="num_travelers"
                        control={form.control}
                        render={({ field }) => (
                          <TravelerCounter
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.num_travelers?.message}
                          />
                        )}
                      />
                    </Field>

                    <Field label="Budget" error={errors.budget_range?.message} required>
                      <Controller
                        name="budget_range"
                        control={form.control}
                        render={({ field }) => (
                          <BudgetPicker
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.budget_range?.message}
                          />
                        )}
                      />
                    </Field>
                  </Section>

                  <div className="flex justify-end pt-2">
                    <Button type="submit">
                      Review <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              )}

              {step === 1 && (
                <form onSubmit={form.handleSubmit(onFinalSubmit)} className="space-y-5">
                  <div className="rounded-xl border border-brand-gold/30 overflow-hidden text-sm">
                    <div className="bg-brand-navy px-4 py-2.5">
                      <p className="text-white text-sm font-semibold">Trip summary</p>
                    </div>
                    <div className="bg-brand-light px-4 py-4 space-y-4">
                      <div className="pb-3 border-b border-brand-gold/20">
                        <p className="font-semibold text-brand-navy">{values.full_name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{values.email} · {values.phone}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">From</p>
                          <p className="font-medium text-brand-navy">{values.country}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">To</p>
                          <p className="font-medium text-brand-navy">{values.destination}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">Service</p>
                          <p className="font-medium text-brand-navy">{selectedService?.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">Travelers</p>
                          <p className="font-medium text-brand-navy">{values.num_travelers}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">Departure</p>
                          <p className="font-medium text-brand-navy">{formatDate(values.travel_date)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">Budget</p>
                          <p className="font-medium text-brand-navy">{budgetLabel}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Field label="Special requests">
                    <textarea
                      {...form.register('special_requests')}
                      rows={3}
                      className={`${controlClass(false)} h-auto py-2.5 resize-none`}
                      placeholder="Dietary needs, celebrations, etc."
                    />
                  </Field>

                  <div className="flex justify-between pt-1">
                    <Button type="button" variant="outline" onClick={() => goToStep(0)}>
                      <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                      ) : (
                        <>Confirm Booking</>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
