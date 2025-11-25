import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedTitle = ({ children, className }) => {
  return (
    <div className="overflow-hidden">
      <motion.h2
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.h2>
    </div>
  );
};

export const AnimatedText = ({ children, className, delay = 0 }) => {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.p>
  );
};