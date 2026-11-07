
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import loaderImage from '../../assets/images/loader.png';

export default function SplashScreen({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="
        fixed inset-0 z-[99999]
        flex min-h-screen items-center justify-center
        overflow-hidden
        bg-gradient-to-br
        from-[#65a943]
        via-[#b8d957]
        to-[#f59a38]
      "
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{
        duration: 1,
        ease: [0.76, 0, 0.24, 1],
      }}
      role="status"
      aria-label="Loading NagarBondhu"
    >
      {/* Soft gradient lighting */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr
        from-[#3e913e]/20 via-transparent to-[#ffbd59]/30"
      />

      {/* Logo and brand name */}
      <div className="relative z-10 flex flex-col items-center">

        <motion.h1
  lang="bn"
  className="
    mt-5
    text-4xl sm:text-5xl md:text-6xl
    font-bold
    tracking-wide
    text-[#174b2a]
    drop-shadow-sm
  "
  style={{
    fontFamily: "'Hind Siliguri', sans-serif",
  }}
  initial={{
    opacity: 0,
    y: 20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    delay: 0.25,
    duration: 0.8,
    ease: [0.22, 1, 0.36, 1],
  }}
>
  নগর বন্ধু
</motion.h1>

        <motion.img
          src={loaderImage}
          alt="NagarBondhu"
          className="
            block
            h-36 w-36
            object-contain
            sm:h-44 sm:w-44
            md:h-48 md:w-48
          "
          initial={{
            opacity: 0,
            scale: 0.8,
            y: 25,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

       

      </div>
    </motion.div>
  );
}
