import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Environment, 
  Float, 
  MeshTransmissionMaterial, 
  AccumulativeShadows,
  RandomizedLight,
  CameraControls,
  Center
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { 
  ArrowLeft, Ruler, Zap, Container, Wifi, Layers, Clock,
  Droplets, Wind, Activity, Cpu, Database, Thermometer,
  Shield, Gauge, Radio, TrendingUp, Home, Building2, GraduationCap,
  Maximize, Minimize, Terminal, Scan
} from 'lucide-react';

// ==========================================
// 1. HELPER COMPONENTS
// ==========================================

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
      <p className="text-white/30 text-sm font-mono leading-relaxed">{description}</p>
    </motion.div>
  );
};

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
            icon={Home} title="Residential" subtitle="Ideal for living rooms & apartments" color="emerald" delay={0.1}
            points={["Ultra-quiet sleep mode (<25dB)", "Ambient LED mood lighting", "Pet dander & allergen filtration"]}
          />
          <DeploymentCard 
            icon={Building2} title="Commercial" subtitle="High-traffic offices & lobbies" color="blue" delay={0.2}
            points={["High-capacity CO₂ reduction", "VOC removal from office equipment", "Centralized MQTT dashboard"]}
          />
          <DeploymentCard 
            icon={GraduationCap} title="Educational" subtitle="Schools, Labs & Museums" color="orange" delay={0.3}
            points={["Visible bio-reactor for STEM learning", "Safe, tamper-proof design", "Real-time AQI display for students"]}
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. 3D MODEL DEFINITIONS (1.6x Scale)
// ==========================================

const MAT = {
  accent: new THREE.Color("#10B981"), 
  titanium: new THREE.Color("#c0c0c0"),
  cyanLight: new THREE.Color("#06b6d4"),
  darkBody: "#1a1a1a",
  chrome: "#333"
};

const SupportFrame = () => (
  <group>
    {[0, 120, 240].map((rot, i) => (
      <group key={i} rotation={[0, rot * Math.PI / 180, 0]}>
        <mesh position={[1.1, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 6, 16]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.2} />
        </mesh>
        {[-2, -0.5, 0.5, 2].map((y, j) => (
           <mesh key={j} position={[1.1, y, 0]} rotation={[0,0,Math.PI/2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.1, 16]} />
              <meshStandardMaterial color="#555" metalness={1} />
           </mesh>
        ))}
      </group>
    ))}
  </group>
);

const CycloneModule = ({ isFocused }) => {
  const opacity = isFocused ? 1 : 0.15;
  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.6, 0.3, 1.5, 64]} />
        <meshStandardMaterial color={MAT.darkBody} metalness={0.6} roughness={0.4} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.4, 64]} />
        <meshStandardMaterial color={MAT.chrome} metalness={0.8} roughness={0.2} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, -0.2, 0]} visible={isFocused}>
        <cylinderGeometry args={[0.35, 0.05, 1.0, 32]} />
        <meshBasicMaterial color={MAT.accent} transparent opacity={0.15} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

const FilterModule = ({ isFocused }) => {
  const opacity = isFocused ? 1 : 0.15;
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.9, 0.9, 0.8, 64, 1, true]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.4} wireframe transparent opacity={opacity * 0.3} />
      </mesh>
      <mesh scale={[0.95, 0.95, 0.95]}>
        <cylinderGeometry args={[0.9, 0.9, 0.8, 64]} />
        <meshStandardMaterial color="#eee" roughness={0.9} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <torusGeometry args={[0.9, 0.05, 16, 64]} />
        <meshStandardMaterial color="#111" roughness={0.5} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, -0.42, 0]}>
        <torusGeometry args={[0.9, 0.05, 16, 64]} />
        <meshStandardMaterial color="#111" roughness={0.5} transparent opacity={opacity} />
      </mesh>
    </group>
  );
};

const PCOModule = ({ isFocused }) => {
  const opacity = isFocused ? 1 : 0.15;
  return (
    <group>
      <group>
        {[0, 60, 120].map((rot, i) => (
           <mesh key={i} rotation={[0, rot * Math.PI/180, 0]}>
             <boxGeometry args={[1.7, 0.1, 0.1]} />
             <meshStandardMaterial color={MAT.titanium} metalness={1.0} roughness={0.2} transparent opacity={opacity} />
           </mesh>
        ))}
      </group>
      <mesh visible={isFocused}>
        <cylinderGeometry args={[0.5, 0.5, 0.4, 32]} />
        <meshBasicMaterial color={MAT.cyanLight} toneMapped={false} />
      </mesh>
      <mesh>
         <cylinderGeometry args={[0.8, 0.8, 0.5, 64, 1, true]} />
         <meshStandardMaterial color="#222" side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

const BioModule = ({ isFocused }) => {
  const opacity = isFocused ? 1 : 0.1;
  const bubbles = useMemo(() => Array.from({ length: 30 }).map(() => ({
    pos: [Math.random()*0.5-0.25, Math.random()*2-1, Math.random()*0.5-0.25],
    scale: Math.random()*0.05 + 0.02,
    speed: Math.random()*0.5 + 0.2
  })), []);

  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current && isFocused) {
      ref.current.children.forEach(child => {
        child.position.y += delta * child.userData.speed;
        if (child.position.y > 1) child.position.y = -1;
      });
    }
  });

  return (
    <group>
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.1, 64]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} transparent opacity={opacity} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[1.0, 1.0, 2.5, 64]} />
        <MeshTransmissionMaterial
            backside samples={6} thickness={0.2} roughness={0.1} anisotropy={0.1} chromaticAberration={0.02}
            color="#ffffff" resolution={512} transparent opacity={isFocused ? 1 : 0.2}
        />
      </mesh>
      <mesh scale={[0.95, 0.98, 0.95]}>
         <cylinderGeometry args={[0.95, 0.95, 2.45, 32]} />
         <meshPhysicalMaterial color={MAT.accent} transmission={0.2} roughness={0.1} opacity={isFocused ? 0.9 : 0} transparent />
      </mesh>
      <group ref={ref} visible={isFocused}>
        {bubbles.map((b, i) => (
            <mesh key={i} position={b.pos} scale={b.scale} userData={{speed: b.speed}}>
                <sphereGeometry />
                <meshBasicMaterial color="#ccfbf1" transparent opacity={0.5} />
            </mesh>
        ))}
      </group>
    </group>
  );
};

const MachineAssembly = ({ step }) => (
  // 1.6x Scale maintained
  <group scale={1.6}>
    <SupportFrame />
    <group position={[0, 2.3, 0]}><BioModule isFocused={step === 0 || step === 4} /></group>
    <group position={[0, 0.6, 0]}><PCOModule isFocused={step === 0 || step === 3} /></group>
    <group position={[0, -0.4, 0]}><FilterModule isFocused={step === 0 || step === 2} /></group>
    <group position={[0, -1.8, 0]}><CycloneModule isFocused={step === 0 || step === 1} /></group>
    <AccumulativeShadows position={[0, -3.5, 0]} frames={60} alphaTest={0.85} scale={10}>
       <RandomizedLight amount={8} radius={4} ambient={0.5} position={[5, 5, -10]} bias={0.001} />
    </AccumulativeShadows>
  </group>
);

// ==========================================
// 3. INTELLIGENT SYSTEM (Camera + Terminal)
// ==========================================

const SystemTerminal = ({ step, isFullscreen }) => {
  const terminalData = {
    0: ["SYSTEM_INTEGRITY: 100%", "POWER_GRID: ACTIVE", "SENSORS: ONLINE", "MODE: HYBRID_PURIFICATION"],
    1: ["MODULE: CYCLONE_VORTEX", "RPM: 12,000", "G-FORCE: 700G", "STATUS: SEPARATING_PARTICULATES"],
    2: ["MODULE: HEPA_H13", "EFFICIENCY: 99.97%", "PRESSURE_DROP: 25Pa", "LIFESPAN: 98%"],
    3: ["MODULE: PCO_CORE", "UV_WAVELENGTH: 365nm", "CATALYST: TiO2_LATTICE", "REACTION: OXIDATION_ACTIVE"],
    4: ["MODULE: BIO_REACTOR", "SPECIES: C. pyrenoidosa", "VOLUME: 120L", "O2_OUTPUT: 600g/day"]
  };

  const lines = terminalData[step] || [];

  return (
    <div className={`absolute bottom-8 right-8 z-[60] bg-black/80 backdrop-blur-md border border-white/20 p-6 rounded-lg font-mono text-xs md:text-sm text-green-400 w-80 shadow-2xl transition-all duration-500 ${isFullscreen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <div className="flex items-center justify-between border-b border-green-500/30 pb-2 mb-3">
        <span className="flex items-center gap-2"><Terminal size={14} /> TERMINAL_VIEW</span>
        <span className="animate-pulse">● REC</span>
      </div>
      <div className="space-y-2">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-gray-500">{`>`}</span>
            <span className="typing-effect">{line}</span>
          </div>
        ))}
        <div className="flex gap-2 animate-pulse">
          <span className="text-gray-500">{`>`}</span>
          <span className="w-2 h-4 bg-green-500 block"></span>
        </div>
      </div>
    </div>
  );
};

const TechStack3D = () => {
  const [activeStep, setActiveStep] = useState(0); 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const cameraRef = useRef();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  // CAMERA RIG
  useEffect(() => {
    if (cameraRef.current) {
      const config = {
        // Step 0: Moved Z to 10.5 so the entire 1.6x scale model is visible
        0: { pos: [0, 0, 10.5], look: [0, 0, 0] }, 
        1: { pos: [0, -1.8, 4.0], look: [0, -1.8, 0] },
        2: { pos: [0, -0.4, 4.0], look: [0, -0.4, 0] },
        3: { pos: [0, 0.6, 4.0], look: [0, 0.6, 0] },
        4: { pos: [0, 2.3, 4.0], look: [0, 2.3, 0] }
      };
      
      const { pos, look } = config[activeStep] || config[0];
      // Fly to new position smoothly
      cameraRef.current.setLookAt(pos[0], pos[1], pos[2], look[0], look[1], look[2], true);
    }
  }, [activeStep]);

  const labels = ["FULL SYSTEM", "CYCLONE", "HEPA FILTER", "PCO CORE", "BIO REACTOR"];

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${isFullscreen ? 'h-screen' : 'h-[90vh] md:h-screen'} bg-[#050505] border-t border-white/10 mt-20 overflow-hidden flex flex-col items-center justify-center transition-all duration-500 group`}
    >
      
      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 0, 10.5], fov: 35 }} gl={{ toneMappingExposure: 0.9 }}>
        <color attach="background" args={['#050505']} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1.5} color="#fff" castShadow />
        <spotLight position={[-10, 5, 0]} angle={0.5} penumbra={1} intensity={2} color="#059669" />
        <Environment preset="city" blur={1} />
        
        {/* ROBUST CONTROLS: 360 Rotation Enabled */}
        <CameraControls 
          ref={cameraRef} 
          minDistance={3} 
          maxDistance={15} 
          minPolarAngle={0}          // Allow looking from top
          maxPolarAngle={Math.PI}    // Allow looking from bottom
          dollySpeed={0.5} 
          smoothTime={0.8}
        />

        <Center>
          <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
            <MachineAssembly step={activeStep} />
          </Float>
        </Center>

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.8} radius={0.4} />
          <Noise opacity={0.04} />
          <Vignette eskil={false} offset={0.1} darkness={1.0} />
        </EffectComposer>
      </Canvas>

      {/* UI OVERLAYS */}
      
      {/* 1. Header */}
      <div className="absolute top-8 left-0 right-0 z-20 text-center pointer-events-none select-none">
        <h3 className="text-eko-emerald font-mono text-xs tracking-[0.3em] uppercase mb-2">Interactive Schematic</h3>
        <h2 className="text-3xl md:text-5xl font-bold text-white">System <span className="text-white/30">Anatomy</span></h2>
      </div>

      {/* 2. Fullscreen Toggle */}
      <button 
        onClick={toggleFullscreen}
        className="absolute top-8 right-8 z-50 bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-all backdrop-blur-md"
      >
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>

      {/* 3. TERMINAL VIEW (Bottom Right) */}
      <SystemTerminal step={activeStep} isFullscreen={isFullscreen} />

      {/* 4. CONTROLS (Bottom) */}
      <div className="absolute bottom-0 z-50 w-full pb-12 pt-32 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center gap-8 pointer-events-auto">
        
        {/* Active Stage Label */}
        <AnimatePresence mode='wait'>
          <motion.div 
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center select-none relative z-20"
          >
            <span className="text-[120px] leading-none font-black text-white/5 absolute -translate-y-12 md:-translate-y-16">{`0${activeStep}`}</span>
            <span className="text-eko-emerald font-bold tracking-[0.2em] text-xl md:text-3xl uppercase relative drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              {labels[activeStep]}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* CLICK TRACK */}
        <div className="w-full max-w-2xl px-6 relative h-16 flex items-center justify-center">
          <div className="absolute left-6 right-6 h-1.5 bg-white/10 rounded-full" />
          <motion.div 
            className="absolute left-6 h-1.5 bg-eko-emerald rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(activeStep / 4) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ maxWidth: 'calc(100% - 3rem)' }}
          />
          <div className="absolute left-0 w-full px-6 flex justify-between z-30">
            {[0, 1, 2, 3, 4].map((step) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className="group relative w-12 h-12 flex items-center justify-center focus:outline-none"
              >
                <motion.div 
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    step <= activeStep 
                      ? 'bg-eko-emerald border-eko-emerald shadow-[0_0_15px_#10B981]' 
                      : 'bg-[#111] border-white/20 hover:border-white/50'
                  }`}
                  animate={{ scale: step === activeStep ? 1.3 : 1 }}
                />
                <div className="absolute inset-0 rounded-full" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-8 text-[10px] font-mono text-white/40 uppercase tracking-wider select-none">
          <span>Click Points to Inspect</span>
          <span>Drag Model to Rotate 360°</span>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

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
        .perspective-1000 { perspective: 1000px; }
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

        {/* Deployment Section */}
        <DeploymentSection />

        {/* --- 3D INTERACTIVE SECTION --- */}
        <TechStack3D />

        {/* Certifications */}
        <div className="px-6 mb-12 mt-20">
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