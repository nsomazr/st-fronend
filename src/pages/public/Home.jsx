import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, BadgeDollarSign, Heart, Headphones,
  Phone, Mail, MapPin,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ParallaxSection, { ParallaxLayer } from '../../components/ui/ParallaxSection';
import ImageSlider from '../../components/ui/ImageSlider';
import HeroSlider from '../../components/ui/HeroSlider';
import ServiceCard from '../../components/ui/ServiceCard';
import { ServiceCardSkeleton } from '../../components/ui/Skeleton';
import { useServices } from '../../hooks/useServices';
import {
  BRAND_NAME, TAGLINE, STATS, WHY_CHOOSE_US, TESTIMONIALS, CONTACT, PREVIOUS_TOURS, HERO_SLIDES,
  FALLBACK_SERVICES,
} from '../../utils/constants';

const iconMap = {
  compass: Compass,
  'badge-dollar-sign': BadgeDollarSign,
  heart: Heart,
  headphones: Headphones,
};

function getIcon(name) {
  const Icon = iconMap[name] || Compass;
  return <Icon className="w-7 h-7" />;
}

export default function Home() {
  const { services, loading } = useServices();
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <HeroSlider slides={HERO_SLIDES}>
        {({ current }) => (
          <div className="text-center px-4 sm:px-6 max-w-4xl mx-auto pt-16 pb-32 sm:pb-36">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-brand-gold font-semibold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4"
            >
              {BRAND_NAME}, Est. 2025
            </motion.p>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45 }}
              >
                <p className="hidden sm:inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-4">
                  {current.destination}
                </p>
                <p className="text-brand-gold/90 text-sm sm:text-base font-medium mb-2">{current.label}</p>
              </motion.div>
            </AnimatePresence>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl min-[480px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-3 sm:mb-4 leading-[1.1]"
            >
              {TAGLINE}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto px-2"
            >
              Your trusted partner for unforgettable journeys. Expert consultancy, ticketing, visas, and holiday planning.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col min-[480px]:flex-row gap-3 sm:gap-4 justify-center items-stretch min-[480px]:items-center px-4 sm:px-0"
            >
              <Link to="/book" className="w-full min-[480px]:w-auto">
                <Button size="lg" className="w-full min-[480px]:w-auto">Book Now</Button>
              </Link>
              <Link to="/services" className="w-full min-[480px]:w-auto">
                <Button size="lg" variant="outline" className="w-full min-[480px]:w-auto !text-white !border-white hover:!bg-white hover:!text-brand-navy">
                  Our Services
                </Button>
              </Link>
            </motion.div>
          </div>
        )}
      </HeroSlider>

      {/* Stats */}
      <section className="relative -mt-6 sm:-mt-10 z-20 max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl grid grid-cols-1 min-[480px]:grid-cols-3 divide-y min-[480px]:divide-y-0 min-[480px]:divide-x divide-gray-100"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="py-5 sm:py-6 px-4 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-brand-navy">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Previous Tours Slider */}
      <section id="tours" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <ParallaxLayer speed={25} className="text-center mb-8 sm:mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-brand-purple font-semibold text-sm uppercase tracking-widest"
          >
            Our Portfolio
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy mt-2 mb-3"
          >
            Previous Tours
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-2"
          >
            Explore destinations we&apos;ve crafted for happy travelers. Swipe or use arrows to browse.
          </motion.p>
        </ParallaxLayer>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <ImageSlider items={PREVIOUS_TOURS} />
        </motion.div>
      </section>

      {/* Parallax CTA banner */}
      <ParallaxSection
        image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
        overlay="rgba(26,43,95,0.78)"
        speed={0.25}
        minHeight="min-h-[50vh] sm:min-h-[60vh]"
        contentClassName="w-full justify-center py-16 sm:py-20 px-4 sm:px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-white/80 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
            Let us plan your dream trip with personalized itineraries and expert support every step of the way.
          </p>
          <Link to="/book">
            <Button size="lg">Start Planning Today</Button>
          </Link>
        </motion.div>
      </ParallaxSection>

      {/* Services */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <ParallaxLayer speed={20} className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy mb-3">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Comprehensive travel solutions tailored to your needs
          </p>
        </ParallaxLayer>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {loading && services.length === 0
            ? Array.from({ length: 4 }).map((_, i) => <ServiceCardSkeleton key={i} withImage />)
            : (services.length > 0 ? services : FALLBACK_SERVICES).map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <ParallaxSection
        image="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80"
        overlay="rgba(26,43,95,0.88)"
        speed={0.3}
        minHeight="min-h-0"
        contentClassName="w-full py-16 sm:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-10 sm:mb-12"
          >
            Why Choose Us
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {WHY_CHOOSE_US.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center p-5 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  i % 2 === 0 ? 'bg-brand-gold/20 text-brand-gold' : 'bg-brand-purple/30 text-brand-purple'
                }`}>
                  {getIcon(item.icon)}
                </div>
                <h3 className="font-bold text-white text-base sm:text-lg mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mb-8 sm:mb-10">What Our Clients Say</h2>
        <motion.div
          key={testimonialIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="mx-2 sm:mx-0">
            <p className="text-gray-600 italic text-base sm:text-lg mb-4 leading-relaxed">
              &ldquo;{TESTIMONIALS[testimonialIdx].text}&rdquo;
            </p>
            <p className="font-semibold text-brand-navy">{TESTIMONIALS[testimonialIdx].name}</p>
            <p className="text-sm text-gray-500">{TESTIMONIALS[testimonialIdx].location}</p>
          </Card>
        </motion.div>
        <div className="flex justify-center gap-2 mt-5">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setTestimonialIdx(i)}
              aria-label={`Testimonial ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === testimonialIdx ? 'w-8 bg-brand-gold' : 'w-2.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Contact Strip */}
      <section className="bg-brand-gold py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 lg:gap-12 text-brand-navy text-center sm:text-left">
          <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-2 font-semibold text-sm sm:text-base hover:opacity-80 transition-all duration-300">
            <Phone className="w-5 h-5 shrink-0" /> {CONTACT.phone}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 font-semibold text-sm sm:text-base hover:opacity-80 transition-all duration-300 break-all sm:break-normal">
            <Mail className="w-5 h-5 shrink-0" /> {CONTACT.email}
          </a>
          <div className="flex items-start sm:items-center gap-2 font-semibold text-sm sm:text-base max-w-xs sm:max-w-none">
            <MapPin className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" />
            <span>{CONTACT.address}</span>
          </div>
        </div>
      </section>
    </>
  );
}
