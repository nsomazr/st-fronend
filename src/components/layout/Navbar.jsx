import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { BRAND_NAME } from '../../utils/constants';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/book', label: 'Book Now' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt={BRAND_NAME} className="w-10 h-10 object-contain" />
            <div className="hidden sm:block">
              <span className="font-bold text-brand-navy text-lg leading-tight block">{BRAND_NAME}</span>
              <span className="text-xs text-brand-gold italic">Travel Smart, Travel Better</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-brand-navy text-white'
                      : 'text-brand-navy hover:bg-brand-light'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-brand-light transition-all duration-300"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6 text-brand-navy" /> : <Menu className="w-6 h-6 text-brand-navy" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive ? 'bg-brand-navy text-white' : 'text-brand-navy hover:bg-brand-light'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
