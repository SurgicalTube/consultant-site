import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

const Star = ({ position, size = 0.2, color = '#ffffff', onHover }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    // More pronounced pulsing effect
    const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 1;
    meshRef.current.scale.set(pulse, pulse, pulse);
    
    // Subtle floating motion
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position.x) * 0.001;
  });

  return (
    <group>
      {/* Main star */}
      <mesh 
        ref={meshRef}
        position={position}
        onPointerEnter={() => {
          setHovered(true);
          onHover(true);
        }}
        onPointerLeave={() => {
          setHovered(false);
          onHover(false);
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 4 : 2}
        />
      </mesh>
      
      {/* Glow effect */}
      <sprite position={position}>
        <spriteMaterial 
          attach="material" 
          map={new THREE.TextureLoader().load('/textures/glow.png')}
          transparent
          opacity={0.5}
          color={color}
        />
      </sprite>
    </group>
  );
};

const ConstellationServices = () => {
  const [hoveredService, setHoveredService] = React.useState(null);

  // More spread out and 3D positions
  const services = [
    {
      id: 1,
      title: "Web Development",
      description: "Modern, responsive websites",
      position: new THREE.Vector3(-4, 4, 2)  // Adjusted for depth
    },
    {
      id: 2,
      title: "App Development",
      description: "Native & cross-platform apps",
      position: new THREE.Vector3(4, 2, -2)  // Adjusted for depth
    },
    {
      id: 3,
      title: "Cloud Solutions",
      description: "Scalable infrastructure",
      position: new THREE.Vector3(0, -2, 3)  // Adjusted for depth
    },
    {
      id: 4,
      title: "Consulting",
      description: "Technical expertise & guidance",
      position: new THREE.Vector3(-3, -4, -1)  // Adjusted for depth
    }
  ];

  // Add orbiting particles
  const orbitRef = useRef();
  
  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.z += 0.001;
      orbitRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <group position={[0, -15, -5]}>
      {/* Orbiting particles */}
      <group ref={orbitRef}>
        {Array.from({ length: 100 }).map((_, i) => {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI * 2;
          const r = 8 + Math.random() * 4;
          
          return (
            <mesh key={i} position={[
              r * Math.cos(theta) * Math.cos(phi),
              r * Math.sin(theta),
              r * Math.cos(theta) * Math.sin(phi)
            ]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#ffffff" opacity={0.5} transparent />
            </mesh>
          );
        })}
      </group>

      {/* Constellation lines with depth */}
      {services.map((service, i) => {
        const nextService = services[(i + 1) % services.length];
        return (
          <line key={i}>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  service.position.x, service.position.y, service.position.z,
                  nextService.position.x, nextService.position.y, nextService.position.z
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color="#00a2ff" 
              transparent 
              opacity={0.3} 
              linewidth={1}
            />
          </line>
        );
      })}

      {/* Stars with enhanced visuals */}
      {services.map((service) => (
        <group key={service.id}>
          <Star 
            position={service.position}
            onHover={(hovered) => setHoveredService(hovered ? service.id : null)}
            color={hoveredService === service.id ? '#00ffff' : '#ffffff'}
            size={0.3}  // Larger stars
          />
          
          {hoveredService === service.id && (
            <Html position={service.position}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.8)',
                padding: '15px',
                borderRadius: '8px',
                color: 'white',
                transform: 'translateX(30px)',
                whiteSpace: 'nowrap',
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)'
              }}>
                <h3 style={{ margin: '0 0 8px 0' }}>{service.title}</h3>
                <p style={{ margin: 0 }}>{service.description}</p>
              </div>
            </Html>
          )}
        </group>
      ))}

      {/* Enhanced lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
    </group>
  );
};

export default ConstellationServices; 