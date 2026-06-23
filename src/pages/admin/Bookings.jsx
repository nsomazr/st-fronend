import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, Phone, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import { useServices } from '../../hooks/useServices';
import { adminApi, bookingsApi } from '../../services/api';
import { BOOKING_STATUSES } from '../../utils/constants';
import { formatDate, formatDateTime } from '../../utils/formatters';

export default function AdminBookings() {
  const [searchParams] = useSearchParams();
  const { services } = useServices();
  const [bookings, setBookings] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    service: '',
    search: '',
    date_from: '',
    date_to: '',
  });
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const status = searchParams.get('status');
    if (status) setFilters((f) => ({ ...f, status }));
  }, [searchParams]);

  useEffect(() => {
    adminApi.dashboardStats()
      .then(({ data }) => setPendingCount(data.pending || 0))
      .catch(() => {});
  }, [bookings]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v)
      );
      const { data } = await bookingsApi.list(params);
      setBookings(data.results || data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(fetchBookings, 300);
    return () => clearTimeout(timer);
  }, [fetchBookings]);

  const handleStatusChange = async (ref, status) => {
    setUpdating(true);
    try {
      const { data } = await bookingsApi.updateStatus(ref, status);
      setBookings((prev) => prev.map((b) => (b.booking_ref === ref ? data : b)));
      if (selected?.booking_ref === ref) setSelected(data);
      toast.success('Status updated. Customer notified via email');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout title="Bookings" badge={pendingCount}>
      <Card className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search ref, customer, destination..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 text-sm"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
          >
            <option value="">All Statuses</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={filters.service}
            onChange={(e) => setFilters((f) => ({ ...f, service: e.target.value }))}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
          >
            <option value="">All Services</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value }))}
              className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
            />
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value }))}
              className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
            />
          </div>
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="pb-3 pr-4">Ref</th>
              <th className="pb-3 pr-4">Customer</th>
              <th className="pb-3 pr-4">Service</th>
              <th className="pb-3 pr-4">Destination</th>
              <th className="pb-3 pr-4">Travel Date</th>
              <th className="pb-3 pr-4">Travelers</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Created</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={9} />)
              : bookings.map((b) => (
                <tr
                  key={b.booking_ref}
                  onClick={() => setSelected(b)}
                  className="border-b border-gray-50 hover:bg-brand-light/50 cursor-pointer transition-all duration-300"
                >
                  <td className="py-3 pr-4 font-mono font-semibold text-brand-navy">{b.booking_ref}</td>
                  <td className="py-3 pr-4">{b.customer_name}</td>
                  <td className="py-3 pr-4">{b.service_name}</td>
                  <td className="py-3 pr-4">{b.destination}</td>
                  <td className="py-3 pr-4">{formatDate(b.travel_date)}</td>
                  <td className="py-3 pr-4">{b.num_travelers}</td>
                  <td className="py-3 pr-4"><Badge status={b.status}>{b.status_display || b.status}</Badge></td>
                  <td className="py-3 pr-4 text-gray-500">{formatDateTime(b.created_at)}</td>
                  <td className="py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={b.status}
                      disabled={updating}
                      onChange={(e) => handleStatusChange(b.booking_ref, e.target.value)}
                      className="text-xs px-2 py-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                    >
                      {BOOKING_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {!loading && !bookings.length && (
          <p className="text-center text-gray-500 py-8">No bookings found</p>
        )}
      </Card>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Booking ${selected?.booking_ref}`} size="lg">
        {selected && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Customer</span><p className="font-semibold text-brand-navy">{selected.customer_name}</p></div>
              <div><span className="text-gray-500">Email</span><p className="font-semibold">{selected.customer_email}</p></div>
              <div><span className="text-gray-500">Phone</span><p className="font-semibold">{selected.customer_phone}</p></div>
              <div><span className="text-gray-500">Service</span><p className="font-semibold">{selected.service_name}</p></div>
              <div><span className="text-gray-500">Destination</span><p className="font-semibold">{selected.destination}</p></div>
              <div><span className="text-gray-500">Travel Date</span><p className="font-semibold">{formatDate(selected.travel_date)}</p></div>
              <div><span className="text-gray-500">Return Date</span><p className="font-semibold">{formatDate(selected.return_date) || 'N/A'}</p></div>
              <div><span className="text-gray-500">Travelers</span><p className="font-semibold">{selected.num_travelers}</p></div>
              <div className="col-span-2"><span className="text-gray-500">Budget</span><p className="font-semibold">{selected.budget_range_display || selected.budget_range}</p></div>
              <div><span className="text-gray-500">Status</span><p><Badge status={selected.status}>{selected.status_display || selected.status}</Badge></p></div>
            </div>
            {selected.special_requests && (
              <div>
                <span className="text-gray-500 text-sm">Special Requests</span>
                <p className="mt-1 text-sm bg-brand-light p-3 rounded-xl">{selected.special_requests}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Update Status</label>
                <select
                  value={selected.status}
                  disabled={updating}
                  onChange={(e) => handleStatusChange(selected.booking_ref, e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                >
                  {BOOKING_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2">
                <a href={`mailto:${selected.customer_email}`}>
                  <Button size="sm" variant="outline"><Mail className="w-4 h-4" /> Email</Button>
                </a>
                <a href={`tel:${selected.customer_phone}`}>
                  <Button size="sm" variant="outline"><Phone className="w-4 h-4" /> Call</Button>
                </a>
                <Link to={`/admin/customers?search=${encodeURIComponent(selected.customer_email)}`}>
                  <Button size="sm" variant="ghost">View Customer</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
