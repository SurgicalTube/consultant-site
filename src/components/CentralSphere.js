import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const CentralSphere = () => {
  const meshRef = useRef();
  const [dayMap, nightMap, cloudMap] = useTexture([
    '/textures/2k_earth_daymap.jpg',
    '/textures/2k_earth_nightmap.jpg',
    '/textures/2k_earth_clouds.jpg'
  ]);

  const uniforms = useRef({
    dayTexture: { value: dayMap },
    nightTexture: { value: nightMap },
    cloudTexture: { value: cloudMap },
    sunDirection: { value: new THREE.Vector3(1, 0, 0) }
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;
    uniform sampler2D cloudTexture;
    uniform vec3 sunDirection;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      float intensity = dot(vNormal, sunDirection);
      
      // Adjust the transition sharpness here
      float dayMix = smoothstep(-0.2, 0.2, intensity);
      
      vec3 dayColor = texture2D(dayTexture, vUv).rgb;
      vec3 nightColor = texture2D(nightTexture, vUv).rgb;
      vec3 cloudColor = texture2D(cloudTexture, vUv).rgb;
      
      vec3 baseColor = mix(nightColor, dayColor, dayMix);
      vec3 finalColor = mix(baseColor, cloudColor, 0.3);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.05;
    uniforms.current.sunDirection.value.x = Math.sin(time * 0.2);
    uniforms.current.sunDirection.value.z = Math.cos(time * 0.2);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  );
};

export default CentralSphere;
