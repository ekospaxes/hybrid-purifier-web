import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  MeshTransmissionMaterial,
  AccumulativeShadows,
  RandomizedLight,
  CameraControls,
  Center,
  Grid
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { ArrowLeft, Activity, Wind, Droplets, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';

// ==========================================
// 1. CONFIG & MATERIALS
// ==========================================
const MAT = {
  darkBody: "#1a1a1a",
  chrome: "#333",
};

const COLORS = {
  ekoEmerald: "#10B981",
  ekoDarkBlue: "#0f172a"
};

// Color interpolator for status
const getStatusColor = (load) => {
  const c1 = new THREE.Color(COLORS.ekoEmerald); 
  const c2 = new THREE.Color("#F59E0B"); 
  const c3 = new THREE.Color("#EF4444"); 
  if (load < 0.5) return c1.lerp(c2, load * 2);
  return c2.lerp(c3, (load - 0.5) * 2);
};

// ==========================================
// 2. 3D COMPONENTS
// ==========================================

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

const CycloneModule = ({ rpm }) => {
  const innerRef = useRef();
  useFrame((state, delta) => {
    if(innerRef.current) innerRef.current.rotation.y -= delta * (rpm / 100);
  });
  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.6, 0.3, 1.5, 64]} />
        <meshStandardMaterial color={MAT.darkBody} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.4, 64]} />
        <meshStandardMaterial color={MAT.chrome} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh ref={innerRef} position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.35, 0.05, 1.0, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const FilterModule = () => (
  <group>
    <mesh>
      <cylinderGeometry args={[0.9, 0.9, 0.8, 64, 1, true]} />
      <meshStandardMaterial color="#888" metalness={0.9} roughness={0.4} wireframe transparent opacity={0.3} />
    </mesh>
    <mesh scale={[0.95, 0.95, 0.95]}>
      <cylinderGeometry args={[0.9, 0.9, 0.8, 64]} />
      <meshStandardMaterial color="#eee" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.42, 0]}>
      <torusGeometry args={[0.9, 0.05, 16, 64]} />
      <meshStandardMaterial color="#111" roughness={0.5} />
    </mesh>
    <mesh position={[0, -0.42, 0]}>
      <torusGeometry args={[0.9, 0.05, 16, 64]} />
      <meshStandardMaterial color="#111" roughness={0.5} />
    </mesh>
  </group>
);

const PCOModule = ({ loadLevel }) => {
  const lightColor = getStatusColor(loadLevel);
  
  return (
    <group>
      {/* Translucent Titanium Housing */}
      <mesh>
        <cylinderGeometry args={[0.9, 0.9, 0.8, 64, 1, true]} />
        <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={0.2}
            roughness={0.2}
            anisotropy={0.1}
            chromaticAberration={0.04}
            color="#a0a0a0"
            resolution={256}
        />
      </mesh>
      
      {/* Internal Honeycomb Structure */}
      <group scale={[0.95, 0.95, 0.95]}>
        {[0, 60, 120].map((rot, i) => (
            <mesh key={i} rotation={[0, rot * Math.PI/180, 0]}>
            <boxGeometry args={[1.7, 0.1, 0.1]} />
            <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
            </mesh>
        ))}
      </group>

      {/* Reactive Core Light */}
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 0.6, 32]} />
        <meshBasicMaterial color={lightColor} toneMapped={false} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

const BioModule = ({ activityLevel }) => {
  const bubbles = useMemo(() => Array.from({ length: 40 }).map(() => ({
    pos: [Math.random()*0.5-0.25, Math.random()*2-1, Math.random()*0.5-0.25],
    scale: Math.random()*0.05 + 0.02,
    speed: Math.random()*0.5 + 0.2
  })), []);
  
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.children.forEach(child => {
        child.position.y += delta * child.userData.speed * (1 + activityLevel * 2);
        if (child.position.y > 1) child.position.y = -1;
      });
    }
  });

  return (
    <group>
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.1, 64]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[1.0, 1.0, 2.5, 64]} />
        <MeshTransmissionMaterial
          backside samples={6} thickness={0.2} roughness={0.1} anisotropy={0.1} chromaticAberration={0.02}
          color="#ffffff" resolution={512}
        />
      </mesh>
      <mesh scale={[0.95, 0.98, 0.95]}>
        <cylinderGeometry args={[0.95, 0.95, 2.45, 32]} />
        <meshPhysicalMaterial color={COLORS.ekoEmerald} transmission={0.2} roughness={0.1} transparent opacity={0.8} />
      </mesh>
      <group ref={ref}>
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

const DigitalTwin = ({ simulation }) => (
  <group scale={1.0}> 
    <SupportFrame />
    <group position={[0, 2.3, 0]}><BioModule activityLevel={simulation.co2 / 1000} /></group>
    <group position={[0, 0.6, 0]}><PCOModule loadLevel={simulation.aqi / 500} /></group>
    <group position={[0, -0.4, 0]}><FilterModule /></group>
    <group position={[0, -1.8, 0]}><CycloneModule rpm={simulation.rpm} /></group>
  </group>
);

// ==========================================
// 3. UI & LOGIC
// ==========================================

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-center font-mono">
      <div className="relative mb-8">
         <Loader2 className="w-24 h-24 text-emerald-500 animate-spin" />
         <div className="absolute inset-0 flex items-center justify-center text-emerald-500 font-bold text-xl">
          {progress}%
        </div>
      </div>

      <h1 className="text-2xl text-white mb-2 uppercase tracking-[0.2em]">Initializing Twin</h1>
      <div className="text-gray-500 text-xs mb-8 flex flex-col gap-1">
        <span>&gt; ESTABLISHING MQTT HANDSHAKE... {progress > 30 ? 'OK' : ''}</span>
        <span>&gt; LOADING GEOMETRY SHADERS... {progress > 60 ? 'OK' : ''}</span>
        <span>&gt; SYNCING SENSORS... {progress > 90 ? 'OK' : ''}</span>
      </div>

      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 transition-all duration-75" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

const SimulatorUI = ({ simState, setSimState }) => {
  return (
    <>
      <style>{`
        footer, .footer-container, div[class*="Footer"], div[class*="footer"] {
          display: none !important;
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-text {
          animation: gradient-x 3s ease infinite;
          background-size: 200% auto;
        }
      `}</style>

      {/* Added z-50 and ensuring pointer events work */}
      <div className="absolute inset-0 pointer-events-none z-50 p-6 md:p-12 flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div>
             <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-2 cursor-pointer relative z-50">
               <ArrowLeft size={16} /> Exit Simulator
             </Link>
             <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">
               Class X <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-text">Digital Twin</span>
             </h1>
             <div className="flex items-center gap-2 text-xs font-mono text-emerald-500/70 mt-1">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               CONNECTED TO LOCALHOST:3000
             </div>
          </div>
          
          {/* Status Panel */}
          <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-lg text-right font-mono text-xs">
            <div className="text-gray-400 mb-1">SYSTEM STATUS</div>
            <div className={`text-xl font-bold ${simState.aqi > 300 ? 'text-red-500' : 'text-emerald-500'}`}>
              {simState.aqi > 300 ? 'CRITICAL LOAD' : 'OPTIMAL'}
            </div>
            <div className="text-white/50 mt-2">UPTIME: 00:04:12</div>
          </div>
        </div>

        {/* Main Controls (Bottom Left) */}
        <div className="pointer-events-auto w-full md:w-80 bg-black/80 backdrop-blur-xl border-t border-l border-r border-white/10 rounded-t-xl p-6 self-start md:self-auto">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <RefreshCw size={16} /> ENVIRONMENT CONTROL
          </h3>

          {/* AQI Slider */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-2 font-mono">
              <span className="flex items-center gap-1"><Wind size={12} /> PM2.5 LOAD</span>
              <span className={simState.aqi > 300 ? 'text-red-500' : 'text-white'}>{simState.aqi} µg/m³</span>
            </div>
            <input 
              type="range" min="0" max="500" value={simState.aqi}
              onChange={(e) => setSimState({...simState, aqi: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* CO2 Slider */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-2 font-mono">
              <span className="flex items-center gap-1"><Droplets size={12} /> CO2 LEVELS</span>
              <span className={simState.co2 > 1500 ? 'text-red-500' : 'text-white'}>{simState.co2} PPM</span>
            </div>
            <input 
              type="range" min="400" max="3000" value={simState.co2}
              onChange={(e) => setSimState({...simState, co2: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
          
          {/* Output Metrics */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
            <div>
              <div className="text-[10px] text-gray-500 mb-1">FAN SPEED</div>
              <div className="text-emerald-400 font-mono text-lg">{(simState.rpm).toLocaleString()} <span className="text-xs text-gray-600">RPM</span></div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 mb-1">POWER DRAW</div>
              <div className="text-emerald-400 font-mono text-lg">{Math.round(simState.rpm / 25)} <span className="text-xs text-gray-600">WATTS</span></div>
            </div>
          </div>

        </div>

        {/* Warnings (Bottom Right) */}
        {simState.aqi > 300 && (
           <div className="absolute bottom-24 md:bottom-12 right-6 md:right-12 pointer-events-none">
              <div className="bg-red-500/20 border border-red-500 text-red-500 px-6 py-4 rounded-lg flex items-center gap-4 animate-pulse">
                 <AlertTriangle size={32} />
                 <div>
                   <div className="font-bold">HIGH POLLUTION DETECTED</div>
                   <div className="text-xs">TURBO MODE ENGAGED</div>
                 </div>
              </div>
           </div>
        )}
      </div>
    </>
  );
};

// ==========================================
// 4. MAIN COMPONENT
// ==========================================

export default function Simulator() {
  const [loaded, setLoaded] = useState(false);
  const [simState, setSimState] = useState({
    aqi: 50,    // 0-500
    co2: 420,   // 400-3000
    rpm: 1200   // Calculated
  });

  // Calculate Physics
  useEffect(() => {
    const targetRPM = 1000 + (simState.aqi * 5) + ((simState.co2 - 400) * 0.5);
    setSimState(prev => ({...prev, rpm: Math.min(Math.round(targetRPM), 5000)}));
  }, [simState.aqi, simState.co2]);

  return (
    <div className="h-screen w-full bg-neutral-950 text-white overflow-hidden select-none">
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      
      {/* 3D Scene */}
      <Canvas shadows camera={{ position: [4, 2, 6], fov: 35, far: 1000 }} gl={{ antialias: false }}>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 10, 50]} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 5]} angle={0.4} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-5, 0, -5]} intensity={1} color={COLORS.ekoEmerald} distance={10} />
        
        <Environment preset="city" blur={0.8} />
        
        {/* REMOVED <Float> to stop levitation */}
        <Center position={[0, 0.5, 0]}> 
           <DigitalTwin simulation={simState} />
        </Center>

        {/* Expanded Grid Floor */}
        <Grid 
          position={[0, -2.5, 0]} // Adjusted y-position to match model bottom
          args={[60, 60]} 
          cellColor={COLORS.ekoDarkBlue} 
          sectionColor={COLORS.ekoEmerald} 
          fadeDistance={40} 
          fadeStrength={1.5}
        />

        <CameraControls minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI/2} maxDistance={20} />

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.4} />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>

      {/* UI Overlay */}
      {loaded && <SimulatorUI simState={simState} setSimState={setSimState} />}
    </div>
  );
}
