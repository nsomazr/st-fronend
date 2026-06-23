import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import { adminApi } from '../../services/api';
import { formatDateTime } from '../../utils/formatters';

export default function AdminCustomers() {
  const [searchParams] = useSearchParams();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = search ? { search } : {};
      const { data } = await adminApi.customers(params);
      setCustomers(data.results || data);
    } catch {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  return (
    <AdminLayout title="Customers">
      <Card className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search name, email, phone, country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 text-sm"
          />
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Phone</th>
              <th className="pb-3 pr-4">Country</th>
              <th className="pb-3 pr-4">Joined</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              : customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-brand-light/50">
                  <td className="py-3 pr-4 font-semibold text-brand-navy">{c.full_name}</td>
                  <td className="py-3 pr-4">{c.email}</td>
                  <td className="py-3 pr-4">{c.phone}</td>
                  <td className="py-3 pr-4">{c.country}</td>
                  <td className="py-3 pr-4 text-gray-500">{formatDateTime(c.created_at)}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <a href={`mailto:${c.email}`}>
                        <Button size="sm" variant="outline"><Mail className="w-3.5 h-3.5" /></Button>
                      </a>
                      <a href={`tel:${c.phone}`}>
                        <Button size="sm" variant="outline"><Phone className="w-3.5 h-3.5" /></Button>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {!loading && !customers.length && (
          <p className="text-center text-gray-500 py-8">No customers found</p>
        )}
      </Card>
    </AdminLayout>
  );
}
