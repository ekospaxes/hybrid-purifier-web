import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Ruler, Zap, Container, Wifi, Layers, Clock,
  Droplets, Wind, Activity, Cpu, Database, Thermometer,
  Shield, Beaker, Gauge
} from 'lucide-react';

// Spec Card Component
const SpecCard = ({ icon: Icon, value, label, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    viewport={{ once: true }}
    className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 hover:border-eko-emerald/30 transition-all duration-500 group overflow-hidden"
  >
    {/* Hover Glow Effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-eko-emerald/0 via-eko-emerald/0 to-eko-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    
    <div className="relative z-10">
      {/* Icon */}
      <div className="mb-6">
        <Icon 
          className="text-white/30 group-hover:text-eko-emerald transition-all duration-500" 
          size={32} 
          strokeWidth={1.5} 
        />
      </div>

      {/* Value */}
      <h3 className="text-white font-bold text-3xl mb-2 tracking-tight">
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

// Main SpecsPage Component
const SpecsPage = () => {
  const specs = [
    {
      icon: Ruler,
      value: "1m x 1m",
      label: "Physical Footprint",
      description: "Height: 1.8m (Steel Frame)",
      delay: 0.1
    },
    {
      icon: Zap,
      value: "500W Hybrid",
      label: "Power Architecture",
      description: "Solar / Mains Switchable",
      delay: 0.15
    },
    {
      icon: Container,
      value: "120 Liters",
      label: "Fluid Capacity",
      description: "Food-grade Acrylic Columns",
      delay: 0.2
    },
    {
      icon: Wifi,
      value: "WiFi + MQTT",
      label: "Connectivity",
      description: "ESP32 / Arduino R4 Architecture",
      delay: 0.25
    },
    {
      icon: Layers,
      value: "5-Stage Hybrid",
      label: "Filtration Stack",
      description: "Physical + Electrostatic + Biological",
      delay: 0.3
    },
    {
      icon: Clock,
      value: "5+ Years",
      label: "Service Life",
      description: "Modular Component Design",
      delay: 0.35
    }
  ];

  const detailedSpecs = [
    {
      icon: Droplets,
      value: "0.7",
      unit: "g/L/day",
      label: "CO₂ Fixation",
      description: "Biological carbon capture rate",
      delay: 0.4
    },
    {
      icon: Wind,
      value: "500",
      unit: "m³/h",
      label: "Airflow Rate",
      description: "Continuous circulation capacity",
      delay: 0.45
    },
    {
      icon: Activity,
      value: "85%",
      unit: "",
      label: "PM2.5 Removal",
      description: "Particulate matter filtration",
      delay: 0.5
    },
    {
      icon: Database,
      value: "30s",
      unit: "",
      label: "Sensor Polling",
      description: "Real-time data interval",
      delay: 0.55
    },
    {
      icon: Thermometer,
      value: "20-28°C",
      unit: "",
      label: "Operating Range",
      description: "Optimal temperature window",
      delay: 0.6
    },
    {
      icon: Cpu,
      value: "ESP32",
      unit: "",
      label: "Microcontroller",
      description: "Dual-core WiFi + BLE",
      delay: 0.65
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-eko-emerald/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-eko-emerald/3 rounded-full blur-[180px] pointer-events-none" />

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

              {/* Model Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="px-4 py-2 border border-eko-emerald/50 rounded-lg bg-eko-emerald/5 backdrop-blur-xl self-start"
              >
                <span className="text-eko-emerald text-xs font-mono uppercase tracking-wider">
                  MODEL: CLASS X 120L
                </span>
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
              <h2 className="text-3xl font-bold text-white mb-2">
                Performance <span className="text-white/40">Metrics</span>
              </h2>
              <p className="text-white/40 text-sm">Laboratory-verified efficiency data</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {detailedSpecs.map((spec, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: spec.delay, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-eko-emerald/30 transition-all group"
                >
                  <div className="mb-3">
                    <spec.icon className="text-eko-emerald/50 group-hover:text-eko-emerald transition-colors" size={20} />
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-bold text-white">{spec.value}</span>
                    {spec.unit && <span className="text-xs text-white/40 font-mono">{spec.unit}</span>}
                  </div>
                  <p className="text-white/60 text-xs font-medium mb-1">{spec.label}</p>
                  <p className="text-white/30 text-[10px] font-mono leading-relaxed">{spec.description}</p>
                </motion.div>
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
              className="bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="p-4 rounded-xl bg-eko-emerald/10 text-eko-emerald w-fit">
                    <Gauge size={32} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Intelligent <span className="text-eko-emerald">Operation</span>
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
              <span className="text-eko-emerald/70">Energy Class A++</span>
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
