import { MessageCircle } from 'lucide-react';
import { CONTACT } from '../../utils/constants';

export function WhatsAppLink({ className = '', children }) {
  return (
    <a
      href={CONTACT.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

export default function WhatsAppFloat() {
  return (
    <WhatsAppLink
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#25D366] text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 font-semibold text-sm"
    >
      <MessageCircle className="w-5 h-5 shrink-0" />
      <span className="hidden sm:inline">Let&apos;s chat on WhatsApp</span>
      <span className="sm:hidden">WhatsApp</span>
    </WhatsAppLink>
  );
}
