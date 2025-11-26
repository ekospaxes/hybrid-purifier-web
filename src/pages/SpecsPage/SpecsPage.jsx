import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Ruler, Zap, Container, Wifi, Layers, Clock,
  Droplets, Wind, Activity, Cpu, Database, Thermometer,
  Shield, Gauge, Radio, TrendingUp, Home, Building2, GraduationCap
} from 'lucide-react';

// --- HELPER COMPONENTS ---

const AnimatedGradientText = ({ children, className = "" }) => (
  <span className={`relative inline-block ${className}`}>
    <span className="bg-gradient-to-r from-eko-emerald via-cyan-400 to-blue-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
      {children}
    </span>
  </span>
);

const LiveCounter = ({ target, suffix = "", prefix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) { setCount(target); return; }
    let startTime;
    let animationFrame;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
      else setHasAnimated(true);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => { if (hasAnimated) setCount(target); }, [target, hasAnimated]);
  return <span className="font-mono font-bold">{prefix}{count}{suffix}</span>;
};

const LiveMetricCard = ({ icon: Icon, label, value, trend, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6 relative overflow-hidden group"
  >
    <div className="absolute top-3 right-3 flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-eko-emerald animate-pulse" />
      <span className="text-[8px] font-mono text-white/40 uppercase">LIVE</span>
    </div>
    <div className="mb-4"><Icon className="text-eko-emerald group-hover:text-cyan-400 transition-colors" size={24} /></div>
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-white/60 mb-2">{label}</div>
    {trend && <div className="flex items-center gap-1 text-xs text-eko-emerald"><TrendingUp size={12} /><span>{trend}</span></div>}
  </motion.div>
);

const SpecCard = ({ icon: Icon, value, label, description, delay, variant = 'emerald' }) => {
  const colors = {
    emerald: { iconHover: 'group-hover:text-eko-emerald', iconBase: 'text-eko-emerald/30', border: 'hover:border-eko-emerald/40', glow: 'from-eko-emerald/0 via-eko-emerald/0 to-eko-emerald/10', valueGlow: 'group-hover:text-eko-emerald' },
    blue: { iconHover: 'group-hover:text-cyan-400', iconBase: 'text-cyan-500/30', border: 'hover:border-cyan-400/40', glow: 'from-cyan-500/0 via-cyan-500/0 to-cyan-500/10', valueGlow: 'group-hover:text-cyan-400' }
  };
  const theme = colors[variant];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
      className={`relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 ${theme.border} transition-all duration-500 group overflow-hidden`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      <div className="relative z-10">
        <div className="mb-6"><Icon className={`${theme.iconBase} ${theme.iconHover} transition-all duration-500`} size={32} strokeWidth={1.5} /></div>
        <h3 className={`text-white font-bold text-3xl mb-2 tracking-tight transition-all duration-500 ${theme.valueGlow}`}>{value}</h3>
        <p className="text-white/60 font-medium text-lg mb-3">{label}</p>
        <p className="text-white/30 text-sm font-mono leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

const PerformanceCard = ({ icon: Icon, value, unit, label, description, delay, variant = 'emerald' }) => {
  const colors = {
    emerald: { icon: 'text-eko-emerald/50 group-hover:text-eko-emerald', value: 'text-white', border: 'hover:border-eko-emerald/30' },
    blue: { icon: 'text-cyan-400/50 group-hover:text-cyan-400', value: 'text-white', border: 'hover:border-cyan-400/30' }
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
      <div className="mb-3"><Icon className={`${theme.icon} transition-colors`} size={20} /></div>
      <div className="flex items-baseline gap-1 mb-1"><span className={`text-2xl font-bold ${theme.value}`}>{value}</span>{unit && <span className="text-xs text-white/40 font-mono">{unit}</span>}</div>
      <p className="text-white/60 text-xs font-medium mb-1">{label}</p>
      <p className="text-white/30 text-[10px] font-mono leading-relaxed">{description}</p>
    </motion.div>
  );
};

// --- NEW: DEPLOYMENT SCENARIOS SECTION ---

const DeploymentCard = ({ icon: Icon, title, subtitle, points, delay, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    className="flex-1 bg-[#0f0f0f] border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors group"
  >
    <div className={`w-12 h-12 rounded-full bg-${color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      <Icon className={`text-${color}-400`} size={24} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-white/40 text-sm mb-6">{subtitle}</p>
    <ul className="space-y-3">
      {points.map((point, i) => (
        <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
          <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500/50`} />
          {point}
        </li>
      ))}
    </ul>
  </motion.div>
);

const DeploymentSection = () => {
  return (
    <div className="px-6 mb-32 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Versatile <span className="text-transparent bg-clip-text bg-gradient-to-r from-eko-emerald to-cyan-400">Integration</span>
          </h2>
          <p className="text-white/40 font-mono text-sm">Engineered for diverse atmospheric loads</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DeploymentCard 
            icon={Home} 
            title="Residential" 
            subtitle="Ideal for living rooms & apartments"
            color="emerald"
            delay={0.1}
            points={[
              "Ultra-quiet sleep mode (<25dB)",
              "Ambient LED mood lighting",
              "Pet dander & allergen filtration"
            ]}
          />
          <DeploymentCard 
            icon={Building2} 
            title="Commercial" 
            subtitle="High-traffic offices & lobbies"
            color="blue"
            delay={0.2}
            points={[
              "High-capacity CO₂ reduction",
              "VOC removal from office equipment",
              "Centralized MQTT dashboard"
            ]}
          />
          <DeploymentCard 
            icon={GraduationCap} 
            title="Educational" 
            subtitle="Schools, Labs & Museums"
            color="orange"
            delay={0.3}
            points={[
              "Visible bio-reactor for STEM learning",
              "Safe, tamper-proof design",
              "Real-time AQI display for students"
            ]}
          />
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const SpecsPage = () => {
  const [liveData, setLiveData] = useState({ devices: 1247, airCleaned: 32, co2Reduced: 890 });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        devices: prev.devices + Math.floor(Math.random() * 2),
        airCleaned: prev.airCleaned + Math.floor(Math.random() * 2),
        co2Reduced: prev.co2Reduced + Math.floor(Math.random() * 3)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const specs = [
    { icon: Ruler, value: "1m x 1m", label: "Physical Footprint", description: "Height: 1.8m (Steel Frame)", delay: 0.1, variant: 'emerald' },
    { icon: Zap, value: "500W Hybrid", label: "Power Architecture", description: "Solar / Mains Switchable", delay: 0.15, variant: 'blue' },
    { icon: Container, value: "120 Liters", label: "Fluid Capacity", description: "Food-grade Acrylic Columns", delay: 0.2, variant: 'emerald' },
    { icon: Wifi, value: "WiFi + MQTT", label: "Connectivity", description: "ESP32 / Arduino R4 Architecture", delay: 0.25, variant: 'blue' },
    { icon: Layers, value: "5-Stage Hybrid", label: "Filtration Stack", description: "Physical + Electrostatic + Biological", delay: 0.3, variant: 'emerald' },
    { icon: Clock, value: "5+ Years", label: "Service Life", description: "Modular Component Design", delay: 0.35, variant: 'blue' }
  ];

  const detailedSpecs = [
    { icon: Droplets, value: "0.7", unit: "g/L/day", label: "CO₂ Fixation", description: "Biological carbon capture", delay: 0.4, variant: 'emerald' },
    { icon: Wind, value: "500", unit: "m³/h", label: "Airflow Rate", description: "Continuous circulation", delay: 0.45, variant: 'blue' },
    { icon: Activity, value: "85%", unit: "", label: "PM2.5 Removal", description: "Particulate filtration", delay: 0.5, variant: 'emerald' },
    { icon: Database, value: "30s", unit: "", label: "Sensor Polling", description: "Real-time interval", delay: 0.55, variant: 'blue' },
    { icon: Thermometer, value: "20-28°C", unit: "", label: "Operating Range", description: "Optimal temperature", delay: 0.6, variant: 'emerald' },
    { icon: Cpu, value: "ESP32", unit: "", label: "Microcontroller", description: "Dual-core WiFi", delay: 0.65, variant: 'blue' }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-eko-emerald/5 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[180px] animate-pulse pointer-events-none" style={{ animationDelay: '1s', animationDuration: '4s' }} />
      <div className="fixed bottom-0 left-1/3 w-[550px] h-[550px] bg-blue-500/5 rounded-full blur-[160px] animate-pulse pointer-events-none" style={{ animationDelay: '2s', animationDuration: '5s' }} />

      <style>{`
        @keyframes gradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .animate-gradient { animation: gradient 4s ease infinite; }
      `}</style>

      <div className="relative z-10">
        {/* Navigation */}
        <div className="px-6 pt-24 pb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Product
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Header Section */}
        <div className="px-6 mb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none mb-2">
                  <span className="text-white">Technical </span>
                  <span className="text-white/40">Specifications.</span>
                </h1>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="px-4 py-2 rounded-lg bg-gradient-to-r from-eko-emerald/5 to-cyan-500/5 backdrop-blur-xl self-start border border-white/20">
                <AnimatedGradientText className="text-xs font-mono uppercase tracking-wider font-bold">
                  MODEL: CLASS X 120L
                </AnimatedGradientText>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Live Global Stats */}
        <div className="px-6 mb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2"><AnimatedGradientText>Live Global Network</AnimatedGradientText></h2>
              <p className="text-white/40 text-sm">Real-time data from deployed units worldwide</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <LiveMetricCard icon={Radio} label="Active Devices" value={<LiveCounter target={liveData.devices} />} trend="+12 today" delay={0.1} />
              <LiveMetricCard icon={Wind} label="Air Cleaned (m³)" value={<LiveCounter target={liveData.airCleaned} suffix="M" />} trend="+2M this week" delay={0.2} />
              <LiveMetricCard icon={Droplets} label="CO₂ Reduced (kg)" value={<LiveCounter target={liveData.co2Reduced} suffix=" kg" />} trend="+45kg today" delay={0.3} />
            </div>
          </div>
        </div>

        {/* Primary Specs Grid */}
        <div className="px-6 mb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specs.map((spec, idx) => <SpecCard key={idx} {...spec} />)}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="px-6 mb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
              <h2 className="text-3xl font-bold mb-2"><span className="text-white">Performance </span><span className="text-white/40">Metrics</span></h2>
              <p className="text-white/40 text-sm">Laboratory-verified efficiency data</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {detailedSpecs.map((spec, idx) => <PerformanceCard key={idx} {...spec} />)}
            </div>
          </div>
        </div>

        {/* System Architecture */}
        <div className="px-6 mb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-eko-emerald/5 via-transparent to-cyan-500/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-eko-emerald via-cyan-400 to-blue-500" />
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-eko-emerald/10 to-cyan-500/10 text-eko-emerald w-fit"><Gauge size={32} /></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-eko-emerald to-cyan-400">Operation</span></h3>
                  <p className="text-white/60 leading-relaxed mb-4">The ekospaxes hybrid purifier employs <span className="text-eko-emerald font-mono">smart sleep/wake cycles</span> based on real-time pollution monitoring.</p>
                  <p className="text-white/40 leading-relaxed text-sm">Upon detecting elevated PM2.5, VOC levels, or CO₂ concentration, it automatically activates biological filtration, increases airflow, and adjusts LED intensity to optimize photosynthetic efficiency.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* --- NEW: DEPLOYMENT SCENARIOS (Replaced 3D Section) --- */}
        <DeploymentSection />

        {/* Certifications */}
        <div className="px-6 mb-12">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/30 font-mono">
              <span className="flex items-center gap-2"><Shield size={14} className="text-eko-emerald/50" /> Patent Pending</span>
              <span className="w-1 h-1 rounded-full bg-white/20" /><span>Made in India</span>
              <span className="w-1 h-1 rounded-full bg-white/20" /><span>ISO 9001:2015 Certified</span>
              <span className="w-1 h-1 rounded-full bg-white/20" /><AnimatedGradientText>Energy Class A++</AnimatedGradientText>
            </motion.div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
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
