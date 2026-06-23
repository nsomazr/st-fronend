import { Minus, Plus, Users } from 'lucide-react';
import { BUDGET_RANGES } from '../../utils/formatters';
import { controlClass } from './formStyles';

export function TravelerCounter({ value, onChange, error }) {
  const count = Number(value) || 1;

  return (
    <div
      className={`${controlClass(error)} flex items-center justify-between px-3 ${
        error ? '' : 'hover:border-brand-gold'
      }`}
    >
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Users className="w-4 h-4 text-brand-gold" />
        <span>{count === 1 ? 'Traveler' : 'Travelers'}</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, count - 1))}
          disabled={count <= 1}
          aria-label="Decrease travelers"
          className="w-8 h-8 rounded-lg border border-brand-navy/20 text-brand-navy flex items-center justify-center hover:bg-brand-navy hover:text-white transition-colors disabled:opacity-30"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-5 text-center text-lg font-bold text-brand-navy tabular-nums">{count}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(50, count + 1))}
          disabled={count >= 50}
          aria-label="Increase travelers"
          className="w-8 h-8 rounded-lg border border-brand-navy/20 text-brand-navy flex items-center justify-center hover:bg-brand-navy hover:text-white transition-colors disabled:opacity-30"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function OptionPicker({ options, value, onChange, error, columns = 2 }) {
  return (
    <div
      className={`grid gap-2 ${
        columns === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'
      } ${error ? 'rounded-xl ring-1 ring-red-400 p-0.5' : ''}`}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              selected
                ? 'bg-brand-gold text-brand-navy shadow-sm'
                : 'bg-white border border-gray-200 text-brand-navy hover:border-brand-purple'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function BudgetPicker({ value, onChange, error }) {
  return (
    <div
      className={`grid grid-cols-2 gap-2 ${
        error ? 'rounded-xl ring-1 ring-red-400 p-0.5' : ''
      }`}
    >
      {BUDGET_RANGES.map((budget) => {
        const selected = value === budget.value;
        return (
          <button
            key={budget.value}
            type="button"
            onClick={() => onChange(budget.value)}
            className={`min-h-[52px] px-2 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex flex-col items-center justify-center leading-tight ${
              selected
                ? 'bg-brand-gold text-brand-navy shadow-sm'
                : 'bg-white border border-gray-200 text-brand-navy hover:border-brand-purple'
            }`}
            >
              <span>{budget.stack.usd}</span>
              <span className={`text-[10px] font-medium mt-0.5 ${selected ? 'text-brand-navy/70' : 'text-gray-500'}`}>
                {budget.stack.tzs}
              </span>
            </button>
        );
      })}
    </div>
  );
}
