import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, x: -50, scale: 0.98 },
  in: { opacity: 1, x: 0, scale: 1 },
  out: { opacity: 0, x: 50, scale: 1.02 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

const AnimatedPage = ({ children  } :  {children  : React.ReactNode}) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    //@ts-ignore
    transition={pageTransition}
    style={{ height: '100%' }} // optional, adjust layout
  >
    {children}
  </motion.div>
);

export default AnimatedPage;
