import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react';

const SWIPE_THRESHOLD = 50;

export default function ImageSlider({
  items,
  autoPlayMs = 5000,
  className = '',
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  const goTo = useCallback((next, dir) => {
    setDirection(dir);
    setIndex((next + count) % count);
  }, [count]);

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  useEffect(() => {
    if (paused || count <= 1) return undefined;
    const timer = setInterval(next, autoPlayMs);
    return () => clearInterval(timer);
  }, [paused, next, autoPlayMs, count]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const current = items[index];

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-brand-navy aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
        <AnimatePresence custom={direction} mode="popLayout" initial={false}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) next();
              else if (info.offset.x > SWIPE_THRESHOLD) prev();
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover"
              loading="lazy"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-10 text-white">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-gold text-brand-navy text-xs font-bold uppercase tracking-wide mb-3">
                Previous Tour
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2">{current.title}</h3>
              <p className="text-white/80 text-sm sm:text-base max-w-2xl mb-4 line-clamp-2 sm:line-clamp-none">
                {current.description}
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm text-white/90">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
                  {current.destination}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-gold shrink-0" />
                  {current.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-brand-gold shrink-0" />
                  {current.travelers} travelers
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous tour"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 text-brand-navy flex items-center justify-center shadow-lg hover:bg-brand-gold transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next tour"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 text-brand-navy flex items-center justify-center shadow-lg hover:bg-brand-gold transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to ${item.title}`}
              onClick={() => goTo(i, i > index ? 1 : -1)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? 'w-8 bg-brand-gold' : 'w-2 bg-gray-300 hover:bg-brand-purple/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip — hidden on small mobile */}
      <div className="hidden sm:grid grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => goTo(i, i > index ? 1 : -1)}
            className={`relative overflow-hidden rounded-xl aspect-[4/3] transition-all duration-300 ${
              i === index ? 'ring-2 ring-brand-gold ring-offset-2 scale-[1.02]' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-brand-navy/20" />
            <span className="absolute bottom-1 left-1 right-1 text-[10px] sm:text-xs text-white font-medium truncate">
              {item.destination.split(',')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
