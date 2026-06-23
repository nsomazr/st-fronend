import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import BookingForm from '../../components/booking/BookingForm';
import { TAGLINE } from '../../utils/constants';

export default function Book() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-navy py-14 sm:py-20 px-4">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/90 to-brand-navy" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center max-w-2xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            Book Your Experience
          </h1>
          <p className="text-white/80 text-base sm:text-lg mb-2">{TAGLINE}</p>
          <p className="text-white/60 text-sm flex items-center justify-center gap-1">
            <MapPin className="w-4 h-4 text-brand-gold" />
            Based in Dar es Salaam, Tanzania
          </p>
        </motion.div>
      </section>

      <section className="py-10 sm:py-14 px-4 -mt-6 relative z-10">
        <BookingForm />
      </section>
    </>
  );
}
