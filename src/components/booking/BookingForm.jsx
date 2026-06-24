import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Mail, Phone, User } from 'lucide-react';
import Stepper from '../ui/Stepper';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ConfirmCard from './ConfirmCard';
import CountryPicker from './CountryPicker';
import ServicePicker from './ServicePicker';
import ServiceFormFields from './ServiceFormFields';
import { useServices } from '../../hooks/useServices';
import { useBooking } from '../../hooks/useBooking';
import { getServiceBookingSchema, serviceSelectSchema } from '../../utils/validators';
import { DEFAULT_COUNTRY, STEP_MESSAGES } from '../../utils/bookingData';
import {
  getServiceFormConfig,
  getFormSections,
  buildSpecialRequests,
  getSummaryRows,
} from '../../utils/serviceForms';
import { formatDate, toApiDate } from '../../utils/formatters';
import { ServiceCardSkeleton } from '../ui/Skeleton';
import { controlClass, fieldLabelClass, gridClass, sectionClass } from './formStyles';

const STEPS = ['Service', 'Details', 'Confirm'];

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

function applyYupErrors(form, err) {
  if (err.inner) {
    err.inner.forEach((e) => form.setError(e.path, { type: 'manual', message: e.message }));
    return;
  }
  if (err.path) {
    form.setError(err.path, { type: 'manual', message: err.message });
  }
}

export default function BookingForm() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const { services, loading: servicesLoading } = useServices();
  const { createBooking, booking, loading, error } = useBooking();

  const form = useForm({
    defaultValues: {
      country: DEFAULT_COUNTRY,
      num_travelers: 1,
    },
  });

  const goToStep = (next) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  useEffect(() => {
    const serviceSlug = searchParams.get('service');
    if (serviceSlug && services.length) {
      const resolvedSlug =
        serviceSlug === 'holiday-planning'
          ? 'travel-consultancy'
          : serviceSlug === 'maasai-experience-tour'
            ? 'safari-and-tours'
            : serviceSlug;
      const svc = services.find((s) => s.slug === resolvedSlug);
      if (svc) form.setValue('service_id', svc.id);
    }
  }, [searchParams, services, form]);

  const values = form.watch();
  const selectedService = services.find((s) => s.id === Number(values.service_id));
  const serviceSlug = selectedService?.slug || 'travel-consultancy';
  const serviceConfig = useMemo(() => getServiceFormConfig(serviceSlug), [serviceSlug]);
  const formSections = useMemo(() => getFormSections(serviceConfig), [serviceConfig]);
  const { errors } = form.formState;

  const stepMsg =
    step === 1
      ? { title: serviceConfig.stepTitle, subtitle: serviceConfig.stepSubtitle }
      : STEP_MESSAGES[step];

  const summaryRows = useMemo(() => getSummaryRows(serviceSlug, values), [serviceSlug, values]);

  if (booking) return <ConfirmCard booking={booking} />;

  const onServiceNext = async () => {
    form.clearErrors();
    try {
      await serviceSelectSchema.validate(
        { service_id: values.service_id },
        { abortEarly: false },
      );
      goToStep(1);
    } catch (err) {
      applyYupErrors(form, err);
    }
  };

  const onDetailsSubmit = async () => {
    form.clearErrors();
    try {
      await getServiceBookingSchema(serviceSlug).validate(values, { abortEarly: false });
      goToStep(2);
    } catch (err) {
      applyYupErrors(form, err);
    }
  };

  const onFinalSubmit = async () => {
    form.clearErrors();
    try {
      const data = await getServiceBookingSchema(serviceSlug).validate(values, { abortEarly: false });
      const merged = { ...values, ...data };
      const payload = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        country: data.country,
        service_id: Number(data.service_id),
        destination: data.destination,
        travel_date: toApiDate(data.travel_date),
        return_date: toApiDate(data.return_date),
        num_travelers: Number(data.num_travelers),
        budget_range: data.budget_range || 'under_500',
        special_requests: buildSpecialRequests(serviceSlug, merged),
      };
      await createBooking(payload);
    } catch (err) {
      if (err.name === 'ValidationError') applyYupErrors(form, err);
    }
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
                <div className="space-y-6">
                  <Field label="What do you need help with?" error={errors.service_id?.message} required>
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

                  <div className="flex justify-end pt-2">
                    <Button type="button" onClick={onServiceNext}>
                      Continue <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); onDetailsSubmit(); }} className="space-y-6">
                  <Section title="Your contact details">
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

                  <Section title={serviceConfig.summaryTitle}>
                    <ServiceFormFields sections={formSections} form={form} values={values} />
                  </Section>

                  <div className="flex justify-between pt-2">
                    <Button type="button" variant="outline" onClick={() => goToStep(0)}>
                      <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <Button type="submit">
                      Review <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={(e) => { e.preventDefault(); onFinalSubmit(); }} className="space-y-5">
                  <div className="rounded-xl border border-brand-gold/30 overflow-hidden text-sm">
                    <div className="bg-brand-navy px-4 py-2.5">
                      <p className="text-white text-sm font-semibold">{serviceConfig.summaryTitle}</p>
                    </div>
                    <div className="bg-brand-light px-4 py-4 space-y-4">
                      <div className="pb-3 border-b border-brand-gold/20">
                        <p className="font-semibold text-brand-navy">{values.full_name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {values.email} · {values.phone}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">From {values.country}</p>
                      </div>

                      <div className="pb-3 border-b border-brand-gold/20">
                        <p className="text-gray-500 text-xs mb-0.5">Service</p>
                        <p className="font-medium text-brand-navy">{selectedService?.name}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        {summaryRows.map((row) => (
                          <div key={row.label}>
                            <p className="text-gray-500 text-xs mb-0.5">{row.label}</p>
                            <p className="font-medium text-brand-navy">
                              {row.label.toLowerCase().includes('date')
                                ? formatDate(row.value)
                                : row.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-1">
                    <Button type="button" variant="outline" onClick={() => goToStep(1)}>
                      <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                        </>
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
