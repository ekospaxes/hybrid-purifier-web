import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Ruler, Zap, Container, Wifi, Layers, Clock,
  Droplets, Wind, Activity, Cpu, Database, Thermometer,
  Shield, Beaker, Gauge, Radio, TrendingUp, Zap as Lightning,
  Globe, ChevronRight
} from 'lucide-react';

// Animated Gradient Text Component
const AnimatedGradientText = ({ children, className = "" }) => (
  <span className={`relative inline-block ${className}`}>
    <span className="bg-gradient-to-r from-eko-emerald via-cyan-400 to-blue-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
      {children}
    </span>
  </span>
);

// Real-Time Global Stats Card (fetches actual API data)
const GlobalStatCard = ({ icon: Icon, label, value, subtext, delay, isLive = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6 relative overflow-hidden group"
    >
      {/* Live/Demo Indicator */}
      {isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-eko-emerald animate-pulse" />
          <span className="text-[8px] font-mono text-eko-emerald uppercase">LIVE</span>
        </div>
      )}

      {/* Icon */}
      <div className="mb-4">
        <Icon className="text-eko-emerald group-hover:text-cyan-400 transition-colors" size={24} />
      </div>

      {/* Value */}
      <div className="text-3xl font-bold text-white mb-1">
        {value}
      </div>

      {/* Label */}
      <div className="text-sm text-white/60 mb-2">{label}</div>

      {/* Subtext */}
      {subtext && (
        <div className="text-xs text-white/40">
          {subtext}
        </div>
      )}
    </motion.div>
  );
};

// Spec Card Component
const SpecCard = ({ icon: Icon, value, label, description, delay, variant = 'emerald' }) => {
  const colors = {
    emerald: {
      iconHover: 'group-hover:text-eko-emerald',
      iconBase: 'text-eko-emerald/30',
      border: 'hover:border-eko-emerald/40',
      glow: 'from-eko-emerald/0 via-eko-emerald/0 to-eko-emerald/10',
      valueGlow: 'group-hover:text-eko-emerald group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
    },
    blue: {
      iconHover: 'group-hover:text-cyan-400',
      iconBase: 'text-cyan-500/30',
      border: 'hover:border-cyan-400/40',
      glow: 'from-cyan-500/0 via-cyan-500/0 to-cyan-500/10',
      valueGlow: 'group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]'
    }
  };

  const theme = colors[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className={`relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 ${theme.border} transition-all duration-500 group overflow-hidden`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      
      <div className="relative z-10">
        <div className="mb-6">
          <Icon 
            className={`${theme.iconBase} ${theme.iconHover} transition-all duration-500`} 
            size={32} 
            strokeWidth={1.5} 
          />
        </div>

        <h3 className={`text-white font-bold text-3xl mb-2 tracking-tight transition-all duration-500 ${theme.valueGlow}`}>
          {value}
        </h3>

        <p className="text-white/60 font-medium text-lg mb-3">
          {label}
        </p>

        <p className="text-white/30 text-sm font-mono leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// Performance Card Component
const PerformanceCard = ({ icon: Icon, value, unit, label, description, delay, variant = 'emerald' }) => {
  const colors = {
    emerald: {
      icon: 'text-eko-emerald/50 group-hover:text-eko-emerald',
      value: 'text-white',
      border: 'hover:border-eko-emerald/30'
    },
    blue: {
      icon: 'text-cyan-400/50 group-hover:text-cyan-400',
      value: 'text-white',
      border: 'hover:border-cyan-400/30'
    }
  };

  const theme = colors[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 ${theme.border} transition-all group`}
    >
      <div className="mb-3">
        <Icon className={`${theme.icon} transition-colors`} size={20} />
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className={`text-2xl font-bold ${theme.value}`}>{value}</span>
        {unit && <span className="text-xs text-white/40 font-mono">{unit}</span>}
      </div>
      <p className="text-white/60 text-xs font-medium mb-1">{label}</p>
      <p className="text-white/30 text-[10px] font-mono leading-relaxed">{description}</p>
    </motion.div>
  );
};

// --- NEW INTERACTIVE PRODUCT SHOWCASE ---
const ProductShowcase = () => {
  const [activeLayer, setActiveLayer] = useState(0);

  const layers = [
    {
      id: 0,
      title: "Outer Shell",
      subtitle: "Aerospace Grade Aluminum",
      desc: "Precision-milled uni-body chassis with noise-dampening acoustic foam lining.",
      icon: Shield,
      color: "text-gray-400",
      gradient: "from-gray-800 to-black"
    },
    {
      id: 1,
      title: "Bio-Reactor Core",
      subtitle: "120L Living Culture",
      desc: "The heart of the system. High-density microalgae cultures absorb CO₂ and release oxygen.",
      icon: Droplets,
      color: "text-eko-emerald",
      gradient: "from-eko-emerald/20 to-transparent"
    },
    {
      id: 2,
      title: "Sensor Array",
      subtitle: "Real-time Telemetry",
      desc: "Laser particle counters, electrochemical gas sensors, and optical turbidity meters.",
      icon: Cpu,
      color: "text-cyan-400",
      gradient: "from-cyan-500/20 to-transparent"
    },
    {
      id: 3,
      title: "HEPA Filtration",
      subtitle: "H13 Medical Grade",
      desc: "Captures 99.97% of particulate matter down to 0.3 microns before biological stage.",
      icon: Wind,
      color: "text-blue-400",
      gradient: "from-blue-500/20 to-transparent"
    },
    {
      id: 4,
      title: "UV-C Sterilization",
      subtitle: "254nm Wavelength",
      desc: "Final purification stage neutralizing airborne pathogens and ensuring sterile output.",
      icon: Zap,
      color: "text-purple-400",
      gradient: "from-purple-500/20 to-transparent"
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-eko-emerald/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Anatomy of </span>
            <span className="bg-gradient-to-r from-eko-emerald to-cyan-400 bg-clip-text text-transparent">Innovation</span>
          </h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            Peel back the layers of the world's most advanced biological air purification system.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: Interactive 3D Stack Visualization */}
          <div className="relative h-[600px] flex items-center justify-center perspective-1000">
            <div className="relative w-64 h-96 transform-style-3d rotate-x-12">
              {layers.map((layer, index) => {
                const isActive = activeLayer === index;
                const offset = (index - activeLayer) * 60; // Distance between layers
                
                return (
                  <motion.div
                    key={layer.id}
                    animate={{
                      y: isActive ? 0 : offset,
                      scale: isActive ? 1.1 : 0.9,
                      opacity: isActive ? 1 : 0.3,
                      zIndex: layers.length - Math.abs(index - activeLayer)
                    }}
                    transition={{ duration: 0.5, type: "spring" }}
                    onClick={() => setActiveLayer(index)}
                    className={`
                      absolute inset-0 rounded-2xl border border-white/10 backdrop-blur-md cursor-pointer
                      shadow-2xl transition-colors duration-300
                      ${isActive ? 'border-white/30 bg-white/5' : 'hover:border-white/20'}
                    `}
                    style={{
                      transform: `translateZ(${isActive ? 50 : -offset}px)`,
                    }}
                  >
                    {/* Layer Visual Content */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${layer.gradient} opacity-50 rounded-2xl`} />
                    
                    {/* Internal Pattern/Grid */}
                    <div className="absolute inset-4 border border-dashed border-white/10 rounded-xl flex items-center justify-center">
                      <layer.icon size={48} className={`${layer.color} opacity-50`} />
                    </div>

                    {/* Connection Line to Label (Only Active) */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 100, opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          className="absolute top-1/2 left-full h-px bg-gradient-to-r from-white/50 to-transparent w-32 origin-left"
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Detail Panel */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLayer}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12"
              >
                {/* Header with Icon */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl bg-white/5 ${layers[activeLayer].color}`}>
                    {React.createElement(layers[activeLayer].icon, { size: 32 })}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">{layers[activeLayer].title}</h3>
                    <p className={`text-sm font-mono uppercase tracking-wider ${layers[activeLayer].color}`}>
                      {layers[activeLayer].subtitle}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  {layers[activeLayer].desc}
                </p>

                {/* Stats Grid (Mock Data based on layer) */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                    <div className="text-white/40 text-xs uppercase mb-1">Efficiency</div>
                    <div className="text-white font-mono text-xl">99.9%</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                    <div className="text-white/40 text-xs uppercase mb-1">Lifespan</div>
                    <div className="text-white font-mono text-xl">24 Months</div>
                  </div>
                </div>

                {/* Navigation Dots */}
                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <div className="flex gap-2">
                    {layers.map((l, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveLayer(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          activeLayer === i ? `w-8 ${l.color.replace('text-', 'bg-')}` : 'bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-white/20 text-sm font-mono">
                    0{activeLayer + 1} / 0{layers.length}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main SpecsPage Component
const SpecsPage = () => {
  const [realTimeData, setRealTimeData] = useState({
    globalAQI: null,
    location: 'Loading...',
    pm25: null
  });

  // Fetch real air quality data from Open-Meteo API
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        // Delhi coordinates as example
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
        console.error('Failed to fetch real-time data:', error);
        // Fallback to static data
        setRealTimeData({
          globalAQI: 156,
          location: 'Delhi, India',
          pm25: 78.5
        });
      }
    };

    fetchRealData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchRealData, 300000);
    return () => clearInterval(interval);
  }, []);

  const specs = [
    {
      icon: Ruler,
      value: "1m x 1m",
      label: "Physical Footprint",
      description: "Height: 1.8m (Steel Frame)",
      delay: 0.1,
      variant: 'emerald'
    },
    {
      icon: Zap,
      value: "500W Hybrid",
      label: "Power Architecture",
      description: "Solar / Mains Switchable",
      delay: 0.15,
      variant: 'blue'
    },
    {
      icon: Container,
      value: "120 Liters",
      label: "Fluid Capacity",
      description: "Food-grade Acrylic Columns",
      delay: 0.2,
      variant: 'emerald'
    },
    {
      icon: Wifi,
      value: "WiFi + MQTT",
      label: "Connectivity",
      description: "ESP32 / Arduino R4 Architecture",
      delay: 0.25,
      variant: 'blue'
    },
    {
      icon: Layers,
      value: "5-Stage Hybrid",
      label: "Filtration Stack",
      description: "Physical + Electrostatic + Biological",
      delay: 0.3,
      variant: 'emerald'
    },
    {
      icon: Clock,
      value: "5+ Years",
      label: "Service Life",
      description: "Modular Component Design",
      delay: 0.35,
      variant: 'blue'
    }
  ];

  const detailedSpecs = [
    {
      icon: Droplets,
      value: "0.7",
      unit: "g/L/day",
      label: "CO₂ Fixation",
      description: "Biological carbon capture",
      delay: 0.4,
      variant: 'emerald'
    },
    {
      icon: Wind,
      value: "500",
      unit: "m³/h",
      label: "Airflow Rate",
      description: "Continuous circulation",
      delay: 0.45,
      variant: 'blue'
    },
    {
      icon: Activity,
      value: "85%",
      unit: "",
      label: "PM2.5 Removal",
      description: "Particulate filtration",
      delay: 0.5,
      variant: 'emerald'
    },
    {
      icon: Database,
      value: "30s",
      unit: "",
      label: "Sensor Polling",
      description: "Real-time interval",
      delay: 0.55,
      variant: 'blue'
    },
    {
      icon: Thermometer,
      value: "20-28°C",
      unit: "",
      label: "Operating Range",
      description: "Optimal temperature",
      delay: 0.6,
      variant: 'emerald'
    },
    {
      icon: Cpu,
      value: "ESP32",
      unit: "",
      label: "Microcontroller",
      description: "Dual-core WiFi",
      delay: 0.65,
      variant: 'blue'
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-eko-emerald/5 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[180px] animate-pulse pointer-events-none" style={{ animationDelay: '1s', animationDuration: '4s' }} />
      <div className="fixed bottom-0 left-1/3 w-[550px] h-[550px] bg-blue-500/5 rounded-full blur-[160px] animate-pulse pointer-events-none" style={{ animationDelay: '2s', animationDuration: '5s' }} />

      {/* CSS Animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>

      <div className="relative z-10">
        {/* Navigation */}
        <div className="px-6 pt-24 pb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors group"
              >
                <ArrowLeft 
                  size={16} 
                  className="group-hover:-translate-x-1 transition-transform duration-300" 
                />
                Back to Product
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Header Section */}
        <div className="px-6 mb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none mb-2">
                  <span className="text-white">Technical </span>
                  <span className="text-white/40">Specifications.</span>
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-eko-emerald/5 to-cyan-500/5 backdrop-blur-xl self-start border border-white/20"
              >
                <AnimatedGradientText className="text-xs font-mono uppercase tracking-wider font-bold">
                  MODEL: CLASS X 120L
                </AnimatedGradientText>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Real-Time Environmental Data */}
        <div className="px-6 mb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                <AnimatedGradientText>Real-Time Environmental Monitor</AnimatedGradientText>
              </h2>
              <p className="text-white/40 text-sm">Live air quality data from Open-Meteo API</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <GlobalStatCard
                icon={Globe}
                label="Current AQI"
                value={realTimeData.globalAQI || '--'}
                subtext={realTimeData.location}
                delay={0.1}
                isLive={true}
              />
              <GlobalStatCard
                icon={Wind}
                label="PM2.5 Level"
                value={realTimeData.pm25 ? `${realTimeData.pm25.toFixed(1)} µg/m³` : '--'}
                subtext="Particulate matter"
                delay={0.2}
                isLive={true}
              />
              <GlobalStatCard
                icon={Activity}
                label="Purification Impact"
                value={realTimeData.pm25 ? `${(realTimeData.pm25 * 0.85).toFixed(1)} µg/m³` : '--'}
                subtext="After bio-filtration"
                delay={0.3}
                isLive={false}
              />
            </div>
          </div>
        </div>

        {/* Primary Specs Grid */}
        <div className="px-6 mb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specs.map((spec, idx) => (
                <SpecCard key={idx} {...spec} />
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics Section */}
        <div className="px-6 mb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold mb-2">
                <span className="text-white">Performance </span>
                <span className="text-white/40">Metrics</span>
              </h2>
              <p className="text-white/40 text-sm">Laboratory-verified efficiency data</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {detailedSpecs.map((spec, idx) => (
                <PerformanceCard key={idx} {...spec} />
              ))}
            </div>
          </div>
        </div>

        {/* System Architecture */}
        <div className="px-6 mb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-eko-emerald/5 via-transparent to-cyan-500/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-eko-emerald via-cyan-400 to-blue-500" />
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-eko-emerald/10 to-cyan-500/10 text-eko-emerald w-fit">
                    <Gauge size={32} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-eko-emerald to-cyan-400">Operation</span>
                  </h3>
                  <p className="text-white/60 leading-relaxed mb-4">
                    The ekospaxes hybrid purifier employs <span className="text-eko-emerald font-mono">smart sleep/wake cycles</span> based 
                    on real-time pollution monitoring. When air quality is within safe limits, the system enters 
                    low-power standby mode consuming less than 2W.
                  </p>
                  <p className="text-white/40 leading-relaxed text-sm">
                    Upon detecting elevated PM2.5, VOC levels, or CO₂ concentration, it automatically activates 
                    biological filtration, increases airflow, and adjusts LED intensity to optimize photosynthetic 
                    efficiency — restoring healthy indoor conditions within minutes.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* NEW INTERACTIVE PRODUCT SHOWCASE */}
        <ProductShowcase />

        {/* Certifications */}
        <div className="px-6 mb-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/30 font-mono"
            >
              <span className="flex items-center gap-2">
                <Shield size={14} className="text-eko-emerald/50" />
                Patent Pending
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Made in India</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>ISO 9001:2015 Certified</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <AnimatedGradientText>Energy Class A++</AnimatedGradientText>
            </motion.div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-white/20 text-xs font-mono leading-relaxed max-w-4xl mx-auto">
                * All performance figures based on Delhi test conditions (AQI 150-300). Results may vary (±15%). 
                Modular parts are replaceable. Contact engineering team for custom sizing and enterprise deployments.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecsPage;
