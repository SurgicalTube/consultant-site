import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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

export default ParticleSystem;
