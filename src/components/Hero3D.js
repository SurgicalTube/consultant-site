import React, { Suspense, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import CentralSphere from './CentralSphere';
import ParticleSystem from './ParticleSystem';
import LoadingScreen from './LoadingScreen';
import useLoadingStore from './LoadingManager';

const Hero3D = () => {
  const { isLoading, setLoading } = useLoadingStore();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <group>
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
    </group>
  );
};

export default Hero3D;
