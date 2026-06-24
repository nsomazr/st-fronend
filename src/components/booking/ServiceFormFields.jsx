import { Controller } from 'react-hook-form';
import CountryPicker from './CountryPicker';
import DestinationPicker from './DestinationPicker';
import { TravelerCounter, BudgetPicker, OptionPicker } from './TripPickers';
import { controlClass, gridClass } from './formStyles';

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

function renderField(field, { control, register, errors, today }) {
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
}

function renderFieldList(fields, ctx) {
  const visible = fields.filter((field) => !field.showWhen || field.showWhen(ctx.values));
  const nodes = [];
  let i = 0;

  while (i < visible.length) {
    const field = visible[i];
    if (field.group) {
      const groupName = field.group;
      const groupFields = [];
      while (i < visible.length && visible[i].group === groupName) {
        groupFields.push(visible[i]);
        i += 1;
      }
      nodes.push(
        <div key={groupName} className={gridClass}>
          {groupFields.map((f) => renderField(f, ctx))}
        </div>,
      );
    } else {
      nodes.push(renderField(field, ctx));
      i += 1;
    }
  }

  return nodes;
}

export default function ServiceFormFields({ sections, form, values }) {
  const { control, register, formState: { errors } } = form;
  const today = new Date().toISOString().split('T')[0];
  const ctx = { control, register, errors, values, today };

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        if (section.showWhen && !section.showWhen(values)) return null;

        return (
          <div key={section.title || 'default'} className="space-y-4">
            {section.title && (
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-purple/70 border-b border-brand-gold/20 pb-2">
                {section.title}
              </h4>
            )}
            {renderFieldList(section.fields, ctx)}
          </div>
        );
      })}
    </div>
  );
}
