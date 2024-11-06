import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ServiceBeam = ({ startPosition, isClosing }) => {
  const beamRef = useRef();
  const scaleProgress = useRef(0);

  useFrame(({ camera }) => {
    if (beamRef.current) {
      // Determine target scale based on closing state
      const targetScale = isClosing ? 0 : 1;
      
      // Different speeds for opening/closing
      const speed = isClosing ? 0.03 : 0.08;
      
      // Update scale progress
      scaleProgress.current = THREE.MathUtils.lerp(
        scaleProgress.current,
        targetScale,
        speed
      );

      // Camera tracking
      const cameraXZ = new THREE.Vector3(camera.position.x, 0, camera.position.z);
      const starXZ = new THREE.Vector3(startPosition.x, 0, startPosition.z);
      const angleToCamera = Math.atan2(
        cameraXZ.z - starXZ.z,
        cameraXZ.x - starXZ.x
      );
      beamRef.current.rotation.y = angleToCamera + Math.PI / 2;

      // Apply scale and opacity
      beamRef.current.scale.x = scaleProgress.current;
      beamRef.current.material.opacity = 0.8 * scaleProgress.current;
    }
  });

  const geometry = new THREE.BoxGeometry(5, 0.2, 0.2);
  geometry.translate(2.5, 0, 0);

  return (
    <mesh 
      ref={beamRef}
      position={[startPosition.x, startPosition.y, startPosition.z]}
      geometry={geometry}
    >
      <meshBasicMaterial 
        color="#00ffff"
        transparent
        opacity={0}
        toneMapped={false}
      />
    </mesh>
  );
}; 