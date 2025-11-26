import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Ruler, Zap, Container, Wifi, Layers, Clock,
  Droplets, Wind, Activity, Cpu, Database, Thermometer,
  Shield, Beaker, Gauge, Radio, TrendingUp, Zap as Lightning,
  Globe, ChevronRight, Scan, Binary
} from 'lucide-react';

// --- UTILITY: Scramble Text Decoder ---
const ScrambleText = ({ text, trigger = false, className = "" }) => {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

  useEffect(() => {
    if (!trigger) return;
    
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(
        text.split("").map((letter, index) => {
          if (index < iterations) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );

      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 2; // Speed control
    }, 30);

    return () => clearInterval(interval);
  }, [text, trigger]);

  return <span className={`font-mono ${className}`}>{display}</span>;
};

// --- UTILITY: Animated Gradient Text ---
const AnimatedGradientText = ({ children, className = "" }) => (
  <span className={`relative inline-block ${className}`}>
    <span className="bg-gradient-to-r from-eko-emerald via-cyan-400 to-blue-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
      {children}
    </span>
  </span>
);

// --- COMPONENT: Holographic Layer Item ---
const HolographicLayer = ({ layer, index, active, hovered, onHover }) => {
  // Calculate expansion based on hover state
  const yOffset = hovered ? (index - 2) * 80 : (index - 2) * 15;
  const scale = active ? 1.05 : 1;
  const opacity = active ? 1 : (hovered ? 0.3 : 0.8);
  const blur = active ? 0 : (hovered ? 2 : 0);

  return (
    <motion.div
      className="absolute left-0 right-0 h-48 rounded-2xl border transition-all duration-500 cursor-pointer"
      style={{
        top: '50%',
        marginTop: -96, // Center vertically
        zIndex: layer.id,
      }}
      animate={{
        y: yOffset,
        scale: scale,
        opacity: opacity,
        filter: `blur(${blur}px)`,
        borderColor: active ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.1)',
        backgroundColor: active ? 'rgba(16, 185, 129, 0.05)' : 'rgba(0, 0, 0, 0.4)',
      }}
      onMouseEnter={() => onHover(index)}
    >
      {/* Glass Effect Background */}
      <div className="absolute inset-0 backdrop-blur-xl rounded-2xl overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${layer.gradient} opacity-20`} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />
        
        {/* Scanning Line (Only Active) */}
        {active && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-transparent via-eko-emerald/10 to-transparent"
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-between px-8">
        <div className={`p-3 rounded-xl bg-black/50 border border-white/10 ${active ? 'text-eko-emerald' : 'text-white/40'}`}>
          <layer.icon size={32} />
        </div>
        
        {/* Tech Specs (Visible only on hover) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0 }}
          className="text-right"
        >
          <div className="text-[10px] font-mono text-eko-emerald uppercase tracking-widest mb-1">
            STATUS: ONLINE
          </div>
          <div className="flex gap-1">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="w-1 h-1 rounded-full bg-eko-emerald animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
             ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- COMPONENT: The Deconstructed Core (New Product Showcase) ---
const ProductShowcase = () => {
  const [hoveredLayer, setHoveredLayer] = useState(null);
  const [isStackHovered, setIsStackHovered] = useState(false);
  
  // Mouse Parallax Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsStackHovered(false);
    setHoveredLayer(null);
  };

  const layers = [
    { id: 4, title: "Outer Chassis", spec: "Acoustic Dampening", icon: Shield, gradient: "from-gray-500 to-black" },
    { id: 3, title: "HEPA Matrix", spec: "99.97% @ 0.3μm", icon: Wind, gradient: "from-blue-500 to-cyan-500" },
    { id: 2, title: "Bio-Reactor", spec: "Living Algae Core", icon: Droplets, gradient: "from-eko-emerald to-green-900" },
    { id: 1, title: "Sensor Array", spec: "Laser Telemetry", icon: Scan, gradient: "from-purple-500 to-pink-500" },
    { id: 0, title: "Base Intake", spec: "Cyclonic Pre-filter", icon: Activity, gradient: "from-orange-500 to-red-500" },
  ];

  return (
    <section className="py-40 relative overflow-hidden bg-black" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {/* Spotlight Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: Dynamic Text Info */}
          <div className="lg:col-span-4 space-y-8 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-eko-emerald rounded-full animate-pulse" />
                <span className="text-xs font-mono text-eko-emerald uppercase tracking-widest">System Architecture</span>
              </div>
              <h2 className="text-5xl font-bold text-white mb-2 leading-tight">
                <span className="block">Precision</span>
                <AnimatedGradientText>Engineering</AnimatedGradientText>
              </h2>
            </motion.div>

            {/* Layer Detail Box */}
            <div className="h-48 relative">
              <AnimatePresence mode="wait">
                {hoveredLayer !== null ? (
                  <motion.div
                    key={hoveredLayer}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="border-l-2 border-eko-emerald pl-6"
                  >
                    <h3 className="text-3xl text-white font-bold mb-1">
                      <ScrambleText text={layers.find(l => l.id === hoveredLayer).title} trigger={true} />
                    </h3>
                    <div className="text-eko-emerald font-mono text-sm mb-4">
                       // {layers.find(l => l.id === hoveredLayer).spec}
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                      Advanced componentry designed for maximum efficiency and durability. 
                      Integrated seamlessly into the hybrid purification stack.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-white/30 font-mono text-sm"
                  >
                    <Binary className="mb-4 opacity-50" />
                    [SYSTEM STANDBY]<br/>
                    HOVER OVER COMPONENT STACK TO INSPECT LAYERS...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: Holographic Stack */}
          <div className="lg:col-span-8 h-[600px] relative flex items-center justify-center perspective-1000">
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative w-full max-w-md h-full flex flex-col items-center justify-center"
              onMouseEnter={() => setIsStackHovered(true)}
            >
              {/* Connecting Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                {layers.map((layer, i) => {
                   const isHovered = hoveredLayer === layer.id;
                   const yPos = isStackHovered ? 300 + (layer.id - 2) * 80 : 300 + (layer.id - 2) * 15;
                   return (
                     <motion.line
                       key={i}
                       x1="0" y1={yPos}
                       x2="100" y2={yPos} // Simplified coordinates
                       stroke={isHovered ? "#10B981" : "rgba(255,255,255,0.1)"}
                       strokeWidth={isHovered ? 2 : 1}
                       animate={{ y1: yPos, y2: yPos }}
                       className="transition-colors duration-300 opacity-0 lg:opacity-100"
                     />
                   );
                })}
              </svg>

              {/* The Layers */}
              <div className="relative w-80 h-full transform-style-3d">
                {layers.map((layer, index) => (
                  <HolographicLayer
                    key={layer.id}
                    layer={layer}
                    index={layer.id}
                    active={hoveredLayer === layer.id}
                    hovered={isStackHovered}
                    onHover={setHoveredLayer}
                  />
                ))}
              </div>

              {/* Base Glow */}
              <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-12 bg-eko-emerald/20 blur-[40px] rounded-[100%]" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

// --- MAIN SPECS PAGE ---
const SpecsPage = () => {
  const [realTimeData, setRealTimeData] = useState({
    globalAQI: null,
    location: 'Loading...',
    pm25: null
  });

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const response = await fetch(
          'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=28.6139&longitude=77.2090&current=pm2_5,us_aqi'
        );
        const data = await response.json();
        setRealTimeData({
          globalAQI: data.current.us_aqi,
          location: 'Delhi, India',
          pm25: data.current.pm2_5
        });
      } catch (error) {
        setRealTimeData({ globalAQI: 156, location: 'Delhi, India', pm25: 78.5 });
      }
    };
    fetchRealData();
  }, []);

  const specs = [
    { icon: Ruler, value: "1m x 1m", label: "Physical Footprint", description: "Height: 1.8m (Steel Frame)", delay: 0.1 },
    { icon: Zap, value: "500W Hybrid", label: "Power Architecture", description: "Solar / Mains Switchable", delay: 0.15, variant: 'blue' },
    { icon: Container, value: "120 Liters", label: "Fluid Capacity", description: "Food-grade Acrylic Columns", delay: 0.2 },
    { icon: Wifi, value: "WiFi + MQTT", label: "Connectivity", description: "ESP32 / Arduino R4 Architecture", delay: 0.25, variant: 'blue' },
    { icon: Layers, value: "5-Stage Hybrid", label: "Filtration Stack", description: "Physical + Electrostatic + Biological", delay: 0.3 },
    { icon: Clock, value: "5+ Years", label: "Service Life", description: "Modular Component Design", delay: 0.35, variant: 'blue' }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-sans selection:bg-eko-emerald/30">
      {/* Fixed Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-eko-emerald/5 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient { animation: gradient 4s ease infinite; }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
      `}</style>

      <div className="relative z-10">
        {/* Navigation */}
        <div className="px-6 pt-24 pb-8">
          <div className="max-w-7xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Product
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="px-6 mb-16">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-6xl md:text-8xl font-bold leading-none mb-4 tracking-tighter">
                Technical <span className="text-white/20">Specs.</span>
              </h1>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur text-xs font-mono text-eko-emerald">
                <span className="w-2 h-2 rounded-full bg-eko-emerald animate-pulse" />
                CLASS X 120L MODEL
              </div>
            </motion.div>
          </div>
        </div>

        {/* Live Monitor */}
        <div className="px-6 mb-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlobalStatCard icon={Globe} label="Current AQI" value={realTimeData.globalAQI || '--'} subtext={realTimeData.location} delay={0.1} isLive={true} />
              <GlobalStatCard icon={Wind} label="PM2.5 Level" value={realTimeData.pm25 ? `${realTimeData.pm25.toFixed(1)}` : '--'} subtext="µg/m³ (Hazardous)" delay={0.2} isLive={true} />
              <GlobalStatCard icon={Activity} label="Clean Air Output" value={realTimeData.pm25 ? `${(realTimeData.pm25 * 0.85).toFixed(1)}` : '--'} subtext="µg/m³ (Purified)" delay={0.3} />
            </div>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="px-6 mb-32">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specs.map((spec, idx) => <SpecCard key={idx} {...spec} />)}
          </div>
        </div>

        {/* THE NEW MODERN PRODUCT SHOWCASE */}
        <ProductShowcase />

        {/* Footer */}
        <div className="px-6 pb-20 pt-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto text-center">
             <p className="text-white/20 text-xs font-mono">
               * Performance varies by ambient conditions. Contact engineering for enterprise deployments.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecsPage;
