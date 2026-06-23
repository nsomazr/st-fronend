import { Controller } from 'react-hook-form';
import CountryPicker from './CountryPicker';
import DestinationPicker from './DestinationPicker';
import { TravelerCounter, BudgetPicker, OptionPicker } from './TripPickers';
import { controlClass } from './formStyles';

function Field({ label, error, children, required, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-brand-navy mb-1.5">
        {label} {required && <span className="text-brand-gold">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

export default function ServiceFormFields({ fields, form, values }) {
  const { control, register, formState: { errors } } = form;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        if (field.showWhen && !field.showWhen(values)) return null;

        const error = errors[field.name]?.message;

        switch (field.type) {
          case 'text':
            return (
              <Field key={field.name} label={field.label} error={error} required={field.required}>
                <input
                  {...register(field.name)}
                  className={controlClass(error)}
                  placeholder={field.placeholder}
                />
              </Field>
            );

          case 'textarea':
            return (
              <Field key={field.name} label={field.label} error={error} required={field.required}>
                <textarea
                  {...register(field.name)}
                  rows={3}
                  className={`${controlClass(error)} h-auto py-2.5 resize-none`}
                  placeholder={field.placeholder}
                />
              </Field>
            );

          case 'date':
            return (
              <Field key={field.name} label={field.label} error={error} required={field.required}>
                <input
                  {...register(field.name)}
                  type="date"
                  min={field.minToday ? today : undefined}
                  className={controlClass(error)}
                />
              </Field>
            );

          case 'destination':
            return (
              <Field key={field.name} label={field.label} error={error} required={field.required}>
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: f }) => (
                    <DestinationPicker value={f.value} onChange={f.onChange} error={error} />
                  )}
                />
              </Field>
            );

          case 'country':
            return (
              <Field key={field.name} label={field.label} error={error} required={field.required}>
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: f }) => (
                    <CountryPicker value={f.value} onChange={f.onChange} error={error} />
                  )}
                />
              </Field>
            );

          case 'travelers':
            return (
              <Field key={field.name} label={field.label} error={error} required={field.required}>
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: f }) => (
                    <TravelerCounter value={f.value} onChange={f.onChange} error={error} />
                  )}
                />
              </Field>
            );

          case 'budget':
            return (
              <Field key={field.name} label={field.label} error={error} required={field.required}>
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: f }) => (
                    <BudgetPicker value={f.value} onChange={f.onChange} error={error} />
                  )}
                />
              </Field>
            );

          case 'options':
            return (
              <Field key={field.name} label={field.label} error={error} required={field.required}>
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: f }) => (
                    <OptionPicker
                      options={field.options}
                      value={f.value}
                      onChange={f.onChange}
                      error={error}
                      columns={field.options.length > 4 ? 3 : 2}
                    />
                  )}
                />
              </Field>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
