export const fieldLabelClass = 'block text-sm font-semibold text-brand-navy mb-1.5';

export const controlClass = (hasError) =>
  `w-full h-11 px-3 rounded-xl border text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 ${
    hasError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-brand-gold'
  }`;

export const chipClass = (selected) =>
  `inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium transition-all duration-200 ${
    selected
      ? 'bg-brand-navy text-white shadow-sm'
      : 'bg-white border border-gray-200 text-brand-navy hover:border-brand-gold hover:bg-brand-light'
  }`;

export const sectionClass = 'space-y-4';
export const gridClass = 'grid grid-cols-1 sm:grid-cols-2 gap-4';
