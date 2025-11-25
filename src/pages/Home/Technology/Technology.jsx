import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Zap, Shield, Sun, Leaf, ArrowDown } from 'lucide-react';
import GlassCard from '../../../components/ui/GlassCard';
import { AnimatedTitle, AnimatedText } from '../../../components/ui/AnimatedText'; // <--- IMPORT

const stages = [
  {
    id: "01",
    title: "Cyclone Pre-Separator",
    desc: "Passive centrifugal force removes large dust particles (>50µm). Low maintenance first line of defense.",
    icon: Wind,
    color: "text-gray-400"
  },
  {
    id: "02",
    title: "Electrostatic Precipitator (ESP)",
    desc: "6–8kV DC field captures fine PM1–PM2.5 particles on washable stainless steel plates.",
    icon: Zap,
    color: "text-yellow-400"
  },
  {
    id: "03",
    title: "HEPA H13 Filter",
    desc: "Medical-grade final barrier removing 99.97% of particles @ 0.3µm.",
    icon: Shield,
    color: "text-blue-400"
  },
  {
    id: "04",
    title: "PCO Chamber",
    desc: "Photocatalytic Oxidation destroys VOCs (Benzene, Formaldehyde) using UV-A light and TiO₂.",
    icon: Sun,
    color: "text-orange-400"
  },
  {
    id: "05",
    title: "Hybrid Photobioreactor",
    desc: "120L of Chlorella pyrenoidosa algae consumes CO₂ and generates fresh Oxygen.",
    icon: Leaf,
    color: "text-eko-emerald" 
  }
];

const Technology = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden bg-black">
      
      {/* Background Lighting Effect */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-eko-deep rounded-full blur-[120px] -z-10 opacity-60" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-eko-emerald/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto relative">
        
        {/* Section Header - ANIMATED NOW */}
        <div className="text-center mb-24 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-eko-emerald font-mono text-sm tracking-widest mb-4"
          >
            ARCHITECTURE
          </motion.h2>
          
          {/* Animated Headline */}
          <AnimatedTitle className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
            How It Works.
          </AnimatedTitle>
          
          {/* Animated Description */}
          <AnimatedText className="text-gray-400 mt-6 max-w-2xl mx-auto" delay={0.2}>
            A vertical 5-stage purification chain designed for maximum efficiency.
            <br />From gross particle separation to biological gas exchange.
          </AnimatedText>
        </div>

        {/* The Pipeline Container */}
        <div className="relative">
          
          {/* --- THE PERMANENT NEON LINE --- */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 z-0">
             <div className="absolute inset-0 bg-white/5 w-full h-full" />
             <motion.div 
               initial={{ height: "0%" }}
               whileInView={{ height: "100%" }}
               viewport={{ once: true }} 
               transition={{ duration: 2.5, ease: "easeInOut" }}
               className="w-full bg-gradient-to-b from-eko-emerald via-eko-neon to-eko-emerald shadow-[0_0_20px_rgba(0,255,156,0.6)]"
             />
          </div>

          {/* Render Each Stage */}
          <div className="space-y-12 md:space-y-24 relative z-10">
            {stages.map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* 1. Text Side */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-left" : "md:text-right"} pl-12 md:pl-0`}>
                  <div className="flex items-center gap-4 mb-2 md:hidden">
                    <span className="font-mono text-eko-neon text-xl">{stage.id}</span>
                    <stage.icon className={`w-6 h-6 ${stage.color}`} />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">{stage.title}</h4>
                  <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                    {stage.desc}
                  </p>
                </div>

                {/* 2. Center Node */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-black border border-eko-neon/50 z-10 shadow-[0_0_20px_rgba(0,255,156,0.5)]">
                  <div className="w-2 h-2 bg-eko-neon rounded-full animate-pulse shadow-[0_0_10px_#00ff9c]" />
                </div>

                {/* 3. Card Side */}
                <div className="flex-1 w-full pl-12 md:pl-0">
                  <GlassCard hoverEffect={true} className="p-6 md:p-8 flex items-center gap-6 group cursor-default">
                    <div className="bg-white/5 p-4 rounded-full border border-white/10 group-hover:border-eko-emerald/30 transition-colors">
                      <stage.icon className={`w-8 h-8 ${stage.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    <div>
                      <span className="block font-mono text-xs text-gray-500 mb-1">STAGE {stage.id}</span>
                      <span className="text-gray-200 font-medium group-hover:text-white transition-colors">
                        {stage.title.split(' ')[0]} Module
                      </span>
                    </div>
                    <div className="ml-auto opacity-20">
                        <ArrowDown size={16} />
                    </div>
                  </GlassCard>
                </div>

              </motion.div>
            ))}
          </div>

          <div className="absolute left-4 md:left-1/2 bottom-[-40px] -translate-x-1/2 flex flex-col items-center gap-2 z-10">
            <div className="w-1 h-8 bg-gradient-to-b from-eko-emerald to-transparent opacity-50" />
            <span className="text-[10px] font-mono text-eko-neon uppercase tracking-widest shadow-green-900">Clean Air</span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Technology;