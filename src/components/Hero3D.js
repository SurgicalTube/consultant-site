import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Center, Text3D, MeshTransmissionMaterial, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

extend({ TextGeometry });

const ParticleSystem = ({ orbitCount = 3000, fieldCount = 5000 }) => {
  const orbitParticles = useRef();
  const fieldParticles = useRef();
  
  const [orbits] = useState(() => {
    return Array(3).fill().map(() => ({
      radius: 5 + Math.random() * 5,
      speed: 0.05 + Math.random() * 0.1, // Increased speed range
      axis: new THREE.Vector3().randomDirection()
    }));
  });

  const orbitPositions = useMemo(() => {
    const positions = new Float32Array(orbitCount * 3);
    for (let i = 0; i < orbitCount; i++) {
      const orbitIndex = i % 3;
      const angle = (i / orbitCount) * Math.PI * 2;
      const x = Math.cos(angle) * orbits[orbitIndex].radius;
      const y = Math.sin(angle) * orbits[orbitIndex].radius;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = 0;
    }
    return positions;
  }, [orbitCount, orbits]);

  const fieldPositions = useMemo(() => {
    const positions = new Float32Array(fieldCount * 3);
    for (let i = 0; i < fieldCount; i++) {
      const radius = 15 + Math.random() * 15; // Particles between radius 15 and 30
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, [fieldCount]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Update orbit particles
    for (let i = 0; i < orbitCount; i++) {
      const i3 = i * 3;
      const orbitIndex = i % 3;
      const orbit = orbits[orbitIndex];
      
      const x = orbitPositions[i3];
      const y = orbitPositions[i3 + 1];
      const z = orbitPositions[i3 + 2];
      
      const rotationMatrix = new THREE.Matrix4().makeRotationAxis(orbit.axis, orbit.speed * time);
      const position = new THREE.Vector3(x, y, z).applyMatrix4(rotationMatrix);
      
      orbitParticles.current.setMatrixAt(i, new THREE.Matrix4().setPosition(position));
    }
    orbitParticles.current.instanceMatrix.needsUpdate = true;

    // Update field particles
    for (let i = 0; i < fieldCount; i++) {
      const i3 = i * 3;
      const x = fieldPositions[i3];
      const y = fieldPositions[i3 + 1];
      const z = fieldPositions[i3 + 2];
      
      const rotationMatrix = new THREE.Matrix4().makeRotationY(0.1 * time); // Increased rotation speed
      const position = new THREE.Vector3(x, y, z).applyMatrix4(rotationMatrix);
      
      fieldParticles.current.setMatrixAt(i, new THREE.Matrix4().setPosition(position));
    }
    fieldParticles.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={orbitParticles} args={[null, null, orbitCount]}>
        <sphereGeometry args={[0.03]} />
        <meshBasicMaterial color="#00ffff" />
      </instancedMesh>
      <instancedMesh ref={fieldParticles} args={[null, null, fieldCount]}>
        <sphereGeometry args={[0.01]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </instancedMesh>
    </>
  );
};

const AnimatedLogo = ({ font }) => {
  const groupRef = useRef();
  const materialRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    groupRef.current.rotation.x = Math.cos(t * 0.5) * 0.1;
    if (materialRef.current) {
      materialRef.current.transmission = THREE.MathUtils.lerp(0.5, 0.8, Math.sin(t) * 0.5 + 0.5);
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <Text3D 
          font={font} 
          size={1.5}
          height={0.4}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.1}
          bevelSize={0.05}
          bevelOffset={0}
          bevelSegments={5}
          position={[-2, 0, 0]}
        >
          B
          <MeshTransmissionMaterial 
            ref={materialRef}
            color="#ff00ff"
            thickness={0.5}
            roughness={0.1}
            transmission={0.6}
            ior={1.5}
          />
        </Text3D>
        <Text3D 
          font={font}
          size={1.5}
          height={0.4}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.1}
          bevelSize={0.05}
          bevelOffset={0}
          bevelSegments={5}
          position={[0, 0, 0]}
        >
          T
          <MeshTransmissionMaterial 
            color="#00ffff"
            thickness={0.5}
            roughness={0.1}
            transmission={0.6}
            ior={1.5}
          />
        </Text3D>
        <Text3D 
          font={font}
          size={1.5}
          height={0.4}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.1}
          bevelSize={0.05}
          bevelOffset={0}
          bevelSegments={5}
          position={[2, 0, 0]}
        >
          G
          <MeshTransmissionMaterial 
            color="#ffff00"
            thickness={0.5}
            roughness={0.1}
            transmission={0.6}
            ior={1.5}
          />
        </Text3D>
      </Center>
      <pointLight color="#ffffff" position={[0, 0, 5]} intensity={1} />
    </group>
  );
};

const CentralSphere = () => {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const [earthTexture, cloudsTexture] = useTexture([
    '/textures/2k_earth_daymap.jpg',
    '/textures/2k_earth_clouds.jpg'
  ]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    earthRef.current.rotation.y = elapsedTime * 0.05;
    cloudsRef.current.rotation.y = elapsedTime * 0.06; // Slightly faster rotation for clouds
  });

  return (
    <group>
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          map={earthTexture}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.01, 64, 64]} /> {/* Slightly larger radius */}
        <meshStandardMaterial 
          map={cloudsTexture}
          transparent={true}
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

function Hero3D() {
  return (
    <div style={{ height: '100vh', width: '100%', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 3, 5]} intensity={0.8} />
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
}

export default Hero3D;
