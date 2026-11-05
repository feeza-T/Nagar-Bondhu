import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogoMark } from '../common/Logo';

// Dark-green intro. Shows once per session, then slides UP and away.
export default function SplashScreen({ onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2200);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-forest via-[#1b3322] to-ink"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      role="status"
      aria-label="Loading NagarBondhu"
    >
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
        <LogoMark className="h-20 w-20" />
      </motion.div>

      {/* The Bangla name is intentionally fixed here (brand mark), always in Hind Siliguri */}
      <motion.h1
        lang="bn"
        className="mt-6 text-5xl font-bold text-white sm:text-6xl"
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        নগর বন্ধু
      </motion.h1>

      <div className="mt-10 h-1 w-48 overflow-hidden rounded-full bg-white/15">
        <motion.div
          className="h-full bg-brand"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.9, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}