import React from 'react';
import { motion } from 'framer-motion';

const NeonGrid = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Deep Atmosphere Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-eko-deep to-black opacity-90 z-10" />
      
      {/* The Moving Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] [mask-image:linear-gradient(to_bottom,transparent,black)]"
        style={{
            transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) scale(2)',
        }}
      />
      
      {/* Central Glow (The Reactor Core Vibe) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-eko-emerald/10 rounded-full blur-[150px] z-0" />
    </div>
  );
};

export default NeonGrid;