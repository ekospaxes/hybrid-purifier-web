import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  useScroll,
  ScrollControls,
  Float,
  Environment,
  MeshTransmissionMaterial,
  Instances,
  Instance,
  RoundedBox,
  Stars
} from '@react-three/drei';
import * as THREE from 'three';

const THEME = {
  algae: "#10B981",
  uv_light: "#8b5cf6",
  steel: "#222222",
  acrylic: "#ffffff"
};

const CycloneSeparator = React.forwardRef((props, ref) => (
  <group ref={ref} {...props}>
    <mesh>
      <cylinderGeometry args={[0.8, 0.4, 1.0, 32]} />
      <meshStandardMaterial color="#333" roughness={0.5} metalness={0.8} />
    </mesh>
    {Array.from({ length: 6 }).map((_, i) => (
      <mesh key={i} rotation={[0, (i / 6) * Math.PI * 2, 0]} position={[0.7, 0, 0]}>
        <boxGeometry args={[0.5, 0.2, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    ))}
  </group>
));

const ESPHepaStack = React.forwardRef((props, ref) => (
  <group ref={ref} {...props}>
    <group position={[0, -0.5, 0]}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshStandardMaterial color="#aaa" metalness={1} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
    <mesh position={[0, 0.5, 0]}>
      <cylinderGeometry args={[1.0, 1.0, 0.8, 64]} />
      <meshStandardMaterial color="#fff" roughness={1} />
    </mesh>
    <mesh position={[0, 0.5, 0]}>
      <cylinderGeometry args={[1.02, 1.02, 0.8, 16, 1, true]} />
      <meshStandardMaterial color="#111" wireframe />
    </mesh>
  </group>
));

const PCOUnit = React.forwardRef((props, ref) => (
  <group ref={ref} {...props}>
    <mesh>
      <cylinderGeometry args={[0.9, 0.9, 0.4, 64]} />
      <meshPhysicalMaterial color="#444" metalness={0.5} />
    </mesh>
    <mesh>
      <cylinderGeometry args={[0.85, 0.85, 0.35, 32]} />
      <meshBasicMaterial color={THEME.uv_light} toneMapped={false} />
    </mesh>
  </group>
));

const BioReactor120L = React.forwardRef(({ active }, ref) => {
  const bubbleData = useMemo(() => Array.from({ length: 60 }).map(() => ({
    position: [(Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 1.2],
    scale: 0.5 + Math.random() * 0.5,
    speed: 0.5 + Math.random(),
  })), []);

  return (
    <group ref={ref}>
      <mesh>
        <cylinderGeometry args={[1.0, 1.0, 3.0, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          resolution={512}
          transmission={0.92}
          roughness={0.02}
          ior={1.49}
          thickness={0.1}
          color={THEME.acrylic}
        />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.9, 0.9, 2.9, 32]} />
        <meshPhysicalMaterial
          color={THEME.algae}
          transmission={0.4}
          opacity={0.8}
          transparent
          roughness={0.1}
          clearcoat={1}
        />
      </mesh>
      <Instances range={60}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ccffcc" opacity={0.7} transparent />
        {bubbleData.map(({ position, scale, speed }, i) => (
          <Bubble key={i} position={position} scale={scale} speed={speed} active={active} />
        ))}
      </Instances>
    </group>
  );
});

const Bubble = ({ position, scale, speed, active }) => {
  const ref = useRef();
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.y += delta * speed * (active ? 1.5 : 0.2);
    if (ref.current.position.y > 1.5) ref.current.position.y = -1.5;
    ref.current.position.x += Math.sin(state.clock.elapsedTime * speed) * 0.002;
  });
  return <Instance ref={ref} position={position} scale={scale} />;
};

function Purifier3D() {
  const scroll = useScroll();

  const cycloneRef = useRef();
  const filterRef = useRef();
  const pcoRef = useRef();
  const bioRef = useRef();
  const [bioActive, setBioActive] = useState(false);

  useFrame((state, delta) => {
    const rCyclone = scroll.range(0, 0.25);
    const rFilter = scroll.range(0.20, 0.25);
    const rPco = scroll.range(0.40, 0.2);
    const rBio = scroll.range(0.60, 0.3);

    if (cycloneRef.current) {
      cycloneRef.current.position.y = THREE.MathUtils.damp(cycloneRef.current.position.y, -3 + rCyclone * 1, 3, delta);
    }
    if (filterRef.current) {
      filterRef.current.position.y = THREE.MathUtils.damp(filterRef.current.position.y, -1 + rFilter * 0.5, 3, delta);
    }
    if (pcoRef.current) {
      pcoRef.current.position.y = THREE.MathUtils.damp(pcoRef.current.position.y, 0 + rPco * 0.5, 3, delta);
    }
    if (bioRef.current) {
      bioRef.current.position.y = THREE.MathUtils.damp(bioRef.current.position.y, 2, 3, delta);
      setBioActive(rBio > 0.2);
      bioRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group scale={0.9} position={[0, -1, 0]}>
      <CycloneSeparator ref={cycloneRef} position={[0, -3, 0]} />
      <ESPHepaStack ref={filterRef} position={[0, -1, 0]} />
      <PCOUnit ref={pcoRef} position={[0, 0, 0]} />
      <BioReactor120L ref={bioRef} active={bioActive} />
    </group>
  );
}

export default function Product3DModel() {
  return (
    <Canvas camera={{ position: [0, 1, 7], fov: 40 }} shadows gl={{ antialias: true }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
      <pointLight position={[-5, -3, -5]} intensity={0.4} />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="sunset" />

      <ScrollControls pages={4}>
        <Float rotationIntensity={0.15} floatIntensity={0.25} speed={1.5}>
          <Purifier3D />
        </Float>
      </ScrollControls>
    </Canvas>
  );
}
