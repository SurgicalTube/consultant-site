import { useState, useEffect } from 'react';
import { useService } from '../../contexts/ServiceContext';
import { ServiceNode } from './ServiceNode';
import { ServiceDisplay } from './ServiceDisplay';
import * as THREE from 'three';

const services = [
  {
    id: 1,
    title: "Web Development",
    description: "Modern, responsive websites built with cutting-edge technologies",
    features: [
      "React & Next.js Applications",
      "E-commerce Solutions",
      "Progressive Web Apps",
      "Performance Optimization"
    ],
    position: new THREE.Vector3(-8, 0, 5),
    primaryColor: "#00ffff"
  },
  {
    id: 2,
    title: "App Development",
    description: "Native and cross-platform mobile applications",
    features: [
      "iOS & Android Development",
      "React Native Solutions",
      "App Store Optimization",
      "Mobile UI/UX Design"
    ],
    position: new THREE.Vector3(0, 8, -5),
    primaryColor: "#00ffff"
  },
  {
    id: 3,
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure and services",
    features: [
      "AWS & Azure Services",
      "Cloud Architecture",
      "DevOps Integration",
      "Serverless Solutions"
    ],
    position: new THREE.Vector3(8, 0, 5),
    primaryColor: "#00ffff"
  },
  {
    id: 4,
    title: "Consulting",
    description: "Technical guidance and project planning",
    features: [
      "Architecture Design",
      "Tech Stack Selection",
      "Code Reviews",
      "Team Training"
    ],
    position: new THREE.Vector3(0, -8, -5),
    primaryColor: "#00ffff"
  }
];

const connections = [
  [0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]
];

const ConstellationServices = () => {
  const { activeService } = useService();

  return (
    <group position={[0, -45, 0]}>
      {services.map((service) => (
        <ServiceNode 
          key={service.id} 
          service={service}
        />
      ))}

      {activeService && (
        <ServiceDisplay service={activeService} />
      )}

      {connections.map(([fromIdx, toIdx]) => {
        const start = services[fromIdx].position;
        const end = services[toIdx].position;
        const points = [start, end];
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        
        return (
          <line key={`${fromIdx}-${toIdx}`} geometry={lineGeometry}>
            <lineBasicMaterial 
              color="#0088ff" 
              transparent 
              opacity={0.3} 
              linewidth={1}
            />
          </line>
        );
      })}
    </group>
  );
};

export default ConstellationServices; 