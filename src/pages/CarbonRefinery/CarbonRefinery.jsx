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
  Center,
  Grid,
  Text,
  RoundedBox
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { 
  ArrowLeft, Zap, Wind, Activity, 
  Thermometer, Gauge, Car, Minimize, Maximize, Terminal, 
  CheckCircle, Snowflake, Timer
} from 'lucide-react';

// ==========================================
// 1. CONFIG & MATERIALS
// ==========================================
const COLORS = {
  cyan: "#06b6d4",
  cyanGlow: "#22d3ee",
  hot: "#f43f5e",
  darkMeta: "#111111", 
  titanium: "#444444", 
  glass: "#aaddff"
};

const AnimatedGradientText = ({ children, className = "" }) => (
  <span className={`relative inline-block ${className}`}>
    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
      {children}
    </span>
  </span>
);

// ==========================================
// 2. HIGH-FIDELITY COMPONENTS
// ==========================================

// PART 1: INTAKE MANIFOLD
const IntakeCoupler = ({ isFocused }) => {
    const active = isFocused;
    return (
        <group position={[-2.4, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
            {/* Hexagonal Flange */}
            <mesh position={[0, -0.1, 0]}>
                <cylinderGeometry args={[0.7, 0.7, 0.15, 6]} />
                <meshStandardMaterial color="#333" metalness={0.9} roughness={0.4} />
            </mesh>
            {/* Bolts */}
            {[0, 60, 120, 180, 240, 300].map((r, i) => (
                <mesh key={i} position={[Math.cos(r*Math.PI/180)*0.55, -0.1, Math.sin(r*Math.PI/180)*0.55]}>
                    <cylinderGeometry args={[0.08, 0.08, 0.2, 6]} />
                    <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
                </mesh>
            ))}
            {/* Pipe */}
            <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.45, 0.5, 0.8, 32]} />
                <meshStandardMaterial color={active ? "#555" : "#333"} metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Glow Ring */}
            <mesh position={[0, 0.81, 0]}>
                <torusGeometry args={[0.46, 0.02, 16, 64]} />
                <meshBasicMaterial color={active ? COLORS.cyan : "#222"} toneMapped={false} />
            </mesh>
            
            {active && (
                 <Text 
                    position={[0, 0.5, 0.6]} 
                    rotation={[Math.PI/2, 0, 0]} 
                    fontSize={0.15} 
                    color={COLORS.cyanGlow}
                    anchorX="center" 
                    anchorY="middle"
                >
                    INTAKE
                </Text>
            )}
        </group>
    )
}

// PART 2: HEAT EXCHANGER
const CompressionChamber = ({ isFocused }) => {
    const active = isFocused;
    
    return (
        <group position={[-0.8, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
            <mesh>
                <cylinderGeometry args={[0.85, 0.85, 2.2, 64]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
            </mesh>
            
            {/* Fins */}
            {Array.from({length: 12}).map((_, i) => (
                <mesh key={i} position={[0, (i - 5.5) * 0.15, 0]}>
                    <cylinderGeometry args={[0.92, 0.92, 0.05, 64]} />
                    <meshStandardMaterial 
                        color={active ? "#222" : "#111"} 
                        metalness={0.8} 
                        roughness={0.2}
                        emissive={active ? COLORS.hot : "#000"}
                        emissiveIntensity={active ? 0.2 : 0}
                    />
                </mesh>
            ))}

            {/* Support Struts */}
            {[0, 90, 180, 270].map((r, i) => (
                <mesh key={i} rotation={[0, r * Math.PI/180, 0]} position={[0.9, 0, 0]}>
                     <boxGeometry args={[0.1, 2.2, 0.05]} />
                     <meshStandardMaterial color="#444" metalness={1} />
                </mesh>
            ))}

            {active && (
                 <Text 
                    position={[0, 0, 1.1]} 
                    rotation={[Math.PI/2, 0, 0]} 
                    fontSize={0.2} 
                    color={COLORS.hot}
                    anchorX="center" 
                    anchorY="middle"
                >
                    HEAT SINK
                </Text>
            )}
        </group>
    )
}

// PART 3: TURBINE SEPARATOR
const SeparationCore = ({ isFocused }) => {
    const fanRef = useRef();
    useFrame((state, delta) => {
        if(fanRef.current && isFocused) fanRef.current.rotation.y -= delta * 20; 
    });

    return (
        <group position={[1.4, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
             {/* Housing */}
             <group>
                <mesh position={[0, 0.6, 0]}>
                    <cylinderGeometry args={[0.9, 0.9, 0.1, 64]} />
                    <meshStandardMaterial color="#333" metalness={0.9} />
                </mesh>
                <mesh position={[0, -0.6, 0]}>
                    <cylinderGeometry args={[0.9, 0.9, 0.1, 64]} />
                    <meshStandardMaterial color="#333" metalness={0.9} />
                </mesh>
             </group>

             {/* Glass */}
             <mesh>
                <cylinderGeometry args={[0.85, 0.85, 1.1, 64]} />
                <MeshTransmissionMaterial 
                    backside thickness={1} roughness={0.1} 
                    color={isFocused ? "#ffffff" : "#888"} 
                    transmission={1} 
                    chromaticAberration={0.2}
                    anisotropy={0.5}
                />
             </mesh>
             
             {/* Impeller */}
             <group ref={fanRef}>
                 <mesh>
                     <cylinderGeometry args={[0.2, 0.2, 1, 32]} />
                     <meshStandardMaterial color="#555" metalness={1} />
                 </mesh>
                 {[0, 45, 90, 135, 180, 225, 270, 315].map((r, i) => (
                     <group key={i} rotation={[0, r * Math.PI/180, 0]}>
                        <mesh position={[0.4, 0, 0]} rotation={[0.5, 0, 0]}>
                             <boxGeometry args={[0.6, 0.9, 0.05]} />
                             <meshStandardMaterial color={COLORS.cyan} emissive={COLORS.cyan} emissiveIntensity={1} toneMapped={false} />
                        </mesh>
                     </group>
                 ))}
             </group>

             {isFocused && (
                 <Text 
                    position={[0, 0, 1.1]} 
                    rotation={[Math.PI/2, 0, 0]} 
                    fontSize={0.2} 
                    color={COLORS.cyanGlow}
                    anchorX="center" 
                    anchorY="middle"
                >
                    TURBINE
                </Text>
            )}
        </group>
    )
}

// PART 4: CARBON CARTRIDGE
const CarbonPod = ({ isFocused }) => {
    return (
        <group position={[1.4, -1.2, 0]}>
             {/* Connector */}
             <mesh position={[0, 0.9, 0]}>
                 <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
                 <meshStandardMaterial color="#222" metalness={0.8} />
             </mesh>

             {/* Tank */}
             <mesh position={[0, 0, 0]}>
                 <cylinderGeometry args={[0.35, 0.35, 1.6, 32]} />
                 <meshStandardMaterial color="white" metalness={0.4} roughness={0.2} />
             </mesh>
             
             {/* Caps */}
             <mesh position={[0, 0.8, 0]}>
                 <sphereGeometry args={[0.35, 32, 16, 0, Math.PI*2, 0, Math.PI/2]} />
                 <meshStandardMaterial color="#111" metalness={0.5} />
             </mesh>
             <mesh position={[0, -0.8, 0]} rotation={[Math.PI, 0, 0]}>
                 <sphereGeometry args={[0.35, 32, 16, 0, Math.PI*2, 0, Math.PI/2]} />
                 <meshStandardMaterial color="#111" metalness={0.5} />
             </mesh>

             {/* Fill Meter */}
             <group position={[0, 0, 0.36]}>
                 <mesh>
                     <planeGeometry args={[0.2, 0.8]} />
                     <meshBasicMaterial color="black" />
                 </mesh>
                 <mesh position={[0, -0.2, 0.01]}>
                     <planeGeometry args={[0.15, 0.4]} />
                     <meshBasicMaterial color={COLORS.cyan} />
                 </mesh>
             </group>

             {/* Text Label - Fixed Orientation */}
             <Text 
                position={[0, 0.5, 0.38]} 
                rotation={[0, 0, 0]} 
                fontSize={0.08} 
                color="#888"
                anchorX="center" 
                anchorY="middle"
             >
                 ECO-CARTRIDGE
             </Text>
             <Text 
                position={[0, 0.4, 0.38]} 
                rotation={[0, 0, 0]} 
                fontSize={0.05} 
                color={COLORS.cyan}
                anchorX="center" 
                anchorY="middle"
             >
                 92% FULL
             </Text>
        </group>
    )
}

// PART 5: EXHAUST TIP
const ExhaustTip = ({ isFocused }) => (
    <group position={[2.6, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
        <mesh>
            <cylinderGeometry args={[0.65, 0.7, 0.8, 32]} />
            <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh>
            <cylinderGeometry args={[0.6, 0.65, 0.81, 32, 1, true]} />
            <meshStandardMaterial color="#111" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
            <torusGeometry args={[0.65, 0.05, 16, 64]} />
            <meshStandardMaterial color={isFocused ? COLORS.cyan : "#333"} emissive={isFocused ? COLORS.cyan : "#000"} />
        </mesh>
    </group>
)

const SilencerAssembly = ({ step }) => {
  return (
    <group scale={1.3}>
        <IntakeCoupler isFocused={step === 1} />
        <CompressionChamber isFocused={step === 2} />
        <SeparationCore isFocused={step === 3} />
        <CarbonPod isFocused={step === 4} />
        <ExhaustTip isFocused={step === 0} />
        
        <AccumulativeShadows position={[0, -2.5, 0]} frames={60} alphaTest={0.85} scale={10}>
             <RandomizedLight amount={8} radius={4} ambient={0.5} position={[5, 8, -10]} bias={0.001} />
        </AccumulativeShadows>
    </group>
  );
};

// ==========================================
// 3. UI COMPONENTS
// ==========================================

const SystemTerminal = ({ step, isFullscreen }) => {
  const terminalData = {
    0: ["SYSTEM: CLASS_C_SILENCER_V2", "STATUS: MOUNTED", "CONN: ODB-II ACTIVE", "MODE: AUTO_CAPTURE"],
    1: ["MODULE: INTAKE_MANIFOLD", "TEMP: 450°C", "FLOW: TURBULENT -> LAMINAR", "SEAL: 100%"],
    2: ["MODULE: HEAT_EXCHANGER", "PRESSURE: 12 BAR", "DELTA_T: -200°C", "STATE: LIQUEFACTION_PREP"],
    3: ["MODULE: CENTRIFUGAL_CORE", "RPM: 45,000", "G-FORCE: 2000G", "PARTICULATES: SEPARATED"],
    4: ["MODULE: STORAGE_POD", "CAPACITY: 85%", "TYPE: SOLID_STATE_C", "ACTION: READY_TO_SWAP"]
  };
  const lines = terminalData[step] || [];

  return (
    <div className={`absolute bottom-8 right-8 z-[60] bg-black/80 backdrop-blur-md border border-white/20 p-6 rounded-lg font-mono text-xs md:text-sm text-cyan-400 w-80 shadow-2xl transition-all duration-500 ${isFullscreen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2 mb-3">
        <span className="flex items-center gap-2"><Terminal size={14} /> DIAGNOSTIC_VIEW</span>
        <span className="animate-pulse">● LIVE</span>
      </div>
      <div className="space-y-2">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-gray-500">{`>`}</span>
            <span className="typing-effect">{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SilencerViewer = () => {
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

  // RECALIBRATED CAMERA RIG
  useEffect(() => {
    if (cameraRef.current) {
      const config = {
        0: { pos: [0, 1, 9], look: [0, 0, 0] },          // Wide View
        1: { pos: [-2.5, 1, 5], look: [-2.5, 0, 0] },    // Intake
        2: { pos: [-0.8, 1, 5], look: [-0.8, 0, 0] },    // Chamber
        3: { pos: [1.4, 1, 5], look: [1.4, 0, 0] },      // Turbine
        4: { pos: [1.4, -1, 6], look: [1.4, -1.2, 0] }   // Pod (Lowered Camera)
      };
      const { pos, look } = config[activeStep] || config[0];
      cameraRef.current.setLookAt(pos[0], pos[1], pos[2], look[0], look[1], look[2], true);
    }
  }, [activeStep]);

  const labels = ["FULL ASSEMBLY", "INTAKE FLANGE", "HEAT EXCHANGER", "TURBO SEPARATOR", "CARBON CARTRIDGE"];

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${isFullscreen ? 'h-screen' : 'h-[80vh] md:h-[90vh]'} bg-[#050505] border-t border-white/10 mt-10 overflow-hidden flex flex-col items-center justify-center transition-all duration-500 group`}
    >
      <Canvas shadows camera={{ position: [0, 2, 8], fov: 35 }}>
        <color attach="background" args={['#050505']} />
        
        <ambientLight intensity={0.2} />
        <spotLight position={[5, 10, 5]} intensity={2} color="#ffffff" castShadow angle={0.5} penumbra={1} />
        <pointLight position={[-5, 0, 5]} intensity={1} color={COLORS.cyan} distance={10} />
        <pointLight position={[5, -5, -5]} intensity={1} color={COLORS.hot} distance={10} />
        
        <Environment preset="city" blur={1} />
        <CameraControls ref={cameraRef} minDistance={3} maxDistance={15} />

        <Center>
          <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
            <SilencerAssembly step={activeStep} />
          </Float>
        </Center>

        <Grid position={[0, -2.5, 0]} args={[40, 40]} cellColor="#111" sectionColor={COLORS.cyan} fadeDistance={25} />

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1} radius={0.5} />
          <Noise opacity={0.04} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>

      {/* OVERLAYS */}
      <button onClick={toggleFullscreen} className="absolute top-8 right-8 z-50 bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white backdrop-blur-md transition-colors">
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>

      <SystemTerminal step={activeStep} isFullscreen={isFullscreen} />

      {/* CONTROLS */}
      <div className="absolute bottom-0 z-50 w-full pb-12 pt-32 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center gap-8 pointer-events-auto">
        
        <AnimatePresence mode='wait'>
          <motion.div 
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center select-none relative z-20"
          >
            <span className="text-[120px] leading-none font-black text-white/5 absolute -translate-y-10">{`0${activeStep}`}</span>
            <span className="text-cyan-400 font-bold tracking-[0.2em] text-xl md:text-3xl uppercase drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
              {labels[activeStep]}
            </span>
          </motion.div>
        </AnimatePresence>

        <div className="w-full max-w-2xl px-6 relative h-16 flex items-center justify-center">
          <div className="absolute left-6 right-6 h-1.5 bg-white/10 rounded-full" />
          <motion.div 
            className="absolute left-6 h-1.5 bg-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(activeStep / 4) * 100}%` }}
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
                      ? 'bg-cyan-500 border-cyan-500 shadow-[0_0_15px_#06b6d4]' 
                      : 'bg-[#111] border-white/20 hover:border-white/50'
                  }`}
                  animate={{ scale: step === activeStep ? 1.3 : 1 }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. MAIN PAGE EXPORT
// ==========================================

const CarbonRefinery = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background FX */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <div className="px-6 pt-24 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
                <ArrowLeft size={16} /> Back to Ecosystem
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                        Class C <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Silencer</span>
                    </h1>
                    <p className="text-white/40 max-w-xl text-lg">
                        A revolutionary bolt-on attachment for internal combustion engines. 
                        Captures 90% of exhaust CO₂ and compresses it into solid-state cartridges.
                    </p>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl backdrop-blur-md flex items-center gap-4">
                     <div className="text-right">
                        <div className="text-[10px] text-gray-400">COMPATIBILITY</div>
                        <div className="text-sm font-bold text-white">UNIVERSAL ODB-II</div>
                     </div>
                     <div className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400">
                         <Car size={24} />
                     </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl group hover:border-cyan-500/30 transition-colors">
                    <Wind className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
                    <div className="text-3xl font-bold text-white mb-1">92%</div>
                    <div className="text-xs text-white/40">Capture Efficiency</div>
                </div>
                <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl group hover:border-red-500/30 transition-colors">
                    <Thermometer className="text-red-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
                    <div className="text-3xl font-bold text-white mb-1">-40°C</div>
                    <div className="text-xs text-white/40">Exhaust Cooling</div>
                </div>
                <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl group hover:border-purple-500/30 transition-colors">
                    <Gauge className="text-purple-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
                    <div className="text-3xl font-bold text-white mb-1">~0%</div>
                    <div className="text-xs text-white/40">Backpressure Loss</div>
                </div>
                <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl group hover:border-emerald-500/30 transition-colors">
                    <Timer className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
                    <div className="text-3xl font-bold text-white mb-1">5 Min</div>
                    <div className="text-xs text-white/40">Install Time</div>
                </div>
            </div>

        </div>
      </div>

      {/* 3D VIEWER */}
      <SilencerViewer />

      {/* FOOTER INFO */}
      <div className="px-6 py-20 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-4">The "Last Mile" Solution</h3>
                  <p className="text-white/40 leading-relaxed">
                      While Class X handles ambient air and Class C-A handles factories, 
                      the <span className="text-cyan-400">Class C-B Silencer</span> tackles the most decentralized pollution source: 
                      Transportation. By liquefying CO₂ at the source, we turn millions of cars into mobile carbon capture units.
                  </p>
              </div>
              <div className="flex gap-4">
                   <div className="flex items-center gap-2 text-xs text-white/30 font-mono border border-white/10 px-4 py-2 rounded-full">
                       <Snowflake size={14} className="text-cyan-500" /> CRYOGENIC TECH
                   </div>
                   <div className="flex items-center gap-2 text-xs text-white/30 font-mono border border-white/10 px-4 py-2 rounded-full">
                       <CheckCircle size={14} className="text-emerald-500" /> EURO 7 COMPLIANT (Under Testing Actual Variant May Vary)
                   </div>
              </div>
          </div>
      </div>

    </div>
  );
};

export default CarbonRefinery;