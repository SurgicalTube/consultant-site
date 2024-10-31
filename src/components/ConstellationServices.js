import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ConstellationServices = () => {
  const [hoveredService, setHoveredService] = React.useState(null);

  // Positions with varied depth (z-axis)
  const services = [
    {
      id: 1,
      title: "Web Development",
      description: "Modern, responsive websites",
      position: new THREE.Vector3(-4, 4, 5)  // Pushed forward
    },
    {
      id: 2,
      title: "App Development",
      description: "Native & cross-platform apps",
      position: new THREE.Vector3(4, 4, -3)  // Pushed back
    },
    {
      id: 3,
      title: "Cloud Solutions",
      description: "Scalable infrastructure",
      position: new THREE.Vector3(0, -2, 8)  // Most forward
    },
    {
      id: 4,
      title: "Consulting",
      description: "Technical expertise & guidance",
      position: new THREE.Vector3(-4, -4, -5)  // Most back
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

  // Calculate line opacity based on z-distance
  const getLineOpacity = (pos1, pos2) => {
    const distance = Math.abs(pos1.z - pos2.z);
    return THREE.MathUtils.clamp(1 - distance / 15, 0.1, 0.8);
  };

  // Calculate node size based on z-position
  const getNodeSize = (zPosition) => {
    // Nodes closer to camera appear larger
    return THREE.MathUtils.mapLinear(zPosition, -5, 8, 0.15, 0.3);
  };

  return (
    <group position={[0, -35, 0]}>
      {/* Service nodes */}
      {services.map((service) => (
        <group key={service.id} position={service.position.toArray()}>
          <mesh
            onPointerOver={() => setHoveredService(service.id)}
            onPointerOut={() => setHoveredService(null)}
          >
            <sphereGeometry args={[getNodeSize(service.position.z), 32, 32]} />
            <meshBasicMaterial 
              color={hoveredService === service.id ? "#00ffff" : "#ffffff"}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Connecting lines with depth-based opacity */}
      {services.map((service, idx) => 
        services.slice(idx + 1).map(otherService => (
          <line key={`${service.id}-${otherService.id}`}>
            <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([
              service.position,
              otherService.position
            ])} />
            <lineBasicMaterial 
              attach="material" 
              color="#0088ff" 
              opacity={getLineOpacity(service.position, otherService.position)} 
              transparent 
            />
          </line>
        ))
      )}
    </group>
  );
};

export default ConstellationServices;