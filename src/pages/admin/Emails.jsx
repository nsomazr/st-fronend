import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import { adminApi } from '../../services/api';
import { formatDateTime } from '../../utils/formatters';

export default function AdminEmails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const statusFilter = searchParams.get('status') || '';

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const { data } = await adminApi.emails(params);
      setEmails(data.results || data);
    } catch {
      toast.error('Failed to load email logs');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const setStatus = (status) => {
    if (status) setSearchParams({ status });
    else setSearchParams({});
  };

  return (
    <AdminLayout title="Email Logs">
      <Card className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { value: '', label: 'All' },
            { value: 'sent', label: 'Sent' },
            { value: 'failed', label: 'Failed' },
          ].map((opt) => (
            <button
              key={opt.value || 'all'}
              type="button"
              onClick={() => setStatus(opt.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                statusFilter === opt.value
                  ? 'bg-brand-navy text-white'
                  : 'bg-white border border-gray-200 text-brand-navy hover:border-brand-gold'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Recipient</th>
              <th className="pb-3 pr-4">Subject</th>
              <th className="pb-3 pr-4">Sent At</th>
              <th className="pb-3">Error</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
              : emails.map((email) => (
                <tr key={email.id} className="border-b border-gray-50 hover:bg-brand-light/50">
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center gap-1.5">
                      {email.status === 'sent' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <Badge status={email.status === 'sent' ? 'confirmed' : 'cancelled'}>
                        {email.status_display || email.status}
                      </Badge>
                    </span>
                  </td>
                  <td className="py-3 pr-4">{email.recipient}</td>
                  <td className="py-3 pr-4 max-w-xs truncate">{email.subject}</td>
                  <td className="py-3 pr-4 text-gray-500">{formatDateTime(email.sent_at)}</td>
                  <td className="py-3 text-red-600 text-xs max-w-xs truncate">
                    {email.error_message || '—'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {!loading && !emails.length && (
          <p className="text-center text-gray-500 py-8">No emails logged yet</p>
        )}
      </Card>
    </AdminLayout>
  );
}
