import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Leaf, Wind, Database, Globe } from 'lucide-react';

// --- CONFIGURATION ---
const nodes = [
  {
    id: 'bio',
    title: 'Bio-Logic',
    desc: 'Chlorella Pyrenoidosa',
    icon: Leaf,
    color: '#10B981', // Emerald
    x: '20%', y: '20%', 
    delay: 0.2
  },
  {
    id: 'aero',
    title: 'Aero-Dynamics',
    desc: 'Cyclonic Intake',
    icon: Wind,
    color: '#3b82f6', // Blue
    x: '80%', y: '20%', 
    delay: 0.4
  },
  {
    id: 'digital',
    title: 'Digital Twin',
    desc: 'MQTT Telemetry',
    icon: Database,
    color: '#f59e0b', // Amber
    x: '20%', y: '80%', 
    delay: 0.6
  },
  {
    id: 'impact',
    title: 'Global Impact',
    desc: 'Carbon Network',
    icon: Globe,
    color: '#8b5cf6', // Violet
    x: '80%', y: '80%', 
    delay: 0.8
  }
];

// --- COMPONENTS ---

const GlowingLine = ({ start, end, color, delay }) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
      <motion.path
        d={`M ${start.x} ${start.y} C ${start.x} 50, ${end.x} 50, ${end.x} ${end.y}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.6 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: delay, ease: "easeInOut" }}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
    </svg>
  );
};

const MapNode = ({ node, isCenter = false }) => {
  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ left: node.x, top: node.y }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: node.delay, type: "spring", stiffness: 100 }}
    >
      <div className={`relative flex flex-col items-center group cursor-pointer`}>
        
        {/* Icon Circle */}
        <div 
          className={`w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-white/30`}
          style={{ 
            boxShadow: isCenter 
              ? `0 0 50px ${node.color}30, inset 0 0 20px ${node.color}20`
              : `0 0 0 1px ${node.color}20`
          }}
        >
          <node.icon 
            size={isCenter ? 40 : 28} 
            className="text-white/80 transition-colors duration-300"
            style={{ color: isCenter ? 'white' : node.color }}
          />
          
          {/* Ripple Effect for Center */}
          {isCenter && (
            <>
              <div className="absolute inset-0 rounded-full border border-eko-emerald/30 animate-ping opacity-20" />
              <div className="absolute -inset-4 rounded-full border border-eko-emerald/10 animate-pulse" />
            </>
          )}
        </div>

        {/* Text Label */}
        <div className={`absolute ${node.y === '50%' ? 'top-28' : 'top-full mt-4'} w-48 text-center pointer-events-none`}>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: node.delay + 0.3 }}
            className="text-white font-bold text-sm md:text-lg mb-1"
          >
            {node.title}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: node.delay + 0.5 }}
            className="text-xs text-gray-500 font-mono"
          >
            {node.desc}
          </motion.p>
        </div>

      </div>
    </motion.div>
  );
};

const EcosystemMap = () => {
  const centerPoint = { x: '50%', y: '50%' };
  const endPoints = [
    { x: '20%', y: '20%' }, 
    { x: '80%', y: '20%' }, 
    { x: '20%', y: '80%' }, 
    { x: '80%', y: '80%' }, 
  ];

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-black">
      <div className="text-center mb-20 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold mb-4"
        >
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-eko-emerald to-blue-500">Neural Ecosystem</span>
        </motion.h2>
        <p className="text-gray-400 text-sm font-mono">Harmonizing Biology, Hardware, and Data.</p>
      </div>

      <div className="max-w-5xl mx-auto h-[500px] md:h-[600px] relative bg-[#050505] rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="absolute inset-0 z-0">
          {nodes.map((node, i) => (
            <GlowingLine key={i} start={centerPoint} end={endPoints[i]} color={node.color} delay={node.delay} />
          ))}
        </div>

        <MapNode 
          node={{
            title: "The Hybrid Core",
            desc: "Class X 120L Mainframe",
            icon: Cpu,
            color: '#10B981',
            x: '50%', y: '50%',
            delay: 0
          }} 
          isCenter={true} 
        />

        {nodes.map((node) => (
          <MapNode key={node.id} node={node} />
        ))}

      </div>
    </section>
  );
};

export default EcosystemMap;
