import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import Hero3D from './components/Hero3D';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import useLoadingStore from './components/LoadingManager';
import { ServiceProvider } from './contexts/ServiceContext';
import './App.css';

function Experience() {
  return (
    <ScrollControls pages={3} damping={0.3} distance={1}>
      <Scroll>
        <Hero3D />
      </Scroll>
    </ScrollControls>
  );
}

function App() {
  const { isLoading, setLoading } = useLoadingStore();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <ServiceProvider>
      <div className="App">
        <Navbar />
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <div id="home">
            <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
              <color attach="background" args={['#000000']} />
              <Experience />
            </Canvas>
          </div>
        )}
      </div>
    </ServiceProvider>
  );
}

export default App;
