import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowLeft, Ruler, Zap, Container, Wifi, Layers, Clock,
  Droplets, Wind, Activity, Cpu, Database, Thermometer,
  Shield, Beaker, Gauge, Radio, TrendingUp, Zap as Lightning
} from 'lucide-react';

// Animated Gradient Text Component
const AnimatedGradientText = ({ children, className = "" }) => (
  <span className={`relative inline-block ${className}`}>
    <span className="absolute inset-0 bg-gradient-to-r from-eko-emerald via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
      {children}
    </span>
    <span className="relative bg-gradient-to-r from-eko-emerald via-cyan-400 to-blue-500 bg-clip-text text-transparent">
      {children}
    </span>
  </span>
);

// Live Data Counter with Animation
const LiveCounter = ({ target, suffix = "", prefix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return (
    <span className="font-mono font-bold">
      {prefix}{count}{suffix}
    </span>
  );
};

// Live Metric Card
const LiveMetricCard = ({ icon: Icon, label, value, trend, delay }) => {
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6 relative overflow-hidden group"
    >
      {/* Live Indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-eko-emerald' : 'bg-cyan-400'} animate-pulse`} />
        <span className="text-[8px] font-mono text-white/40 uppercase">LIVE</span>
      </div>

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

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1 text-xs text-eko-emerald">
          <TrendingUp size={12} />
          <span>{trend}</span>
        </div>
      )}

      {/* Animated Border */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-eko-emerald/20 via-cyan-400/20 to-blue-500/20 animate-gradient bg-[length:200%_auto]" />
      </div>
    </motion.div>
  );
};

// Spec Card Component with Enhanced Animations
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

// Apple-Style 3D Product Showcase
const ProductShowcase = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0.7, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  const rotateY = useTransform(scrollYProgress, [0.7, 1], [-15, 0]);

  return (
    <div className="relative py-32 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <AnimatedGradientText>Engineered to Perfection</AnimatedGradientText>
          </h2>
          <p className="text-white/60 text-xl max-w-3xl mx-auto">
            Every detail meticulously crafted. Every component precisely engineered. 
            The future of air purification, visualized.
          </p>
        </motion.div>

        {/* Main Product Display */}
        <motion.div
          style={{ scale, opacity }}
          className="relative mb-20"
        >
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-white/10">
            {/* Placeholder for 3D Model - Replace with actual image/model */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  rotateY: [0, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* Central Column Representation */}
                <div className="relative w-32 h-96 bg-gradient-to-b from-eko-emerald/20 via-cyan-500/20 to-blue-500/20 rounded-3xl border border-white/20 backdrop-blur-xl shadow-[0_0_80px_rgba(16,185,129,0.3)]">
                  {/* Bubbles Animation */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-eko-emerald/60 rounded-full"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        bottom: 0
                      }}
                      animate={{
                        y: [-400, 0],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 4 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "linear"
                      }}
                    />
                  ))}

                  {/* LED Strip Effect */}
                  <div className="absolute inset-x-4 top-4 h-1 bg-gradient-to-r from-transparent via-eko-emerald to-transparent animate-pulse" />
                  
                  {/* Glass Texture Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(255,255,255,0.1)_95%)] bg-[length:100%_20px]" />
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-eko-emerald/20 via-transparent to-cyan-500/20 animate-pulse" />
              </motion.div>
            </div>

            {/* Floating Specs */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="absolute top-1/4 left-8 bg-black/80 backdrop-blur-xl border border-eko-emerald/30 rounded-xl p-4"
            >
              <div className="text-eko-emerald text-2xl font-bold mb-1">120L</div>
              <div className="text-white/60 text-xs">Reactor Volume</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              viewport={{ once: true }}
              className="absolute top-1/2 right-8 bg-black/80 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-4"
            >
              <div className="text-cyan-400 text-2xl font-bold mb-1">85%</div>
              <div className="text-white/60 text-xs">PM2.5 Efficiency</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              viewport={{ once: true }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-blue-500/30 rounded-xl p-4"
            >
              <div className="text-blue-400 text-2xl font-bold mb-1">5-Stage</div>
              <div className="text-white/60 text-xs">Hybrid Filtration</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-eko-emerald/10 to-transparent border border-eko-emerald/20 rounded-2xl p-8 text-center"
          >
            <div className="mb-4">
              <Droplets className="mx-auto text-eko-emerald" size={40} />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Bio-Photoreactor</h3>
            <p className="text-white/60 text-sm">Living microalgae continuously absorb CO₂ and produce pure oxygen</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-400/20 rounded-2xl p-8 text-center"
          >
            <div className="mb-4">
              <Lightning className="mx-auto text-cyan-400" size={40} />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Smart Sensors</h3>
            <p className="text-white/60 text-sm">Real-time monitoring of pH, turbidity, and dissolved oxygen levels</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-400/20 rounded-2xl p-8 text-center"
          >
            <div className="mb-4">
              <Radio className="mx-auto text-blue-400" size={40} />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">IoT Connected</h3>
            <p className="text-white/60 text-sm">WiFi-enabled with cloud sync and mobile app control</p>
          </motion.div>
        </div>

        {/* Exploded View Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-4">Precision Engineering</h3>
          <p className="text-white/40 text-sm font-mono mb-8">Every layer serves a purpose</p>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { label: "Pre-Filter", color: "eko-emerald" },
              { label: "HEPA Layer", color: "cyan-400" },
              { label: "Bio-Reactor", color: "blue-400" },
              { label: "UV Chamber", color: "purple-400" },
              { label: "Carbon Filter", color: "pink-400" }
            ].map((layer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/30 transition-all"
              >
                <div className={`w-full h-24 bg-gradient-to-b from-${layer.color}/20 to-transparent rounded-lg mb-3`} />
                <div className="text-white/80 text-sm font-medium">{layer.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Main SpecsPage Component
const SpecsPage = () => {
  const [liveData, setLiveData] = useState({
    devices: 1247,
    airCleaned: 3.2,
    co2Reduced: 890
  });

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        devices: prev.devices + Math.floor(Math.random() * 3),
        airCleaned: parseFloat((prev.airCleaned + Math.random() * 0.1).toFixed(1)),
        co2Reduced: prev.co2Reduced + Math.floor(Math.random() * 5)
      }));
    }, 3000);

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

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-eko-emerald/5 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[180px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-blue-500/5 rounded-full blur-[160px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Add CSS for gradient animation */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
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

        {/* Live Global Stats */}
        <div className="px-6 mb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                <AnimatedGradientText>Live Global Network</AnimatedGradientText>
              </h2>
              <p className="text-white/40 text-sm">Real-time data from deployed units worldwide</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <LiveMetricCard
                icon={Radio}
                label="Active Devices"
                value={<LiveCounter target={liveData.devices} suffix="+" />}
                trend="+12 today"
                delay={0.1}
              />
              <LiveMetricCard
                icon={Wind}
                label="Air Cleaned (M m³)"
                value={<LiveCounter target={liveData.airCleaned} suffix=" M" />}
                trend="+0.2M this week"
                delay={0.2}
              />
              <LiveMetricCard
                icon={Droplets}
                label="CO₂ Reduced (kg)"
                value={<LiveCounter target={liveData.co2Reduced} suffix=" kg" />}
                trend="+45kg today"
                delay={0.3}
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

        {/* Apple-Style Product Showcase */}
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
