import { createContext, useContext, useState, ReactNode } from 'react';
import * as THREE from 'three';

export type Service = {
  id: number;
  title: string;
  description: string;
  features: string[];
  position: THREE.Vector3;
  primaryColor: string;
};

type ServiceContextType = {
  activeService: Service | null;
  setActiveService: (service: Service | null) => void;
  hoveredService: Service | null;
  setHoveredService: (service: Service | null) => void;
};

type ServiceProviderProps = {
  children: ReactNode;
};

const ServiceContext = createContext<ServiceContextType | null>(null);

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ children }) => {
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [hoveredService, setHoveredService] = useState<Service | null>(null);

  return (
    <ServiceContext.Provider value={{
      activeService,
      setActiveService,
      hoveredService,
      setHoveredService
    }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
}; 