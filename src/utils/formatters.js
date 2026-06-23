import { USD_TO_TZS_RATE } from './constants';

export function usdToTzs(usd) {
  return Math.round(Number(usd) * USD_TO_TZS_RATE);
}

export function formatUsd(amount, { prefix = '' } = {}) {
  const value = Number(amount);
  if (!value && value !== 0) return '';
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
  return prefix ? `${prefix}${formatted}` : formatted;
}

export function formatTzs(amount, { prefix = '', compact = false } = {}) {
  const value = Math.round(Number(amount));
  if (!value && value !== 0) return '';

  if (compact) {
    if (value >= 1_000_000) {
      const millions = value / 1_000_000;
      const text = millions >= 10 ? millions.toFixed(0) : millions.toFixed(1).replace(/\.0$/, '');
      return `${prefix}TZS ${text}M`;
    }
    if (value >= 1_000) {
      const thousands = value / 1_000;
      const text = thousands >= 10 ? thousands.toFixed(0) : thousands.toFixed(1).replace(/\.0$/, '');
      return `${prefix}TZS ${text}K`;
    }
  }

  return `${prefix}TZS ${new Intl.NumberFormat('en-TZ', { maximumFractionDigits: 0 }).format(value)}`;
}

export function formatPriceFrom(usd) {
  const amount = Number(usd);
  if (!amount || amount <= 0) return null;

  const usdText = formatUsd(amount, { prefix: 'From ' });
  const tzsText = formatTzs(usdToTzs(amount));

  return {
    usd: usdText,
    tzs: tzsText,
    inline: `${usdText} · ${tzsText}`,
  };
}

export function formatBudgetRangeLabel({ usdMin, usdMax }, { compact = false } = {}) {
  if (usdMax != null && usdMin == null) {
    const usd = formatUsd(usdMax, { prefix: '< ' });
    const tzs = formatTzs(usdToTzs(usdMax), { prefix: '< ', compact });
    return `${usd} · ${tzs}`;
  }

  if (usdMin != null && usdMax == null) {
    const usd = formatUsd(usdMin, { prefix: 'Over ' });
    const tzs = formatTzs(usdToTzs(usdMin), { prefix: 'Over ', compact });
    return `${usd} · ${tzs}`;
  }

  const usd = `${formatUsd(usdMin)} – ${formatUsd(usdMax)}`;
  const tzs = `${formatTzs(usdToTzs(usdMin), { compact })} – ${formatTzs(usdToTzs(usdMax), { compact })}`;
  return `${usd} · ${tzs}`;
}

export function formatBudgetRangeStack({ usdMin, usdMax }) {
  if (usdMax != null && usdMin == null) {
    return {
      usd: formatUsd(usdMax, { prefix: '< ' }),
      tzs: formatTzs(usdToTzs(usdMax), { prefix: '< ' }),
    };
  }

  if (usdMin != null && usdMax == null) {
    return {
      usd: formatUsd(usdMin, { prefix: 'Over ' }),
      tzs: formatTzs(usdToTzs(usdMin), { prefix: 'Over ' }),
    };
  }

  return {
    usd: `${formatUsd(usdMin)} – ${formatUsd(usdMax)}`,
    tzs: `${formatTzs(usdToTzs(usdMin))} – ${formatTzs(usdToTzs(usdMax))}`,
  };
}

export function getBudgetLabel(value) {
  return BUDGET_RANGE_DEFS.find((b) => b.value === value)?.label ?? value;
}

const BUDGET_RANGE_DEFS = [
  { value: 'under_500', usdMin: null, usdMax: 500 },
  { value: '500_1500', usdMin: 500, usdMax: 1500 },
  { value: '1500_5000', usdMin: 1500, usdMax: 5000 },
  { value: 'over_5000', usdMin: 5000, usdMax: null },
];

export const BUDGET_RANGES = BUDGET_RANGE_DEFS.map((range) => ({
  ...range,
  label: formatBudgetRangeLabel(range),
  stack: formatBudgetRangeStack(range),
}));

export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusBadge(status) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
}
