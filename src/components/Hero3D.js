import React from 'react';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import CentralSphere from './CentralSphere';
import ParticleSystem from './ParticleSystem';
import ConstellationServices from './ConstellationServices';

const Hero3D = () => {
  return (
    <group>
      <ambientLight intensity={0.05} />
      <directionalLight position={[5, 3, 5]} intensity={1} />
      <ParticleSystem />
      <CentralSphere />
      <ConstellationServices />
      <OrbitControls enableZoom={false} enablePan={false} />
      <EffectComposer>
        <Bloom 
          intensity={0.5}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          height={300}
        />
      </EffectComposer>
    </group>
  );
};

export default Hero3D;
