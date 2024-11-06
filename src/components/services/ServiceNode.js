import { useRef } from 'react';
import { useService } from '../../contexts/ServiceContext';

export const ServiceNode = ({ service }) => {
  const nodeRef = useRef();
  const { 
    activeService, 
    setActiveService, 
    hoveredService, 
    setHoveredService 
  } = useService();
  
  const isActive = activeService?.id === service.id;
  const isHovered = hoveredService?.id === service.id;

  const handleClick = (e) => {
    e.stopPropagation();
    if (isActive) {
      setActiveService(null);
    } else {
      setActiveService(service);
    }
  };

  return (
    <mesh
      ref={nodeRef}
      position={service.position.toArray()}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredService(service);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHoveredService(null);
      }}
    >
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshBasicMaterial 
        color={isActive ? "#00ffff" : isHovered ? "#0088ff" : "#ffffff"}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}; 