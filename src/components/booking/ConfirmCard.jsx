import { motion } from 'framer-motion';
import { CheckCircle, Mail, PartyPopper } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

export default function ConfirmCard({ booking }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto"
    >
      <Card className="text-center overflow-hidden p-0">
        <div className="bg-gradient-to-r from-brand-navy to-brand-purple px-6 py-8 text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <PartyPopper className="w-8 h-8 text-brand-navy" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">You&apos;re All Set!</h2>
          <p className="text-white/80 text-sm">Your adventure is one step closer</p>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
          <p className="text-3xl font-bold text-brand-navy mb-6 font-mono tracking-wide">
            {booking.booking_ref}
          </p>

          <div className="bg-brand-light rounded-xl p-5 mb-6 text-left space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-500 text-xs">Service</p>
                <p className="font-medium text-brand-navy">{booking.service_name || booking.service?.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Country</p>
                <p className="font-medium text-brand-navy">{booking.destination}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Travel Date</p>
                <p className="font-medium text-brand-navy">{formatDate(booking.travel_date)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Travelers</p>
                <p className="font-medium text-brand-navy">{booking.num_travelers}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6 bg-green-50 rounded-xl py-3 px-4">
            <Mail className="w-4 h-4 text-brand-gold shrink-0" />
            <span>Check your email for confirmation details</span>
          </div>

          <Link to="/">
            <Button variant="secondary" className="w-full sm:w-auto">
              <CheckCircle className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
