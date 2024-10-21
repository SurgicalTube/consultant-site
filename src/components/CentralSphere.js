import { useTexture } from '@react-three/drei';

const CentralSphere = () => {
  const sphereRef = useRef();
  const texture = useTexture('/path/to/your/texture.jpg'); // Optional: add a texture to your sphere

  useFrame((state, delta) => {
    sphereRef.current.rotation.y += delta * 0.2; // Adjust rotation speed as needed
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[2, 64, 64]} /> {/* Adjust size as needed */}
      <meshStandardMaterial 
        map={texture}
        metalness={0.7}
        roughness={0.2}
        color="#4488ff" // Adjust color as desired
      />
    </mesh>
  );
};