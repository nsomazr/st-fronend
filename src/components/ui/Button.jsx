export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-brand-gold text-brand-navy hover:bg-yellow-400 shadow-md hover:shadow-lg',
    secondary: 'bg-brand-navy text-white hover:bg-blue-900 shadow-md hover:shadow-lg',
    outline: 'border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white',
    ghost: 'text-brand-navy hover:bg-brand-light',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
