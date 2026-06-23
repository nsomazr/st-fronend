export default function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
      {...props}
    />
  );
}

export function ServiceCardSkeleton({ withImage = false }) {
  if (withImage) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <Skeleton className="w-full h-52 rounded-none" />
        <div className="p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <Skeleton className="w-12 h-12 rounded-xl mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <Skeleton className="h-4 w-1/2 mb-3" />
      <Skeleton className="h-8 w-1/3" />
    </div>
  );
}
