'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, OrbitControls } from '@react-three/drei';

function RotatingObject() {
  const groupRef = useRef(null);
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    // 1. Slow base rotation on the mesh
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }

    // 2. Mouse interaction (tilt) on the parent group
    if (groupRef.current) {
      // state.pointer contains normalized device coordinates (-1 to +1)
      const targetX = -(state.pointer.y * Math.PI) / 4;
      const targetY = (state.pointer.x * Math.PI) / 4;

      // Smooth interpolation towards the target tilt
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Icosahedron ref={meshRef} args={[2.5, 1]}>
        <meshBasicMaterial color="#ccf200" wireframe={true} />
      </Icosahedron>
    </group>
  );
}

export default function Hero3DObject() {
  /*
    Instructions for installation and usage:

    1. Install dependencies:
       npm install three @react-three/fiber @react-three/drei

    2. Dynamic import in Next.js Client Components (to avoid SSR errors with WebGL):
       import dynamic from 'next/dynamic';
       const Hero3DObject = dynamic(() => import('./Hero3DObject'), { ssr: false });

    3. Render the component in your layout:
       <Hero3DObject />
  */
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <RotatingObject />
      {/*
        OrbitControls allows the user to click and drag to rotate the object as well.
        We disable zoom and pan to keep the object centered and at the right size.
      */}
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
