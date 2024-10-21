import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import CentralSphere from './CentralSphere';
import ParticleSystem from './ParticleSystem';

const Hero3D = () => {
  return (
    <div style={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%', 
      height: '100%', 
      background: '#000',
      overflow: 'hidden'
    }}>
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.05} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <ParticleSystem />
        <CentralSphere />
        <OrbitControls enableZoom={false} enablePan={false} />
        <EffectComposer>
          <Bloom 
            intensity={0.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            height={300}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Hero3D;
