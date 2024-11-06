import { useRef, useState, useMemo, useEffect } from 'react';
import { Text, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useService } from '../../contexts/ServiceContext';


const services = [
  {
    id: 1,
    title: "Web Development",
    description: "Modern, responsive websites",
    features: [
      "Custom website design",
      "Responsive layouts",
      "Performance optimization",
      "SEO best practices",
      "Modern frameworks (React, Next.js)"
    ],
    position: new THREE.Vector3(-25, -65, 0),
    primaryColor: "#00ffff"
  },
  {
    id: 2,
    title: "App Development",
    description: "Native and cross-platform mobile applications",
    features: [
      "iOS and Android development",
      "Cross-platform solutions",
      "UI/UX design",
      "Performance optimization",
      "App store deployment"
    ],
    position: new THREE.Vector3(0, -65, 0),
    primaryColor: "#00ffff"
  },
  {
    id: 3,
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure",
    features: [
      "AWS/Azure/GCP solutions",
      "Cloud architecture design",
      "Serverless applications",
      "DevOps automation",
      "Security best practices"
    ],
    position: new THREE.Vector3(25, -65, 0),
    primaryColor: "#00ffff"
  }
];

const ParticleBackground = () => {
  const count = 5000;
  const particlesRef = useRef();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 15 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta) * 3;
      pos[i * 3 + 1] = (radius * Math.sin(phi) * Math.sin(theta) - 80) * 0.7;
      pos[i * 3 + 2] = radius * Math.cos(phi) * 1.5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      
      const rotationMatrix = new THREE.Matrix4().makeRotationY(0.05 * time);
      const position = new THREE.Vector3(x, y, z).applyMatrix4(rotationMatrix);
      
      particlesRef.current.setMatrixAt(i, new THREE.Matrix4().setPosition(position));
    }
    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={particlesRef} args={[null, null, count]}>
      <sphereGeometry args={[0.015]} />
      <meshBasicMaterial color="#4fc3dc" transparent opacity={0.5} />
    </instancedMesh>
  );
};

const GlassPanel = ({ service }) => {
  const panelRef = useRef();
  const contentRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [panelSize, setPanelSize] = useState({ width: 10, height: 8 }); // Default size

  useFrame((state) => {
    if (!panelRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Base floating animation
    panelRef.current.position.y = service.position.y + Math.sin(t * 0.5) * 0.2;
    
    // Dynamic tilt based on mouse position when hovered
    if (hovered) {
      const targetRotationX = mousePosition.y * 0.05;
      const targetRotationY = mousePosition.x * 0.05;

      panelRef.current.rotation.x = THREE.MathUtils.lerp(
        panelRef.current.rotation.x,
        targetRotationX,
        0.05
      );
      panelRef.current.rotation.y = THREE.MathUtils.lerp(
        panelRef.current.rotation.y,
        targetRotationY,
        0.05
      );
    } else {
      panelRef.current.rotation.x = THREE.MathUtils.lerp(
        panelRef.current.rotation.x,
        0,
        0.05
      );
      panelRef.current.rotation.y = THREE.MathUtils.lerp(
        panelRef.current.rotation.y,
        0,
        0.05
      );
    }
  });

  // Handle mouse movement
  const handlePointerMove = (event) => {
    if (!hovered) return;
    
    const x = event.point.x - service.position.x;
    const y = event.point.y - service.position.y;
    
    setMousePosition({ 
      x: THREE.MathUtils.clamp(x / 10, -1, 1),
      y: THREE.MathUtils.clamp(y / 10, -1, 1)
    });
  };

  // Calculate panel size based on content
  useEffect(() => {
    if (contentRef.current) {
      const padding = 2;
      const width = Math.max(10, contentRef.current.width + padding);
      const height = Math.max(8, contentRef.current.height + padding);
      setPanelSize({ width, height });
    }
  }, [service]);

  return (
    <group 
      ref={panelRef}
      position={service.position.toArray()}
      scale={[1.5, 1.5, 1.5]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => {
        setHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      onPointerMove={handlePointerMove}
    >
      {/* Shadow layer */}
      <RoundedBox args={[10.6, 10, 0.01]} radius={0.5} position={[0.15, -0.15, -0.05]}>
        <meshBasicMaterial
          transparent
          opacity={0.1}
          color="#000000"
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </RoundedBox>

      {/* Outer glow */}
      <RoundedBox args={[10.6, 10, 0.01]} radius={0.5}>
        <meshBasicMaterial
          transparent
          opacity={hovered ? 0.15 : 0.08}
          color="#4fc3dc"
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* Frosted glass effect - back layer */}
      <RoundedBox args={[10, 9.4, 0.1]} radius={0.5}>
        <meshBasicMaterial
          transparent
          opacity={0.08}
          color="#1a3a3a"
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* Main frosted panel */}
      <RoundedBox args={[9.8, 9.2, 0.08]} radius={0.48}>
        <meshBasicMaterial
          transparent
          opacity={0.12}
          color={hovered ? "#1a5a5a" : "#1a4a4a"}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </RoundedBox>

      {/* Frosted surface detail */}
      <RoundedBox args={[9.6, 9.0, 0.05]} radius={0.45}>
        <meshBasicMaterial
          transparent
          opacity={0.05}
          color="#2a4a4a"
          side={THREE.DoubleSide}
          blending={THREE.CustomBlending}
        />
      </RoundedBox>

      {/* Accent glow border */}
      <RoundedBox args={[9.7, 9.1, 0.06]} radius={0.46}>
        <meshBasicMaterial
          transparent
          opacity={hovered ? 0.15 : 0.08}
          color="#4fc3dc"
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </RoundedBox>

      {/* Title with reduced glow */}
      <group position={[0, 2, 0.2]}>
        {/* Background glow */}
        <Text
          fontSize={0.8}
          color="#4fc3dc"
          anchorX="center"
          anchorY="middle"
          opacity={0.3}
          position={[0, 0, -0.05]}
        >
          {service.title}
        </Text>
        {/* Main text */}
        <Text
          fontSize={0.8}
          color={hovered ? "#ffffff" : "#e0e0e0"}
          anchorX="center"
          anchorY="middle"
        >
          {service.title}
        </Text>
      </group>

      {/* Description - moved up slightly */}
      <Text
        position={[0, 1.09, 0.2]}
        fontSize={0.4}
        color={hovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)"}
        anchorX="center"
        anchorY="middle"
      >
        {service.description}
      </Text>

      {/* Features list - centered in container */}
      <group position={[0, -1.5, 0.2]}>
        {/* Features container border - adding radius to match */}
        <RoundedBox 
          args={[8, 4, 0.02]}
          radius={0.3}
          renderOrder={1}
        >
          <meshBasicMaterial
            transparent
            opacity={0.15}
            color="#001618"
            side={THREE.DoubleSide}
            depthTest={false}
            depthWrite={false}
          />
        </RoundedBox>

        {/* Features list content */}
        {service.features?.map((feature, index) => (
          <Text
            key={index}
            position={[0, 0.8 - index * 0.45, 0.03]}  // Slightly increased z
            fontSize={0.35}
            color="rgba(255,255,255,0.5)"
            anchorX="center"
            anchorY="middle"
            maxWidth={7}
            renderOrder={2}    // Ensure text renders on top of container
          >
            • {feature}
          </Text>
        ))}
      </group>

      {/* Additional hover highlight */}
      {hovered && (
        <RoundedBox args={[10.2, 9.6, 0.02]} radius={0.5}>
          <meshBasicMaterial
            transparent
            opacity={0.1}
            color="#ffffff"
            side={THREE.DoubleSide}
          />
        </RoundedBox>
      )}
    </group>
  );
};

export const FloatingPanels = () => {
  return (
    <group>
      <ParticleBackground />
      <ambientLight intensity={0.15} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.3} 
        color="#4fc3dc" 
      />
      {services.map((service) => (
        <GlassPanel key={service.id} service={service} />
      ))}
    </group>
  );
}; 