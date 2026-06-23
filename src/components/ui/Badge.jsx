export default function Badge({ children, status, className = '' }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
        colors[status] || 'bg-gray-100 text-gray-800'
      } ${className}`}
    >
      {children}
    </span>
  );
}
