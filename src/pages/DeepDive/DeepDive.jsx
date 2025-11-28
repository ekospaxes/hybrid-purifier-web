// src/components/DeepDive.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import anime from 'animejs';
import {
  Wind, Zap, Sun, Leaf, Activity, Layers, Cpu,
  Hexagon, Thermometer, Droplets, Eye, Server, Maximize, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ==========================================
// Shared UI
// ==========================================
const Typewriter = ({ text, delay = 0, className = "" }) => {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let interval = null;
    let timer = null;

    timer = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        setDisplay(text.substring(0, i + 1));
        i++;
        if (i >= text.length && interval) {
          clearInterval(interval);
          interval = null;
        }
      }, 30);
    }, delay);

    return () => {
      if (timer) clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [text, delay]);

  return <span className={`font-mono ${className}`}>{display}</span>;
};

const Panel = ({ children, className = "" }) => (
  <div className={`bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden relative ${className}`}>
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
    </div>
    {children}
  </div>
);

// ==========================================
// PhysicsEngine
// ==========================================
const PhysicsEngine = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const resize = () => {
      const w = Math.max(300, canvas.offsetWidth || 600);
      const h = Math.max(200, canvas.offsetHeight || 400);
      canvas.width = w;
      canvas.height = h;

      particlesRef.current = Array.from({ length: 60 }, () => ({
        x: w / 2,
        y: h / 2,
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 100 + 20,
        speed: Math.random() * 0.05 + 0.02,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#10B981' : '#555'
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;
      const maxRadius = Math.min(w, h) / 2 - 20;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed;
        p.radius += 0.5;

        if (p.radius > maxRadius) {
          p.radius = Math.random() * 50;
        }

        p.x = w / 2 + Math.cos(p.angle) * p.radius;
        p.y = h / 2 + Math.sin(p.angle) * p.radius;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 30, 0, Math.PI * 2);
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Inertial Physics</h2>
          <Typewriter text="Simulation of centrifugal separation dynamics." className="text-eko-emerald text-sm" />
        </div>
        <div className="text-right font-mono text-xs text-gray-500">
          <div>ANGULAR VELOCITY</div>
          <div className="text-xl text-white">1500 RPM</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <Panel className="lg:col-span-2 relative group min-h-[300px]">
          <div className="absolute top-4 left-4 z-10 text-[10px] font-mono text-eko-emerald border border-eko-emerald/30 px-2 py-1 rounded bg-black/50">LIVE RENDER</div>
          <canvas
            ref={canvasRef}
            className="w-full h-full block opacity-60 group-hover:opacity-100 transition-opacity duration-500"
          />
        </Panel>

        <div className="space-y-4">
          <Panel className="p-6 hover:border-eko-emerald/50 transition-colors">
            <Wind className="text-gray-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">Cyclone</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Centrifugal force (F=mv²/r) separates particles {'>'}50µm.
            </p>
            <div className="h-1 w-full bg-gray-800 rounded overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1.5 }} className="h-full bg-eko-emerald" />
            </div>
          </Panel>

          <Panel className="p-6 hover:border-yellow-400/50 transition-colors">
            <Zap className="text-yellow-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">Electrostatics</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Coulomb force (F=qE) drives charged particles to plates.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// ChemicalReactor
// ==========================================
const ChemicalReactor = () => {
  const containerRef = useRef(null);
  const animeInstanceRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const radicalEls = container.querySelectorAll('.radical');
      radicalEls.forEach(el => {
        el.style.top = `${rect.height / 2}px`;
        el.style.left = `${rect.width / 2}px`;
      });
    }

    animeInstanceRef.current = anime({
      targets: '.radical',
      translateX: () => anime.random(-40, 40),
      translateY: () => anime.random(-40, 40),
      scale: [0, 1],
      opacity: [1, 0],
      delay: anime.stagger(100),
      loop: true,
      easing: 'easeOutExpo'
    });

    return () => {
      if (animeInstanceRef.current && animeInstanceRef.current.pause) {
        try { animeInstanceRef.current.pause(); } catch (e) { /* noop */ }
      }
      const reds = container ? container.querySelectorAll('.radical') : [];
      reds.forEach(el => {
        el.style.transform = '';
      });
    };
  }, []);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Molecular Engineering</h2>
          <Typewriter text="Stoichiometric analysis of core reactions." className="text-purple-400 text-sm" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 flex-1">
        <Panel className="p-8 flex flex-col justify-between group hover:border-purple-500/50 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg"><Sun className="text-purple-400" /></div>
              <h3 className="text-xl font-bold text-white">Photocatalysis</h3>
            </div>
            <div className="font-mono text-sm bg-black/50 p-4 rounded border border-white/10 text-gray-300 mb-8">
              <div>TiO₂ + hν (365nm) → e⁻ + h⁺</div>
              <div className="text-purple-400 mt-2">h⁺ + H₂O → H⁺ + •OH</div>
            </div>
          </div>
          <div ref={containerRef} className="relative h-32 w-full bg-black/40 rounded-lg overflow-hidden flex items-center justify-center border border-white/5">
            <div className="absolute inset-0 bg-purple-500/5 animate-pulse" />
            <div className="w-1 h-full bg-purple-500/50 blur-md absolute left-1/2 -translate-x-1/2" />
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="radical absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"
                style={{ top: '50%', left: '50%' }}
              />
            ))}
          </div>
        </Panel>

        <Panel className="p-8 flex flex-col justify-between group hover:border-eko-emerald/50 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-eko-emerald/10 rounded-lg"><Leaf className="text-eko-emerald" /></div>
              <h3 className="text-xl font-bold text-white">Photosynthesis</h3>
            </div>
            <div className="font-mono text-sm bg-black/50 p-4 rounded border border-white/10 text-gray-300 mb-8">
              <div>6CO₂ + 6H₂O + Light →</div>
              <div className="text-eko-emerald mt-2">C₆H₁₂O₆ + 6O₂</div>
            </div>
          </div>
          <div className="relative h-32 w-full bg-black/40 rounded-lg overflow-hidden border border-white/5">
            <div className="absolute bottom-0 w-full h-1/2 bg-eko-emerald/10" />
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: -20, opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: i * 0.5, ease: "linear" }}
                className="absolute bottom-0 left-1/2 w-3 h-3 rounded-full border border-eko-emerald bg-eko-emerald/30"
                style={{ left: `${20 + i * 15}%` }}
              />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
};

// ==========================================
// Materials
// ==========================================
const Materials = () => {
  const items = [
    { icon: Maximize, title: "Structural Core", specs: ["Acrylic Cylinder (5mm Wall)", "Stainless Steel Frame", "Aluminum Flex Ducting"], cost: "₹12,500" },
    { icon: Wind, title: "Filtration Stack", specs: ["DIY Sheet Metal Cyclone", "6-8kV DC ESP Module", "H13 HEPA Cassette"], cost: "₹10,300" },
    { icon: Zap, title: "Electronics & Power", specs: ["Arduino R4 WiFi MCU", "3.5\" TFT Touchscreen", "12V 20Ah LiFePO4 UPS"], cost: "₹15,100" },
    { icon: Activity, title: "Sensor Suite", specs: ["PMS5003 PM Laser Sensor", "MH-Z19B CO₂ NDIR Sensor", "BME680 VOC Gas Sensor"], cost: "₹10,050" }
  ];

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-bold text-white">Bill of Materials</h2>
        <div className="flex items-center gap-2 text-xs font-mono text-eko-emerald px-3 py-1 bg-eko-emerald/10 rounded border border-eko-emerald/20">
          <Hexagon size={12} /> SCHEMATIC VIEW
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-2">
        {items.map((item, i) => (
          <Panel key={i} className="p-6 hover:border-white/30 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-eko-emerald group-hover:text-black transition-colors">
                  <item.icon size={20} />
                </div>
                <h3 className="font-bold text-white">{item.title}</h3>
              </div>
              <span className="text-xs font-mono text-gray-600">{item.cost}</span>
            </div>
            <div className="space-y-2 pl-11">
              {item.specs.map((s, j) => (
                <div key={j} className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                  <div className="w-1 h-1 bg-eko-emerald rounded-full" />
                  {s}
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// Sensors
// ==========================================
const Sensors = () => {
  const sensorData = [
    { name: "PMS5003", label: "LASER SCATTER", val: "PM2.5", icon: Wind },
    { name: "MH-Z19B", label: "NDIR INFRARED", val: "CO2", icon: Droplets },
    { name: "BME680", label: "MOX GAS", val: "VOCs", icon: Activity },
    { name: "DS18B20", label: "THERMAL PROBE", val: "27°C", icon: Thermometer },
    { name: "OPTICAL DO", label: "FLUORESCENCE", val: "O2 MG/L", icon: Eye },
    { name: "ARDUINO R4", label: "CORTEX M4", val: "48MHz", icon: Server }
  ];

  return (
    <div className="h-full flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-white">Telemetry Network</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 relative">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-xl">
          <motion.div
            animate={{ top: ["-10%", "120%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-px bg-eko-emerald/50 shadow-[0_0_20px_#10B981]"
          />
        </div>

        {sensorData.map((s, i) => (
          <Panel key={i} className="p-6 flex flex-col justify-between hover:border-eko-emerald/50 transition-colors group z-10">
            <div className="flex justify-between items-start">
              <s.icon className="text-gray-500 group-hover:text-eko-emerald transition-colors" size={24} />
              <span className="text-[10px] font-mono text-gray-700 group-hover:text-eko-emerald">ID_0{i + 1}</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white font-mono">{s.name}</h4>
              <div className="text-[10px] text-eko-emerald bg-eko-emerald/10 inline-block px-1 rounded mt-1">{s.label}</div>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
              <span className="text-xs text-gray-500 font-mono">OUTPUT</span>
              <span className="text-xl font-bold text-white">{s.val}</span>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// Logic
// ==========================================
const Logic = () => {
  const [lines, setLines] = useState([
    "[BOOT] SYSTEM KERNEL INIT...",
    "[LOAD] SENSOR DRIVERS... OK",
    "[NETW] WIFI CONNECTING (SSID: EKO_LAB)...",
    "[NETW] IP ASSIGNED: 192.168.1.42"
  ]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const logs = [
      "[LOOP] POLLING SENSORS (100ms)",
      "[DATA] PM2.5: 342ug/m3 (CRITICAL)",
      "[ALRT] TRIGGER: CYCLONE RPM -> 1500",
      "[ALRT] TRIGGER: HV GEN -> 8kV",
      "[PID ] HEATER ADJUST: 26.5°C -> 27.0°C",
      "[BIO ] PH PROBE: 6.8 (OPTIMAL)",
      "[MQTT] PAYLOAD SENT -> CLOUD",
      "[WAIT] SYNCING..."
    ];

    intervalRef.current = setInterval(() => {
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      setLines(prev => {
        const next = [...prev.slice(-14), `[${timestamp}] ${randomLog}`];
        return next;
      });
    }, 800);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="h-full flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-white">System Firmware</h2>
      <Panel className="flex-1 p-6 font-mono text-xs md:text-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4 text-gray-500">
          <span>TERMINAL: /var/log/syslog</span>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
            <div className="w-3 h-3 rounded-full bg-green-500/50 animate-pulse" />
          </div>
        </div>
        <div className="flex-1 space-y-1 overflow-hidden">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              className={`${line.includes("CRITICAL") ? "text-red-500 font-bold" : line.includes("ALRT") ? "text-yellow-400" : "text-eko-emerald"}`}
            >
              {line}
            </motion.div>
          ))}
        </div>
      </Panel>
    </div>
  );
};

// ==========================================
// Main container (note: paddingTop = header height)
// ==========================================
const DeepDive = () => {
  const [activeTab, setActiveTab] = useState('physics');

  const tabs = [
    { id: 'physics', label: 'Physics Engine', icon: Wind },
    { id: 'chemistry', label: 'Reaction Chamber', icon: Sun },
    { id: 'materials', label: 'Materials Blueprint', icon: Layers },
    { id: 'sensors', label: 'Sensor Grid', icon: Activity },
    { id: 'logic', label: 'Logic Core', icon: Cpu },
  ];

  return (
    // Replace '72px' with your navbar height if different
    <div className="min-h-screen w-full bg-black text-white overflow-hidden flex" style={{ paddingTop: '72px' }}>
      {/* --- LEFT COMMAND DECK --- */}
      <div className="w-20 md:w-72 border-r border-white/10 bg-black/50 backdrop-blur-xl flex flex-col z-20">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-eko-emerald/20 rounded-lg flex items-center justify-center group-hover:bg-eko-emerald transition-colors">
              <ArrowLeft size={16} className="text-eko-emerald group-hover:text-black" />
            </div>
            <span className="hidden md:block font-bold tracking-tight hover:text-eko-emerald transition-colors">EXIT DECK</span>
          </Link>
        </div>

        <nav className="flex-1 py-6 space-y-1 px-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 group ${
                activeTab === tab.id
                  ? 'bg-eko-emerald/10 border border-eko-emerald/30 text-eko-emerald'
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? "animate-pulse" : ""} />
              <span className="hidden md:block font-medium text-sm">{tab.label}</span>
              {activeTab === tab.id && <div className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-eko-emerald shadow-[0_0_10px_#10B981]" />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10 hidden md:block">
          <div className="text-[10px] text-gray-600 font-mono mb-2">SYSTEM STATUS</div>
          <div className="flex items-center gap-2 text-eko-emerald text-xs font-bold">
            <div className="w-2 h-2 bg-eko-emerald rounded-full animate-pulse" />
            ALL SYSTEMS ONLINE
          </div>
        </div>
      </div>

      {/* --- RIGHT CONTENT AREA --- */}
      <div className="flex-1 relative overflow-hidden flex flex-col p-6 md:p-12">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
             style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #10B981 1px, transparent 0)`, backgroundSize: '40px 40px' }}>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="h-full w-full max-w-6xl mx-auto relative z-10"
          >
            {activeTab === 'physics' && <PhysicsEngine />}
            {activeTab === 'chemistry' && <ChemicalReactor />}
            {activeTab === 'materials' && <Materials />}
            {activeTab === 'sensors' && <Sensors />}
            {activeTab === 'logic' && <Logic />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DeepDive;
