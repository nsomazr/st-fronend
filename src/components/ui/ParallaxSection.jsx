import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export default function ParallaxSection({
  children,
  image,
  overlay = 'rgba(26,43,95,0.7)',
  speed = 0.35,
  className = '',
  contentClassName = '',
  minHeight = 'min-h-[70vh]',
  id,
}) {
  const ref = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], reducedMotion ? ['0%', '0%'] : [`-${speed * 100}%`, `${speed * 100}%`]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.85]);

  return (
    <section ref={ref} id={id} className={`relative overflow-hidden ${minHeight} ${className}`}>
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 -top-[15%] -bottom-[15%] will-change-transform"
      >
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage: `linear-gradient(${overlay}, ${overlay}), url('${image}')`,
          }}
        />
      </motion.div>
      <div className={`relative z-10 flex items-center ${contentClassName}`}>{children}</div>
    </section>
  );
}

export function ParallaxLayer({ children, speed = 50, className = '' }) {
  const ref = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [-speed, speed]
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
