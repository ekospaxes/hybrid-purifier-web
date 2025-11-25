import React from 'react';
import { motion } from 'framer-motion';
import { Ruler, Zap, Wifi, Layers, Maximize, Clock } from 'lucide-react';
import { AnimatedTitle } from '../../../components/ui/AnimatedText'; // <--- IMPORT

const specs = [
  {
    label: "Physical Footprint",
    value: "1m x 1m",
    sub: "Height: 1.8m (Steel Frame)",
    icon: Ruler,
  },
  {
    label: "Power Architecture", // <--- UPDATED
    value: "500W Hybrid",      // <--- UPDATED
    sub: "Solar / Mains Switchable", // <--- UPDATED
    icon: Zap,
  },
  {
    label: "Fluid Capacity",
    value: "120 Liters",
    sub: "Food-grade Acrylic Columns",
    icon: Maximize,
  },
  {
    label: "Connectivity",
    value: "WiFi + MQTT",
    sub: "ESP32 / Arduino R4 Architecture",
    icon: Wifi,
  },
  {
    label: "Filtration Stack",
    value: "5-Stage Hybrid",
    sub: "Physical + Electrostatic + Biological",
    icon: Layers,
  },
  {
    label: "Service Life",
    value: "5+ Years",
    sub: "Modular Component Design",
    icon: Clock,
  },
];

const Specs = () => {
  return (
    <section className="py-24 px-6 bg-black relative border-t border-white/5">
      {/* CAD Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          
          {/* Animated Header */}
          <AnimatedTitle className="text-3xl md:text-5xl font-display font-bold text-white">
            Technical <span className="text-gray-600">Specifications.</span>
          </AnimatedTitle>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-right hidden md:block"
          >
            <span className="inline-block px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-eko-emerald">
              MODEL: CLASS X 120L
            </span>
          </motion.div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
          {specs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-black p-8 group hover:bg-white/5 transition-colors duration-500 relative"
            >
              {/* Corner Markers for CAD look */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="mb-4 text-gray-500 group-hover:text-eko-neon transition-colors">
                <item.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1 font-display">{item.value}</h3>
              <p className="text-sm font-medium text-gray-400 mb-1">{item.label}</p>
              <p className="text-xs text-gray-600 font-mono">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-8 text-[10px] text-gray-600 text-center max-w-2xl mx-auto"
        >
            * All performance figures based on Delhi test conditions. Results may vary (±15%) 
            Modular parts are replaceable. Contact engineering team for custom sizing.
        </motion.p>
      </div>
    </section>
  );
};

export default Specs;