import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BRAND_NAME, CONTACT, TAGLINE } from '../../utils/constants';
import { WhatsAppLink } from '../ui/WhatsAppChat';

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt={BRAND_NAME} className="w-10 h-10 object-contain" />
              <div>
                <h3 className="font-bold text-lg">{BRAND_NAME}</h3>
                <p className="text-brand-gold text-sm italic">{TAGLINE}</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Your trusted travel consultancy partner since 2025. We make every journey memorable.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-brand-gold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { to: '/services', label: 'Our Services' },
                { to: '/book', label: 'Book a Trip' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-white/70 hover:text-brand-gold text-sm transition-all duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-brand-gold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a href={`tel:${CONTACT.phoneTel}`} className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-all duration-300">
                <Phone className="w-4 h-4 text-brand-gold" />
                {CONTACT.phoneDisplay}
              </a>
              <WhatsAppLink className="flex items-center gap-2 text-white/70 hover:text-[#25D366] text-sm transition-all duration-300">
                <MessageCircle className="w-4 h-4 text-brand-gold" />
                Let&apos;s chat on WhatsApp
              </WhatsAppLink>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-all duration-300">
                <Mail className="w-4 h-4 text-brand-gold" />
                {CONTACT.email}
              </a>
              <div className="flex items-start gap-2 text-white/70 text-sm">
                <MapPin className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                {CONTACT.address}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/50 text-sm">
          <p>&copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
          <Link
            to="/admin"
            className="text-white/40 hover:text-brand-gold transition-all duration-300"
          >
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
