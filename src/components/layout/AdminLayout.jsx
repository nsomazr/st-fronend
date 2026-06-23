import { Link, useLocation } from 'react-router-dom';
import {
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  List,
  LogOut,
  Mail,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BRAND_NAME } from '../../utils/constants';

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/bookings', label: 'Bookings', icon: List },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/emails', label: 'Email Logs', icon: Mail },
];

export default function AdminLayout({ children, title, badge }) {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-brand-light flex">
      <aside className="hidden lg:flex w-64 bg-brand-navy text-white flex-col shrink-0">
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt={BRAND_NAME} className="w-9 h-9 object-contain" />
            <div>
              <p className="font-bold text-sm leading-tight">{BRAND_NAME}</p>
              <p className="text-white/50 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-brand-gold text-brand-navy'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {to === '/admin/bookings' && badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/75 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4" /> View Site
          </a>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/75 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="bg-brand-navy text-white px-4 py-4 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <img src="/logo.png" alt="" className="w-8 h-8 object-contain shrink-0" />
              <span className="font-bold text-sm truncate">{title || 'Admin'}</span>
            </div>
            <button type="button" onClick={logout} className="text-white/80 hover:text-brand-gold">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${
                  location.pathname === to
                    ? 'bg-brand-gold text-brand-navy'
                    : 'bg-white/10 text-white/80'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
          {title && (
            <div className="hidden lg:flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-brand-navy">{title}</h1>
              {badge > 0 && location.pathname !== '/admin/bookings' && (
                <Link
                  to="/admin/bookings?status=pending"
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-navy bg-amber-100 px-4 py-2 rounded-xl"
                >
                  <CalendarDays className="w-4 h-4" />
                  {badge} pending booking{badge !== 1 ? 's' : ''}
                </Link>
              )}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
