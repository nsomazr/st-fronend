export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 ${
        hover ? 'hover:-translate-y-1 hover:shadow-xl' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
