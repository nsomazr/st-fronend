import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const SWIPE_THRESHOLD = 50;

export default function HeroSlider({
  slides,
  autoPlayMs = 6000,
  children,
}) {
  const sectionRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], reducedMotion ? ['0%', '0%'] : ['0%', '25%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], reducedMotion ? [1, 1] : [1, 1.12]);
  const thumbY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, 60]);
  const contentY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -35]);

  const goTo = useCallback((next) => {
    setIndex((next + count) % count);
  }, [count]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || count <= 1) return undefined;
    const timer = setInterval(next, autoPlayMs);
    return () => clearInterval(timer);
  }, [paused, next, autoPlayMs, count]);

  const current = slides[index];

  const fadeVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Parallax background slider */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 -top-[15%] -bottom-[15%] will-change-transform origin-center"
      >
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={current.id}
            initial="enter"
            animate="center"
            exit="exit"
            variants={fadeVariants}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <motion.img
              src={current.image}
              alt={current.label}
              className="absolute inset-0 w-full h-full object-cover"
              initial={reducedMotion ? {} : { scale: 1 }}
              animate={reducedMotion ? {} : { scale: 1.08 }}
              transition={{ duration: autoPlayMs / 1000 + 2, ease: 'linear' }}
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/55 to-brand-navy/85" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Floating orbs */}
      <motion.div
        style={{ y: orbY1 }}
        className="absolute top-24 right-[12%] w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-brand-gold/15 blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ y: orbY2 }}
        className="absolute bottom-40 left-[10%] w-28 h-28 sm:w-44 sm:h-44 rounded-full bg-brand-purple/20 blur-3xl pointer-events-none"
      />

      {/* Slide label chip — top on mobile, integrated in content on desktop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-20 sm:hidden"
        >
          <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
            {current.destination}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full"
      >
        {typeof children === 'function' ? children({ current, index, count }) : children}
      </motion.div>

      {/* Nav arrows */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-brand-gold hover:text-brand-navy hover:border-brand-gold transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-brand-gold hover:text-brand-navy hover:border-brand-gold transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Scroll hint */}
      <motion.a
        href="#tours"
        style={{ opacity: scrollHintOpacity }}
        className="absolute bottom-[7.5rem] sm:bottom-[8.5rem] left-1/2 -translate-x-1/2 z-20 text-white/70 hover:text-brand-gold transition-colors animate-bounce"
        aria-label="Scroll to tours"
      >
        <ArrowDown className="w-6 h-6" />
      </motion.a>

      {/* Bottom bar: dots + thumbnail strip with parallax */}
      <motion.div
        style={{ y: thumbY, opacity: scrollHintOpacity }}
        className="absolute bottom-6 sm:bottom-10 left-0 right-0 z-20 px-4 sm:px-8"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Dots */}
          <div className="flex items-center gap-2 order-2 sm:order-1">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to ${slide.label}`}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-500 ${
                  i === index
                    ? 'w-8 h-2 bg-brand-gold'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Mini thumbnail slider */}
          <div
            className="flex gap-2 sm:gap-3 order-1 sm:order-2 overflow-x-auto max-w-full pb-1 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(i)}
                className={`relative shrink-0 overflow-hidden rounded-lg sm:rounded-xl transition-all duration-500 ${
                  i === index
                    ? 'w-16 h-11 sm:w-24 sm:h-16 ring-2 ring-brand-gold ring-offset-2 ring-offset-transparent scale-105'
                    : 'w-14 h-10 sm:w-20 sm:h-14 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={slide.image}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className={`absolute inset-0 ${i === index ? 'bg-transparent' : 'bg-brand-navy/40'}`} />
                {i === index && (
                  <span className="absolute bottom-0.5 left-0 right-0 text-[8px] sm:text-[10px] text-white font-semibold text-center truncate px-0.5 hidden sm:block">
                    {slide.destination.split(',')[0]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Swipe layer for mobile — below controls */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.x < -SWIPE_THRESHOLD) next();
          else if (info.offset.x > SWIPE_THRESHOLD) prev();
        }}
        className="absolute inset-0 z-[5] cursor-grab active:cursor-grabbing pointer-events-auto md:pointer-events-none"
        style={{ touchAction: 'pan-y' }}
      />
    </section>
  );
}
