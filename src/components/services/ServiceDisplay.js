import { ServiceBeam } from './ServiceBeam';
import { useState, useEffect } from 'react';

export const ServiceDisplay = ({ service }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  // Reset states when service changes
  useEffect(() => {
    setIsClosing(false);
    setShouldRender(true);
  }, [service]);

  // Handle component unmounting
  useEffect(() => {
    const handleClickOutside = () => {
      setIsClosing(true);
      // Wait for animation to complete before removing
      setTimeout(() => {
        setShouldRender(false);
      }, 1000);
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  if (!shouldRender) return null;

  return (
    <ServiceBeam 
      startPosition={service.position}
      isClosing={isClosing}
    />
  );
}; 