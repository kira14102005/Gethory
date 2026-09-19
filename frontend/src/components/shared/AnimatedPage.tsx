// src/components/shared/AnimatedPage.tsx
import React from "react";
import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    x  : -100,
    scale: 0.98,
    rotate: 0
  },
  in: {
    opacity: 1,
    x  : 0,
    scale: 1,
    rotate: 0
  },
  out: {
    opacity: 0,
    x : 100,
    scale: 1.01,
    rotate: 0
  }
};

const pageTransition = {
  type: "spring",
  stiffness: 90,
  damping: 15
};

const AnimatedPage = ({ children } :  {children : React.ReactNode}) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="in"
    exit="out"
    //@ts-ignore
    transition={pageTransition}
    style={{ minHeight: "100vh" }}
  >
    {children}
  </motion.div>
);

export default AnimatedPage;
