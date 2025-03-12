import React, { useRef, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

function Model({ url }) {
  const loader = url.endsWith('.stl') ? STLLoader : OBJLoader;
  const geometry = useLoader(loader, url);
  const meshRef = useRef();

   geometry.center();
  
  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhongMaterial color="#808080" />
    </mesh>
  );
}

export default function ModelViewer({ url }) {
  return (
    <Canvas camera={{ position: [0, 0, 100], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />
    </Canvas>
  );
}
