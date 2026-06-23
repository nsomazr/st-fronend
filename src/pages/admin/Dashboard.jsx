import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CalendarCheck,
  CheckCircle,
  Clock,
  Mail,
  Plane,
  Users,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { StatCardSkeleton, TableRowSkeleton } from '../../components/ui/Skeleton';
import { adminApi } from '../../services/api';
import { formatDate, formatDateTime } from '../../utils/formatters';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.dashboardStats()
      .then(({ data }) => setStats(data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Bookings', value: stats.total_bookings, icon: Plane, color: 'text-brand-navy' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600' },
    { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Customers', value: stats.total_customers, icon: Users, color: 'text-brand-purple' },
  ] : [];

  return (
    <AdminLayout title="Dashboard" badge={stats?.pending}>
      {stats?.failed_emails > 0 && (
        <Card className="mb-6 border border-red-200 bg-red-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">
                  {stats.failed_emails} failed email{stats.failed_emails !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-red-700/80">Check SMTP settings or review the email log.</p>
              </div>
            </div>
            <Link to="/admin/emails?status=failed">
              <Button size="sm" variant="outline">View Email Logs</Button>
            </Link>
          </div>
        </Card>
      )}

      {stats?.pending > 0 && (
        <Card className="mb-6 border border-amber-200 bg-amber-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">
                  {stats.pending} booking{stats.pending !== 1 ? 's' : ''} awaiting review
                </p>
                <p className="text-sm text-amber-800/80">Confirm or update status to notify customers.</p>
              </div>
            </div>
            <Link to="/admin/bookings?status=pending">
              <Button size="sm">Review Pending</Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((stat) => (
            <Card key={stat.label}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-brand-navy mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-60`} />
              </div>
            </Card>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <h2 className="text-lg font-bold text-brand-navy mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/admin/bookings?status=pending" className="block">
              <Button size="sm" className="w-full justify-start" variant="outline">
                <Clock className="w-4 h-4" /> Pending bookings
              </Button>
            </Link>
            <Link to="/admin/bookings" className="block">
              <Button size="sm" className="w-full justify-start" variant="outline">
                <Plane className="w-4 h-4" /> All bookings
              </Button>
            </Link>
            <Link to="/admin/customers" className="block">
              <Button size="sm" className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4" /> Customer list
              </Button>
            </Link>
            <Link to="/admin/emails" className="block">
              <Button size="sm" className="w-full justify-start" variant="outline">
                <Mail className="w-4 h-4" /> Email logs
              </Button>
            </Link>
          </div>

          {!loading && stats && (
            <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-center text-sm">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-gray-500 text-xs">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-500">{stats.cancelled}</p>
                <p className="text-gray-500 text-xs">Cancelled</p>
              </div>
            </div>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-lg font-bold text-brand-navy mb-4">Bookings by Service</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : stats?.bookings_by_service?.length ? (
            <div className="space-y-3">
              {stats.bookings_by_service.map((row) => {
                const pct = stats.total_bookings
                  ? Math.round((row.count / stats.total_bookings) * 100)
                  : 0;
                return (
                  <div key={row.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-brand-navy">{row.name}</span>
                      <span className="text-gray-500">{row.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-gold rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-4 text-center">No bookings yet</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brand-navy">Upcoming Trips</h2>
            <CalendarCheck className="w-5 h-5 text-brand-gold" />
          </div>
          <div className="space-y-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))
              : (stats?.upcoming_trips || []).map((b) => (
                <Link
                  key={b.booking_ref}
                  to="/admin/bookings"
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-brand-gold/40 hover:bg-brand-light/50 transition-all duration-200"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold text-brand-navy">{b.booking_ref}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {b.customer_name} · {b.destination}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-sm font-medium text-brand-navy">{formatDate(b.travel_date)}</p>
                    <Badge status={b.status}>{b.status_display || b.status}</Badge>
                  </div>
                </Link>
              ))}
            {!loading && !stats?.upcoming_trips?.length && (
              <p className="text-center text-gray-500 text-sm py-6">No upcoming trips</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brand-navy">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-sm text-brand-purple font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="pb-2 pr-3">Ref</th>
                  <th className="pb-2 pr-3">Customer</th>
                  <th className="pb-2 pr-3">Status</th>
                  <th className="pb-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={4} />)
                  : (stats?.recent_bookings || []).slice(0, 5).map((b) => (
                    <tr key={b.booking_ref} className="border-b border-gray-50">
                      <td className="py-2.5 pr-3 font-mono text-brand-navy font-semibold text-xs">
                        {b.booking_ref}
                      </td>
                      <td className="py-2.5 pr-3 truncate max-w-[120px]">{b.customer_name}</td>
                      <td className="py-2.5 pr-3">
                        <Badge status={b.status}>{b.status_display || b.status}</Badge>
                      </td>
                      <td className="py-2.5 text-gray-500 text-xs">{formatDateTime(b.created_at)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!loading && !stats?.recent_bookings?.length && (
              <p className="text-center text-gray-500 py-6 text-sm">No bookings yet</p>
            )}
          </div>
        </Card>
      </div>

      {!loading && stats?.recent_failed_emails?.length > 0 && (
        <Card className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-brand-navy">Recent Failed Emails</h2>
          </div>
          <div className="space-y-2">
            {stats.recent_failed_emails.map((email) => (
              <div
                key={email.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-xl bg-red-50 border border-red-100 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium text-brand-navy truncate">{email.subject}</p>
                  <p className="text-gray-500 text-xs">{email.recipient}</p>
                </div>
                <p className="text-red-600 text-xs shrink-0">{email.error_message || 'Send failed'}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </AdminLayout>
  );
}
