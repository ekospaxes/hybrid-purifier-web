import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Recycle, Calendar, Download } from 'lucide-react';
import GlassCard from '../../../components/ui/GlassCard';
import { AnimatedTitle, AnimatedText } from '../../../components/ui/AnimatedText'; // <--- IMPORT

// ... (Keep 'stats', 'maintenance', 'AnimatedRing', 'handleDownloadCSV' EXACTLY the same) ...

// Copy the helper functions (AnimatedRing, handleDownloadCSV) and constants from previous step here
// I am omitting them for brevity, but YOU MUST KEEP THEM in the file.

/* ... CONSTANTS & HELPERS HERE ... */
const stats = [
    { label: "CO₂ Fixation", value: "0.71", unit: "g/L/day", sub: "7.66 kg per 90-day cycle", icon: Leaf, color: "text-eko-emerald", percent: 75 },
    { label: "Biomass Yield", value: "472", unit: "g (dry)", sub: "60% Protein Content", icon: Recycle, color: "text-eko-lime", percent: 60 },
    { label: "Water Recovery", value: "100%", unit: "Recycled", sub: "Zero toxic waste output", icon: Droplets, color: "text-blue-400", percent: 100 }
];
const maintenance = [
    { task: "HEPA Replacement", freq: "Every 30 Days", note: "(At Delhi Levels)" },
    { task: "pH Probe Calibration", freq: "Every 2 Weeks", note: "Automated Alert" },
    { task: "Algae Harvest", freq: "Every 4-6 Weeks", note: "Dry & Weigh Process" },
];
const AnimatedRing = ({ percent }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;
    return (
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
          <motion.circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} whileInView={{ strokeDashoffset: strokeDashoffset }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} strokeLinecap="round" className="text-eko-emerald drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
        </svg>
        <span className="absolute text-[10px] font-mono text-eko-emerald">{percent}%</span>
      </div>
    );
};
const handleDownloadCSV = () => { /* ... keep logic ... */ };


const Impact = () => {
  return (
    <section className="relative py-32 px-6 bg-eko-bg overflow-hidden" id="impact">
      
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-eko-emerald/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT SIDE */}
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-eko-emerald mb-4"
          >
            <Recycle className="w-5 h-5" />
            <span className="font-mono text-sm tracking-widest uppercase">ECOLOGICAL IMPACT</span>
          </motion.div>
          
          {/* Animated Gradient Header */}
          <div className="overflow-hidden mb-6">
            <motion.h2 
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-6xl font-display font-bold text-white leading-tight"
            >
                Efficiency of a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-eko-emerald to-eko-lime">
                Micro-Forest.
                </span>
            </motion.h2>
          </div>
          
          <AnimatedText className="text-gray-400 text-lg leading-relaxed mb-10" delay={0.2}>
            The Class X 120L system doesn't just filter air; it transforms it. 
            By utilizing <i>Chlorella pyrenoidosa</i>, we achieve carbon capture rates 
            that rival mature trees in a fraction of the footprint.
          </AnimatedText>

          {/* Maintenance (Keep same) */}
          <div className="space-y-4">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" /> 
              Maintenance Schedule
            </h4>
            {maintenance.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-eko-emerald/30 transition-colors cursor-default"
              >
                <div className="w-2 h-2 rounded-full bg-eko-emerald shadow-[0_0_8px_#10B981]" />
                <div className="flex-1">
                  <span className="text-gray-200 text-sm font-medium block">{item.task}</span>
                  <span className="text-gray-500 text-xs">{item.note}</span>
                </div>
                <div className="text-eko-neon font-mono text-xs bg-eko-deep px-2 py-1 rounded border border-eko-emerald/20">
                  {item.freq}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE (Keep same) */}
        <div className="relative">
          <div className="grid grid-cols-1 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <GlassCard className="p-8 flex items-center justify-between hover:border-eko-emerald/50 group">
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span className="font-mono text-xs uppercase tracking-wider">{stat.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-display font-bold text-white group-hover:text-eko-emerald transition-colors duration-300">
                        {stat.value}
                      </span>
                      <span className="text-gray-500 font-medium">{stat.unit}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2 pl-1 border-l-2 border-white/10">
                      {stat.sub}
                    </p>
                  </div>
                  <AnimatedRing percent={stat.percent} />
                </GlassCard>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-6 text-center"
            >
              <button 
                onClick={handleDownloadCSV}
                className="group flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-eko-emerald/10 hover:border-eko-emerald/30 transition-all text-sm text-gray-400 hover:text-white"
              >
                <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                <span>Download Research Data (CSV)</span>
              </button>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Impact;