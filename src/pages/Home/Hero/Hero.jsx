import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Wind, Zap, Activity, Sun } from 'lucide-react';
import NeonGrid from '../../../components/ui/NeonGrid';
import { AnimatedTitle } from '../../../components/ui/AnimatedText';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      <NeonGrid />

      {/* Floating "Live Simulation" Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute top-24 md:top-28 px-4 py-1.5 rounded-full border border-eko-neon/30 bg-eko-deep/80 backdrop-blur-md flex items-center gap-3 z-20"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eko-neon opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-eko-neon"></span>
        </span>
        <span className="text-[10px] font-mono font-bold text-eko-neon tracking-widest uppercase">
          LIVE SIMULATION • DIGITAL TWIN ACTIVE
        </span>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center mt-10">
        
        {/* Main Headline - Animated */}
        <div className="mb-2">
           <AnimatedTitle className="text-5xl md:text-9xl font-display font-bold tracking-tighter text-white">
             BREATHE
           </AnimatedTitle>
        </div>
        <div className="mb-8">
           <AnimatedTitle className="text-5xl md:text-9xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
             INTELLIGENCE
           </AnimatedTitle>
        </div>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 font-light"
        >
          The <span className="text-eko-emerald font-medium">Class X 120L</span> Hybrid Photobioreactor. 
          <br className="hidden md:block" />
          A bio-engineered lung for the urban home.
          <span className="block mt-4 text-xs font-mono text-eko-neon/80 border border-eko-neon/20 bg-eko-neon/5 py-2 px-4 rounded max-w-max mx-auto">
            RENEWABLE ENERGY • ZERO WASTE • AI OPTIMIZED
          </span>
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col md:flex-row gap-4 justify-center items-center"
        >
          <button className="group relative px-8 py-4 bg-eko-emerald text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center gap-2">
              Launch Simulator <Activity className="w-4 h-4" />
            </span>
          </button>
          
          <button className="px-8 py-4 text-white border border-white/20 rounded-full hover:bg-white/5 transition-all font-medium backdrop-blur-md">
            View Technical Specs
          </button>
        </motion.div>
      </div>

      {/* Bottom Stats - Updated for Solar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 w-full px-6"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center border-t border-white/5 pt-6">
          {[
            { label: 'PM2.5 REMOVAL', val: '99.9%', icon: Wind },
            { label: 'O₂ GENERATION', val: '64g/day', icon: Zap },
            { label: 'SOLAR READY', val: '500W', icon: Sun }, // <--- Updated
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <stat.icon className="w-4 h-4 text-eko-lime opacity-80" />
              <span className="text-xl md:text-2xl font-mono font-bold text-white">{stat.val}</span>
              <span className="text-[10px] text-gray-500 tracking-widest uppercase">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;