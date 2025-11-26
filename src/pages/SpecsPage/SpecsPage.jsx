import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  motion, useScroll, useTransform, useSpring, 
  useMotionTemplate, useMotionValue, AnimatePresence 
} from 'framer-motion';
import { 
  ArrowLeft, Ruler, Zap, Container, Wifi, Layers, Clock,
  Droplets, Wind, Activity, Cpu, Database, Thermometer,
  Shield, Gauge, Globe, ChevronRight, MoveRight, Beaker
} from 'lucide-react';

// --- UTILS & HOOKS ---
const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

// --- ANIMATED COMPONENTS ---

// 1. Magnetic Button (Vibrant Version)
const MagneticButton = ({ children, className = "", onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const ySpring = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    x.set((clientX - (left + width / 2)) * 0.1);
    y.set((clientY - (top + height / 2)) * 0.1);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      onClick={onClick}
      className={`relative transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </motion.button>
  );
};

// 2. Kinetic Text Reveal
const RevealText = ({ text, className = "", delay = 0 }) => (
  <span className={`inline-block overflow-hidden ${className}`}>
    <motion.span
      initial={{ y: "100%" }}
      whileInView={{ y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.33, 1, 0.68, 1] }}
      viewport={{ once: true }}
      className="inline-block"
    >
      {text}
    </motion.span>
  </span>
);

// 3. 3D Tilt Card
const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x);
  const ySpring = useSpring(y);
  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;
    x.set(((mouseY / height) - HALF_ROTATION_RANGE) * -1);
    y.set((mouseX / width) - HALF_ROTATION_RANGE);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d", transform }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

// --- SECTION COMPONENTS ---

const GlobalStatCard = ({ icon: Icon, label, value, subtext, delay, isLive = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:bg-white/10 transition-colors"
  >
    {isLive && (
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eko-emerald opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-eko-emerald"></span>
        </span>
        <span className="text-[10px] font-mono text-eko-emerald tracking-widest uppercase">LIVE</span>
      </div>
    )}
    
    <div className="mb-4 p-3 bg-white/5 w-fit rounded-xl group-hover:scale-110 transition-transform duration-300">
      <Icon className="text-eko-emerald" size={24} />
    </div>
    
    <div className="space-y-1">
      <div className="text-4xl font-bold text-white tracking-tight font-display">{value}</div>
      <div className="text-sm font-medium text-white/60">{label}</div>
      {subtext && <div className="text-xs text-white/30 font-mono pt-1">{subtext}</div>}
    </div>
    {/* Gradient Blob */}
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-eko-emerald/20 rounded-full blur-2xl group-hover:bg-eko-emerald/30 transition-all duration-500" />
  </motion.div>
);

// Re-injecting the Vibrant Colors into Product Showcase
const ProductShowcase = () => {
  const [activeLayer, setActiveLayer] = useState(0);
  
  const layers = [
    {
      id: 0, title: "Aerospace Chassis", subtitle: "Unibody Aluminum",
      desc: "Precision-milled uni-body chassis with noise-dampening acoustic foam lining.",
      icon: Shield, color: "text-white", gradient: "from-gray-800 to-black", border: "border-gray-600"
    },
    {
      id: 1, title: "Bio-Reactor Core", subtitle: "120L Living Culture",
      desc: "High-density microalgae cultures absorb CO₂ and release oxygen.",
      icon: Droplets, color: "text-eko-emerald", gradient: "from-eko-emerald/40 to-transparent", border: "border-eko-emerald"
    },
    {
      id: 2, title: "Sensor Array", subtitle: "Real-time Telemetry",
      desc: "Laser particle counters, electrochemical gas sensors, and turbidity meters.",
      icon: Cpu, color: "text-cyan-400", gradient: "from-cyan-500/40 to-transparent", border: "border-cyan-400"
    },
    {
      id: 3, title: "HEPA H13", subtitle: "Medical Grade",
      desc: "Captures 99.97% of particulate matter down to 0.3 microns.",
      icon: Wind, color: "text-blue-400", gradient: "from-blue-500/40 to-transparent", border: "border-blue-400"
    },
    {
      id: 4, title: "UV-C Chamber", subtitle: "Sterilization",
      desc: "Neutralizes airborne pathogens ensuring sterile output.",
      icon: Zap, color: "text-purple-400", gradient: "from-purple-500/40 to-transparent", border: "border-purple-400"
    }
  ];

  return (
    <section className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-mono text-eko-emerald backdrop-blur-md"
          >
            EXPLODED VIEW
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            <span className="block">Anatomy of</span>
            <span className="bg-gradient-to-r from-eko-emerald via-cyan-400 to-blue-500 bg-clip-text text-transparent">Innovation</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Interactive Layer Stack */}
          <div className="lg:col-span-7 h-[600px] flex items-center justify-center perspective-1000 relative">
            <div className="relative w-64 h-96 transform-style-3d rotate-x-12 rotate-y-12 group">
              {layers.map((layer, index) => {
                const isActive = activeLayer === index;
                const zOffset = (layers.length - index) * 40;
                
                return (
                  <motion.div
                    key={layer.id}
                    animate={{
                      y: isActive ? -20 : index * 15,
                      z: isActive ? 100 : zOffset,
                      scale: isActive ? 1.1 : 1,
                      opacity: isActive ? 1 : 0.6
                    }}
                    onClick={() => setActiveLayer(index)}
                    className={`
                      absolute inset-0 rounded-2xl border backdrop-blur-xl cursor-pointer transition-all duration-500
                      ${isActive 
                        ? `bg-black/60 ${layer.border} shadow-[0_0_60px_rgba(16,185,129,0.15)]` 
                        : 'border-white/10 bg-black/40 hover:border-white/30'}
                    `}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Vibrant Gradient Background for Each Layer */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${layer.gradient} opacity-40 rounded-2xl`} />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <layer.icon size={40} className={layer.color} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {/* Floor Reflection */}
            <div className="absolute bottom-0 w-64 h-12 bg-eko-emerald/20 blur-[60px] rounded-full" />
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-5 relative">
             <AnimatePresence mode="wait">
              <motion.div
                key={activeLayer}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className={`text-sm font-mono uppercase tracking-widest ${layers[activeLayer].color}`}>
                    0{activeLayer + 1} — {layers[activeLayer].subtitle}
                  </div>
                  <h3 className="text-4xl font-bold text-white">{layers[activeLayer].title}</h3>
                </div>
                
                <p className="text-lg text-white/60 leading-relaxed border-l-2 border-white/10 pl-6">
                  {layers[activeLayer].desc}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
                  <div className="space-y-1">
                    <div className="text-xs text-white/40 font-mono uppercase">Precision</div>
                    <div className="text-2xl font-bold text-white">±0.01mm</div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-xs text-white/40 font-mono uppercase">Material</div>
                     <div className="text-2xl font-bold text-white">Premium</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Controls */}
            <div className="flex gap-3 mt-12">
              {layers.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveLayer(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${activeLayer === i ? 'w-12 bg-eko-emerald' : 'w-4 bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Restoring the Vibrant Spec Card with Gradient Variants
const SpecCard = ({ icon: Icon, value, label, description, delay, variant = 'emerald' }) => {
  const variants = {
    emerald: {
      border: 'group-hover:border-eko-emerald/50',
      glow: 'group-hover:from-eko-emerald/20 group-hover:to-transparent',
      icon: 'group-hover:text-eko-emerald',
      text: 'text-eko-emerald'
    },
    blue: {
      border: 'group-hover:border-cyan-400/50',
      glow: 'group-hover:from-cyan-400/20 group-hover:to-transparent',
      icon: 'group-hover:text-cyan-400',
      text: 'text-cyan-400'
    }
  };

  const theme = variants[variant];

  return (
    <TiltCard className="h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className={`h-full bg-[#080808] border border-white/10 rounded-3xl p-8 relative overflow-hidden group transition-all duration-500 ${theme.border}`}
      >
        {/* Restored: Subtle Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 ${theme.glow} transition-all duration-500 opacity-0 group-hover:opacity-100`} />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-auto">
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5 ${theme.border}`}>
              <Icon className={`text-white/40 ${theme.icon} transition-colors`} size={24} />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2 tracking-tight">{value}</h3>
            <div className={`text-lg font-medium ${theme.text} mb-4`}>{label}</div>
          </div>
          <p className="text-sm text-white/40 leading-relaxed font-mono pt-6 border-t border-white/5">
            {description}
          </p>
        </div>
      </motion.div>
    </TiltCard>
  );
};

// --- MAIN PAGE ---
const SpecsPage = () => {
  const { scrollYProgress } = useScroll();
  
  const [realTimeData, setRealTimeData] = useState({
    globalAQI: null, location: 'Syncing...', pm25: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(r => setTimeout(r, 1500)); 
        const res = await fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=28.6139&longitude=77.2090&current=pm2_5,us_aqi');
        const data = await res.json();
        setRealTimeData({
          globalAQI: data.current.us_aqi,
          location: 'Delhi, IN',
          pm25: data.current.pm2_5
        });
      } catch (e) {
        setRealTimeData({ globalAQI: 156, location: 'Delhi, IN', pm25: 78.5 });
      }
    };
    fetchData();
  }, []);

  const specs = [
    { icon: Ruler, value: "1m²", label: "Footprint", description: "Compact 1m x 1m x 1.8m vertical design optimized for urban spaces.", delay: 0.1, variant: 'emerald' },
    { icon: Zap, value: "500W", label: "Hybrid Power", description: "Intelligent switching between Solar DC and Mains AC.", delay: 0.2, variant: 'blue' },
    { icon: Container, value: "120L", label: "Bio-Capacity", description: "High-density photobioreactor columns with food-grade acrylic.", delay: 0.3, variant: 'emerald' },
    { icon: Wifi, value: "IoT", label: "Connected", description: "Dual-core ESP32 with MQTT & WebSocket telemetry.", delay: 0.4, variant: 'blue' },
    { icon: Layers, value: "5x", label: "Filtration", description: "Multi-stage: Physical, Electrostatic, Biological, Chemical, UV.", delay: 0.5, variant: 'emerald' },
    { icon: Clock, value: "5yr", label: "Lifespan", description: "Modular components designed for long-term serviceability.", delay: 0.6, variant: 'blue' }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-eko-emerald/30 selection:text-eko-emerald overflow-x-hidden">
      {/* Restored: Dynamic Background Mesh (Vibrant) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-eko-emerald/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10s]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[8s]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-screen" />
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 backdrop-blur-md bg-black/50 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-sm tracking-wider">BACK</span>
          </Link>
          <div className="font-mono text-xs text-eko-emerald border border-eko-emerald/30 px-3 py-1 rounded-full bg-eko-emerald/5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            CLASS X • SERIES 1
          </div>
        </nav>

        {/* Hero Header */}
        <header className="pt-48 pb-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl md:text-9xl font-bold tracking-tighter mb-8"
            >
              <RevealText text="Technical" className="block" delay={0} />
              <RevealText text="Manifesto" className="text-white/20 block" delay={0.2} />
            </motion.h1>
            
            <div className="flex flex-col md:flex-row gap-12 md:items-end justify-between border-t border-white/10 pt-8">
              <p className="max-w-xl text-xl text-white/60 leading-relaxed">
                A comprehensive breakdown of the <span className="text-white">Class X Hybrid Purifier</span>. 
                Engineered with military-grade precision and biological intelligence.
              </p>
              
              <div className="flex gap-4">
                <MagneticButton className="px-8 py-4 bg-eko-emerald text-black rounded-full font-bold hover:bg-eko-emerald/90 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2 group transition-all">
                  Download Datasheet <MoveRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </MagneticButton>
              </div>
            </div>
          </div>
        </header>

        {/* Live Data Dashboard */}
        <section className="px-6 mb-32">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <GlobalStatCard 
                    icon={Globe} label="Network Status" value="Online" subtext="Secure Connection" isLive={true} delay={0.1} 
                 />
                 <GlobalStatCard 
                    icon={Wind} label="Local AQI" value={realTimeData.globalAQI || "..."} subtext={realTimeData.location} isLive={true} delay={0.2} 
                 />
                 <GlobalStatCard 
                    icon={Activity} label="PM2.5 Density" value={realTimeData.pm25 || "..."} subtext="µg/m³" isLive={true} delay={0.3} 
                 />
              </div>
           </div>
        </section>

        {/* Main Specs Grid */}
        <section className="px-6 mb-32">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {specs.map((spec, i) => (
                    <SpecCard key={i} {...spec} />
                 ))}
              </div>
           </div>
        </section>

        {/* Interactive Product Showcase */}
        <ProductShowcase />

        {/* Certifications & Footer */}
        <footer className="px-6 py-24 border-t border-white/10 bg-black relative z-20">
           <div className="max-w-7xl mx-auto text-center">
              <div className="flex flex-wrap justify-center gap-8 mb-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                 {/* Mock Logos */}
                 {['ISO 9001', 'CE Certified', 'Energy Star', 'Made in India'].map((cert, i) => (
                    <div key={i} className="border border-white/20 px-4 py-2 rounded-lg font-mono text-xs tracking-widest hover:border-eko-emerald/50 hover:text-eko-emerald transition-colors">
                       {cert}
                    </div>
                 ))}
              </div>
              <p className="text-white/20 text-sm font-mono">
                 © 2025 EKOSPAXES. ALL RIGHTS RESERVED. <br />
                 ENGINEERED IN DELHI. DEPLOYED GLOBALLY.
              </p>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default SpecsPage;
