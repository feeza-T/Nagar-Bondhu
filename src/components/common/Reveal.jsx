import { motion } from 'framer-motion';

// Fades content in once when it scrolls into view. Use `delay` for a stagger.
export default function Reveal({ children, delay = 0, x = 0, y = 24, className = '' }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, x, y }} whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}
