import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Environment, 
  Float, 
  MeshTransmissionMaterial, 
  AccumulativeShadows,
  RandomizedLight
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// --- CONTENT CONFIGURATION ---
const SECTIONS = [
  { id: 0, title: "Class X Architecture", subtitle: "System Overview", desc: "A unified 4-stage purification tower designed for maximum airflow. Industrial power meets biological intelligence." },
  { id: 1, title: "Vortex Cyclone", subtitle: "Stage 01", desc: "High-velocity intake geometry accelerates airflow to 120mph, flinging heavy dust into the sealed base bin." },
  { id: 2, title: "H13 HEPA Stack", subtitle: "Stage 02", desc: "Medical-grade pleated filtration media captures 99.97% of particulates, protected by a steel mesh pre-filter." },
  { id: 3, title: "Titanium PCO", subtitle: "Stage 03", desc: "Hexagonal TiO2 lattice activated by Cyan-Blue light. Destroys VOCs and pathogens at a molecular level." },
  { id: 4, title: "Algae Bio-Core", subtitle: "Stage 04", desc: "120L Bioreactor column. High-density Chlorella culture naturally scrubs CO2 and releases fresh Oxygen." },
];

// --- MATERIALS ---
const MAT = {
  accent: new THREE.Color("#10B981"), // Emerald Green
  titanium: new THREE.Color("#c0c0c0"), // Silver
  cyanLight: new THREE.Color("#06b6d4"), // Cyan Blue
  darkBody: "#1a1a1a",
  chrome: "#333"
};

// --- ANIMATION VARIANTS (Typography) ---
const revealVariant = {
  hidden: { y: "100%" },
  visible: { 
    y: 0, 
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } // "Expo Out" smooth ease
  }
};

const fadeVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } 
  }
};

// --- 3D COMPONENTS ---

const SupportFrame = () => (
  <group>
    {[0, 120, 240].map((rot, i) => (
      <group key={i} rotation={[0, rot * Math.PI / 180, 0]}>
        <mesh position={[1.1, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 6, 16]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.2} />
        </mesh>
        {[ -2, -0.5, 0.5, 2 ].map((y, j) => (
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
      {/* Glitch-Free Glow */}
      <mesh position={[0, -0.2, 0]} visible={isFocused}>
        <cylinderGeometry args={[0.35, 0.05, 1.0, 32]} />
        <meshBasicMaterial 
          color={MAT.accent} 
          transparent opacity={0.15} 
          depthWrite={false} 
          side={THREE.DoubleSide} 
          blending={THREE.AdditiveBlending} 
        />
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
  <group position={[0, -0.5, 0]}>
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

// --- MAIN COMPONENT ---

export default function ProductReveal() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="relative w-full bg-[#050505] text-white selection:bg-emerald-500 selection:text-black">
      
      {/* 3D STAGE (Sticky) */}
      <div className="fixed top-0 left-0 w-full h-[45vh] md:w-1/2 md:h-screen z-10">
        <Canvas shadows camera={{ position: [0, 0, 8.5], fov: 30 }} gl={{ toneMappingExposure: 0.9 }}>
          <color attach="background" args={['#050505']} />
          <ambientLight intensity={0.4} />
          <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1.5} color="#fff" castShadow />
          <spotLight position={[-10, 5, 0]} angle={0.5} penumbra={1} intensity={2} color="#059669" />
          <Environment preset="city" blur={1} />
          <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
            <MachineAssembly step={activeStep} />
          </Float>
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.8} radius={0.4} />
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={1.0} />
          </EffectComposer>
        </Canvas>
        {/* Mobile Fade Overlay */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent md:hidden" />
      </div>

      {/* CONTENT SCROLL */}
      <div className="relative w-full md:w-1/2 md:ml-[50%] z-20">
        <div className="h-[40vh] md:h-0 w-full" /> 
        
        {SECTIONS.map((section, index) => (
          <motion.div
            key={section.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.5, margin: "-10% 0px -20% 0px" }}
            onViewportEnter={() => setActiveStep(index)}
            className="min-h-[85vh] flex flex-col justify-center px-8 md:px-24"
          >
             {/* Card Container */}
             <div className="border-l border-white/10 pl-8 hover:border-emerald-500/50 transition-colors duration-700 relative group">
                
                {/* Background Number (Parallax feel) */}
                <span className="text-8xl font-black text-white/5 absolute -ml-12 -mt-12 -z-10 select-none group-hover:text-white/10 transition-colors duration-700">
                   0{index}
                </span>
                
                {/* Animated Subtitle */}
                <div className="overflow-hidden mb-4">
                  <motion.div variants={revealVariant}>
                    <div className="flex items-center gap-3">
                      <div className={`h-1.5 w-1.5 rounded-full ${activeStep === index ? "bg-emerald-400 shadow-[0_0_10px_#34d399]" : "bg-gray-700"}`} />
                      <span className="text-emerald-500 font-mono text-xs tracking-[0.2em] uppercase font-bold">
                          {section.subtitle}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Animated Title (Masked Slide Up) */}
                <div className="overflow-hidden mb-6">
                  <motion.h2 
                    variants={revealVariant} 
                    className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight text-white"
                  >
                     {section.title}
                  </motion.h2>
                </div>
                
                {/* Animated Body (Fade In) */}
                <motion.p 
                  variants={fadeVariant}
                  className="text-gray-400 text-lg leading-relaxed max-w-sm font-light"
                >
                   {section.desc}
                </motion.p>

             </div>
          </motion.div>
        ))}

        <div className="h-[20vh] w-full flex items-center justify-center text-gray-800 text-xs font-mono tracking-widest opacity-50">
           // SYSTEM STATUS: OPTIMAL
        </div>
      </div>
    </div>
  );
}