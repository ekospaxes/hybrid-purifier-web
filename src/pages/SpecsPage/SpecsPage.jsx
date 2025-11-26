import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Ruler, Zap, Container, Wifi, Layers, Clock,
  Droplets, Wind, Activity, Cpu, Database, Thermometer,
  Shield, Beaker, Gauge
} from 'lucide-react';

// Spec Card Component with Emerald/Blue Alternating Theme
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
      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-6">
          <Icon 
            className={`${theme.iconBase} ${theme.iconHover} transition-all duration-500`} 
            size={32} 
            strokeWidth={1.5} 
          />
        </div>

        {/* Value */}
        <h3 className={`text-white font-bold text-3xl mb-2 tracking-tight transition-all duration-500 ${theme.valueGlow}`}>
          {value}
        </h3>

        {/* Label */}
        <p className="text-white/60 font-medium text-lg mb-3">
          {label}
        </p>

        {/* Description */}
        <p className="text-white/30 text-sm font-mono leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// Performance Card with Color Variants
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

// Main SpecsPage Component
const SpecsPage = () => {
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
      {/* Background Gradient Orbs - Dual Color */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-eko-emerald/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none" />

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
              {/* Title */}
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

              {/* Model Badge - Gradient Border */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-eko-emerald/5 to-cyan-500/5 backdrop-blur-xl self-start relative overflow-hidden border border-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, rgba(16,185,129,0.5) 0%, rgba(34,211,238,0.5) 100%)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                }}
              >
                <div className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-eko-emerald to-cyan-400 text-xs font-mono uppercase tracking-wider font-bold">
                    MODEL: CLASS X 120L
                  </span>
                </div>
              </motion.div>
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

        {/* System Architecture - Dual Gradient */}
        <div className="px-6 mb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-eko-emerald/5 via-transparent to-cyan-500/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden"
            >
              {/* Accent Line */}
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-eko-emerald to-cyan-400">Energy Class A++</span>
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
