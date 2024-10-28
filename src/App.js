import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import Hero3D from './components/Hero3D';
import ConstellationServices from './components/ConstellationServices';
import Navbar from './components/Navbar';
import './App.css';

function Experience() {
  return (
    <ScrollControls pages={2} damping={0.1}>
      <Scroll>
        <Hero3D />
        <group position={[0, -window.innerHeight / 50, 0]}>
          <ConstellationServices />
        </group>
      </Scroll>
    </ScrollControls>
  );
}

function App() {
  return (
    <div className="App">
      <Navbar />
      <div id="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 20], fov: 75 }}
        >
          <color attach="background" args={['#000000']} />
          <Experience />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
