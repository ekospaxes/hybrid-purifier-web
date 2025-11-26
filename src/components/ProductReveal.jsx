import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  useScroll, 
  ScrollControls, 
  Scroll, 
  Environment, 
  MeshTransmissionMaterial, 
  Float, 
  Stars,
  Instance, 
  Instances,
  RoundedBox
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// --- CONFIGURATION FROM PDF ---
const THEME = {
  algae: "#10B981",    // Chlorella Green
  uv: "#7c3aed",       // UV-A 365nm (Purple)
  metal: "#1a1a1a",    // Stainless Steel / Aluminum
  frame: "#000000",    // Outer Chassis
  alert: "#EF4444",    // Fault LED
  safe: "#10B981"      // Good LED
};

// --- PROCEDURAL HARDWARE (No Downloads Needed) ---

// 1. STAGE 1: CYCLONE SEPARATOR (Base)
const CycloneUnit = React.forwardRef((props, ref) => (
  <group ref={ref} {...props}>
    {/* Funnel Body */}
    <mesh>
      <cylinderGeometry args={[0.8, 0.4, 1.2, 32]} />
      <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
    </mesh>
    {/* Intake Vents */}
    {Array.from({ length: 4 }).map((_, i) => (
      <mesh key={i} rotation={[0, (i/4)*Math.PI*2, 0]} position={[0.6, 0.2, 0]}>
        <boxGeometry args={[0.4, 0.2, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    ))}
  </group>
));

// 2. STAGE 2 & 3: ESP & HEPA FILTERS
const FilterStack = React.forwardRef((props, ref) => (
  <group ref={ref} {...props}>
    {/* ESP Plates (Metal Parallel Plates) */}
    <group position={[0, -0.6, 0]}>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
          <planeGeometry args={[1.1, 1.1]} />
          <meshStandardMaterial color="#888" metalness={1.0} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
    
    {/* HEPA H13 (Pleated Filter) */}
    <mesh position={[0, 0.5, 0]}>
      <cylinderGeometry args={[1.0, 1.0, 0.8, 64, 1, true]} />
      {/* Procedural "Pleats" via roughness map trick or wireframe overlay */}
      <meshStandardMaterial color="#fff" roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, 0.5, 0]}>
      <cylinderGeometry args={[1.01, 1.01, 0.8, 32, 4, true]} />
      <meshBasicMaterial color="#111" wireframe opacity={0.2} transparent />
    </mesh>
  </group>
));

// 3. STAGE 4: PCO HONEYCOMB + UV
const PCOUnit = React.forwardRef((props, ref) => (
  <group ref={ref} {...props}>
    {/* Titanium Dioxide Matrix */}
    <mesh>
      <cylinderGeometry args={[0.95, 0.95, 0.3, 32]} />
      <meshStandardMaterial color="#444" wireframe />
    </mesh>
    {/* UV-A Glow Core */}
    <mesh>
      <cylinderGeometry args={[0.9, 0.9, 0.25, 32]} />
      <meshBasicMaterial color={THEME.uv} toneMapped={false} />
    </mesh>
  </group>
));

// 4. STAGE 5: PHOTOBIOREACTOR (The "Living Core")
const BioReactor = React.forwardRef(({ active }, ref) => {
  // Create bubbles efficiently using Instances
  const bubbles = useMemo(() => {
    return Array.from({ length: 50 }).map(() => ({
      position: [(Math.random()-0.5)*1.2, (Math.random()-0.5)*2.5, (Math.random()-0.5)*1.2],
      scale: 0.5 + Math.random() * 0.5,
      speed: 0.5 + Math.random() * 1.5
    }));
  }, []);

  return (
    <group ref={ref}>
      {/* Acrylic Cylinder */}
      <mesh>
        <cylinderGeometry args={[1.0, 1.0, 3.0, 64]} />
        <MeshTransmissionMaterial 
          backside
          samples={4}
          resolution={512}
          transmission={0.95}
          roughness={0.05}
          ior={1.5}
          thickness={0.1}
          chromaticAberration={0.04}
          color="#fff"
        />
      </mesh>

      {/* Green Algae Volume */}
      <mesh>
        <cylinderGeometry args={[0.9, 0.9, 2.9, 32]} />
        <meshPhysicalMaterial 
          color={THEME.algae} 
          transmission={0.2}
          opacity={0.9}
          transparent
          roughness={0}
        />
      </mesh>

      {/* O2 Bubbles */}
      <Instances range={50}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ccffcc" transparent opacity={0.6} />
        {bubbles.map((data, i) => (
          <Bubble key={i} {...data} active={active} />
        ))}
      </Instances>

      {/* LED Grow Light Column */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 3.0, 16]} />
        <meshBasicMaterial color="#fff" intensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
});

const Bubble = ({ position, scale, speed, active }) => {
  const ref = useRef();
  useFrame((state, delta) => {
    if (!ref.current) return;
    // Bubble rise animation
    ref.current.position.y += delta * speed * (active ? 1.5 : 0.1);
    if (ref.current.position.y > 1.4) ref.current.position.y = -1.4;
  });
  return <Instance ref={ref} position={position} scale={scale} />;
};

// 5. FRAME & UI (Touchscreen)
const MainFrame = React.forwardRef((props, ref) => (
  <group ref={ref} {...props}>
    {/* Top Cap */}
    <mesh position={[0, 1.7, 0]}>
      <cylinderGeometry args={[1.15, 1.15, 0.2, 64]} />
      <meshStandardMaterial color={THEME.metal} metalness={0.8} roughness={0.2} />
    </mesh>
    
    {/* Touchscreen Interface */}
    <group position={[0, 1.2, 1.15]}>
      <RoundedBox args={[0.8, 0.5, 0.05]} radius={0.02}>
        <meshStandardMaterial color="#111" />
      </RoundedBox>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.75, 0.45]} />
        <meshBasicMaterial color={THEME.algae} toneMapped={false} opacity={0.8} />
      </mesh>
    </group>

    {/* Bottom Base */}
    <mesh position={[0, -2.5, 0]}>
      <cylinderGeometry args={[1.2, 1.3, 0.3, 64]} />
      <meshStandardMaterial color={THEME.metal} metalness={0.8} />
    </mesh>
  </group>
));

// --- ANIMATION CONTROLLER ---

function MachineAssembly() {
  const scroll = useScroll();
  
  // Refs
  const frame = useRef();
  const cyclone = useRef();
  const filters = useRef();
  const pco = useRef();
  const bio = useRef();
  
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    // Scroll timeline (0 to 1)
    const r1 = scroll.range(0, 0.2);    // Frame Lift
    const r2 = scroll.range(0.2, 0.2);  // Cyclone Drop
    const r3 = scroll.range(0.4, 0.2);  // Filters Expand
    const r4 = scroll.range(0.6, 0.2);  // PCO Reveal
    const r5 = scroll.range(0.7, 0.3);  // Bio Reactor Active

    if(frame.current) {
      // Frame lifts straight up to reveal internals
      frame.current.position.y = THREE.MathUtils.damp(frame.current.position.y, r1 * 4, 3, delta);
    }
    if(cyclone.current) {
      cyclone.current.position.y = THREE.MathUtils.damp(cyclone.current.position.y, -3.5 + (r2 * 0.5), 3, delta);
    }
    if(filters.current) {
      filters.current.position.y = THREE.MathUtils.damp(filters.current.position.y, -1.5 + (r3 * 0.5), 3, delta);
      // Separate plates slightly
      filters.current.scale.y = THREE.MathUtils.damp(filters.current.scale.y, 1 + r3 * 0.2, 3, delta);
    }
    if(pco.current) {
      pco.current.position.y = THREE.MathUtils.damp(pco.current.position.y, 0 + (r4 * 0.5), 3, delta);
    }
    if(bio.current) {
      bio.current.position.y = THREE.MathUtils.damp(bio.current.position.y, 2.0, 3, delta);
      setActive(r5 > 0.2); // Turn on bubbles
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      <MainFrame ref={frame} />
      <BioReactor ref={bio} active={active} />
      <PCOUnit ref={pco} position={[0, 0, 0]} />
      <FilterStack ref={filters} position={[0, -1.2, 0]} />
      <CycloneUnit ref={cyclone} position={[0, -3.5, 0]} />
    </group>
  );
}

// --- HTML OVERLAY (DATA FROM PDF) ---

const InfoPanel = ({ step, title, details, align="left" }) => (
  <div className={`h-screen w-full flex items-center px-4 md:px-24 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
    <motion.div 
      initial={{ opacity: 0, x: align === 'left' ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ margin: "-20%" }}
      transition={{ duration: 0.5 }}
      className="bg-black/50 backdrop-blur-md border border-white/10 p-8 rounded-xl max-w-md pointer-events-none"
    >
      <div className="text-emerald-500 font-mono text-xs font-bold mb-2 uppercase tracking-widest">
        {step}
      </div>
      <h3 className="text-3xl font-bold text-white mb-4 uppercase leading-none">{title}</h3>
      <ul className="space-y-2">
        {details.map((item, i) => (
          <li key={i} className="text-gray-400 text-sm font-mono flex items-start">
            <span className="mr-2 text-emerald-600">/</span> {item}
          </li>
        ))}
      </ul>
    </motion.div>
  </div>
);

// --- MAIN EXPORT ---

export default function ProductReveal() {
  return (
    <div className="h-screen w-full bg-[#050505] text-white">
      <Canvas shadows camera={{ position: [0, 0, 9], fov: 35 }} gl={{ antialias: false }}>
        <color attach="background" args={['#050505']} />
        
        {/* LIGHTING */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} color="white" castShadow />
        <spotLight position={[-10, 0, 10]} angle={0.5} penumbra={1} intensity={2} color={THEME.algae} />
        
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />
        <Environment preset="city" blur={0.8} />

        {/* SCROLL LOGIC */}
        <ScrollControls pages={6} damping={0.2}>
          <Float rotationIntensity={0.2} floatIntensity={0.2} speed={2}>
            <MachineAssembly />
          </Float>

          <Scroll html style={{ width: '100%' }}>
            
            {/* PAGE 1: Intro */}
            <div className="h-screen w-full flex flex-col items-center justify-center">
              <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tighter">
                CLASS <span className="text-emerald-500">X</span> 120L
              </h1>
              <p className="text-gray-500 font-mono">The World's First Hybrid Photobioreactor</p>
            </div>

            {/* PAGE 2: Cyclone */}
            <InfoPanel 
              step="STEP 1: PRE-SEPARATOR"
              title="Cyclone"
              details={[
                "Cyclone Technology",
                "Removes Large Dust (>50µm)",
                "Passive & Low Maintenance",
                "Protects Fine Filters"
              ]}
            />

            {/* PAGE 3: ESP + HEPA */}
            <InfoPanel 
              align="right"
              step="STEP 2 & 3: FINE PARTICLE CAPTURE"
              title="ESP + HEPA"
              details={[
                "Electrostatic Precipitator (6-8kV)",
                "Collects PM1 - PM2.5",
                "Washable Stainless Steel Plates",
                "HEPA H13 Final Barrier (99.97% @ 0.3µm)"
              ]}
            />

            {/* PAGE 4: PCO */}
            <InfoPanel 
              step="STEP 4: CHEMICAL OXIDATION"
              title="PCO Matrix"
              details={[
                "Photocatalytic Oxidation (PCO)",
                "TiO₂ Honeycomb Matrix",
                "UV-A Light (365nm)",
                "Destroys VOCs (Formaldehyde, Benzene)"
              ]}
            />

            {/* PAGE 5: PBR */}
            <InfoPanel 
              align="center"
              step="STEP 5: THE LIVING CORE"
              title="Bio-Reactor"
              details={[
                "120L Food-Grade Acrylic Cylinder",
                "Contains Chlorella pyrenoidosa",
                "Absorbs CO₂ & Releases O₂",
                "Powered by 200W LED Grow Lights"
              ]}
            />

            {/* PAGE 6: CONTROLS */}
            <InfoPanel 
              align="right"
              step="TOTAL CONTROL"
              title="IoT Integration"
              details={[
                "Arduino R4 WiFi Master",
                "Real-time MQTT Dashboard",
                "Sensors: PM2.5, CO2, pH, DO, Temp",
                "3.5 Inch TFT Touchscreen Interface"
              ]}
            />

          </Scroll>
        </ScrollControls>

        {/* POST PROCESSING (Glow) */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.6} mipmapBlur intensity={1.5} radius={0.5} />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>

      </Canvas>
    </div>
  );
}