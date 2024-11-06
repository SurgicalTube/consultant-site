import { useRef, useEffect } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ServicePanel = ({ service }) => {
  const panelRef = useRef();
  const contentRef = useRef();
  const progress = useRef(0);
  const targetWidth = 8;
  const targetHeight = 6;

  useFrame(({ camera }) => {
    if (panelRef.current) {
      // Smooth panel animation
      progress.current = THREE.MathUtils.lerp(progress.current, 1, 0.08);
      
      // Make panel always face camera
      panelRef.current.lookAt(camera.position);
      
      // Position panel to the right of the node
      panelRef.current.position.copy(service.position);
      panelRef.current.position.x += 5;
      
      // Scale animation
      panelRef.current.scale.set(
        progress.current,
        progress.current,
        1
      );

      // Content fade
      if (contentRef.current) {
        contentRef.current.children.forEach(child => {
          if (child.material) {
            child.material.opacity = Math.max(0, progress.current - 0.3);
          }
        });
      }
    }
  });

  return (
    <group ref={panelRef} scale={[0, 0, 1]}>
      {/* Panel Background */}
      <mesh>
        <planeGeometry args={[targetWidth, targetHeight]} />
        <meshBasicMaterial 
          color="#001a1a"
          transparent
          opacity={0.85 * progress.current}
        />
      </mesh>

      {/* Content */}
      <group ref={contentRef}>
        <Text
          position={[0, targetHeight/2 - 1, 0.01]}
          fontSize={0.5}
          color={service.primaryColor}
          anchorX="center"
          anchorY="top"
        >
          {service.title}
        </Text>
        
        <Text
          position={[0, targetHeight/2 - 2, 0.01]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          opacity={0.8}
        >
          {service.description}
        </Text>

        <group position={[-targetWidth/2 + 1, targetHeight/2 - 3, 0.01]}>
          {service.features.map((feature, index) => (
            <Text
              key={index}
              position={[0, -index * 0.5, 0]}
              fontSize={0.25}
              color="#ffffff"
              anchorX="left"
              anchorY="top"
              opacity={0.7}
            >
              • {feature}
            </Text>
          ))}
        </group>
      </group>
    </group>
  );
}; 