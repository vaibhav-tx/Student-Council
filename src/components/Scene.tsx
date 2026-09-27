"use client";

import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';

const LEAF_COUNT = 3000;

function LeafParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport, mouse } = useThree();
  const scrollY = useRef(0);
  const prevMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const leafShape = useMemo(() => {
    const shape = new THREE.Shape();
    // A more delicate petal/particle shape
    shape.moveTo(0, 0.1);
    shape.quadraticCurveTo(0.1, 0.05, 0.1, -0.05);
    shape.quadraticCurveTo(0, -0.1, 0, -0.1);
    shape.quadraticCurveTo(-0.1, -0.05, -0.1, 0.05);
    shape.quadraticCurveTo(0, 0.1, 0, 0.1);
    return shape;
  }, []);

  // Generate target points for text
  const textTargets = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return Array(LEAF_COUNT).fill({x:0, y:0, z:0});
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '900 130px "Inter", sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('STUDENT', 700, 120);
    ctx.fillText('COUNCIL', 700, 260);
    
    const imgData = ctx.getImageData(0, 0, 1400, 400).data;
    const points = [];
    for (let y = 0; y < 400; y += 4) {
      for (let x = 0; x < 1400; x += 4) {
        if (imgData[(y * 1400 + x) * 4] > 128) {
          points.push({
            x: (x - 700) * 0.018,
            y: -(y - 200) * 0.018,
            z: 0
          });
        }
      }
    }
    
    // Shuffle and pick
    const shuffled = points.sort(() => 0.5 - Math.random());
    const finalTargets = [];
    for(let i = 0; i < LEAF_COUNT; i++) {
      finalTargets.push(shuffled[i % shuffled.length] || {x:0,y:0,z:0});
    }
    return finalTargets;
  }, []);

  // Initialize particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < LEAF_COUNT; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40 + 20,
        z: (Math.random() - 0.5) * 10,
        vx: 0, vy: 0, vz: 0,
        rx: Math.random() * Math.PI, ry: Math.random() * Math.PI, rz: Math.random() * Math.PI,
        rvx: (Math.random() - 0.5) * 0.05, rvy: (Math.random() - 0.5) * 0.05, rvz: (Math.random() - 0.5) * 0.05,
        scale: Math.random() * 0.2 + 0.05,
        color: new THREE.Color().setHSL(0.78 + Math.random() * 0.08, 0.7, 0.4 + Math.random() * 0.4),
        textTarget: textTargets[i]
      });
    }
    return temp;
  }, [textTargets]);

  const colorArray = useMemo(() => {
    const arr = new Float32Array(LEAF_COUNT * 3);
    particles.forEach((p, i) => {
      arr[i * 3] = p.color.r;
      arr[i * 3 + 1] = p.color.g;
      arr[i * 3 + 2] = p.color.b;
    });
    return arr;
  }, [particles]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;
    
    // Mouse velocity for wind gust
    const mouseVX = mouseX - prevMouse.current.x;
    const mouseVY = mouseY - prevMouse.current.y;
    prevMouse.current = { x: mouseX, y: mouseY };

    const time = state.clock.getElapsedTime();
    const scroll = scrollY.current;
    
    // Phases based on scroll
    const isText = scroll < 300;
    const isWave = scroll > 1500;

    particles.forEach((particle, i) => {
      // 1. Fluid / Curl Noise Approximation
      const noiseScale = 0.3;
      const noiseSpeed = 0.5;
      const curlX = Math.sin(particle.y * noiseScale + time * noiseSpeed) + Math.cos(particle.z * noiseScale + time * noiseSpeed);
      const curlY = Math.sin(particle.z * noiseScale + time * noiseSpeed) + Math.cos(particle.x * noiseScale + time * noiseSpeed);
      const curlZ = Math.sin(particle.x * noiseScale + time * noiseSpeed) + Math.cos(particle.y * noiseScale + time * noiseSpeed);

      if (isText) {
        // --- TEXT FORMATION PHYSICS ---
        const tx = particle.textTarget.x;
        const ty = particle.textTarget.y + (scroll * 0.015); // Parallax
        const tz = particle.textTarget.z;

        // Throb effect (generates wind like wave in interval of time)
        const wave = Math.sin(time * 3 - particle.x * 0.5) * Math.cos(time * 2 + particle.y * 0.5);
        const throb = (Math.sin(time * 1.5) > 0.8) ? wave * 0.5 : wave * 0.1; // Pulses every few seconds

        // Spring Force (wavers around but back to where it belonged)
        const stiffness = 0.03; 
        particle.vx += (tx - particle.x) * stiffness;
        particle.vy += (ty - particle.y) * stiffness;
        particle.vz += (tz + throb - particle.z) * stiffness;

        // Add subtle fluid organic motion on top of the text
        particle.vx += curlX * 0.005;
        particle.vy += curlY * 0.005;
        particle.vz += curlZ * 0.005;
        
        // High damping for a relaxing, fluid, non-jittery feel
        particle.vx *= 0.86;
        particle.vy *= 0.86;
        particle.vz *= 0.86;
      } else if (isWave) {
        // --- WAVE FORMATION PHYSICS ---
        const tx = particle.textTarget.x; 
        const ty = Math.sin(time * 1.5 + particle.x * 0.4) * 2 + (scroll * 0.005);
        const tz = Math.cos(time * 1.5 + particle.x * 0.4) * 2;
        
        particle.vx += (tx - particle.x) * 0.015;
        particle.vy += (ty - particle.y) * 0.015;
        particle.vz += (tz - particle.z) * 0.015;
        
        particle.vx *= 0.9;
        particle.vy *= 0.9;
        particle.vz *= 0.9;
      } else {
        // --- FREE FALLING / SCATTER PHYSICS ---
        // When scrolled between hero and bottom
        particle.vx += curlX * 0.02;
        particle.vy += curlY * 0.02 - 0.01; // Gravity
        particle.vz += curlZ * 0.02;
        
        particle.vx *= 0.95;
        particle.vy *= 0.95;
        particle.vz *= 0.95;
      }

      // 2. Interactive Mouse Wind Gust
      const dx = particle.x - mouseX;
      const dy = particle.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Radius of interaction
      if (dist < 4) {
        const force = (4 - dist) / 4;
        
        // Push particles away from cursor
        particle.vx += (dx / dist) * force * 0.05;
        particle.vy += (dy / dist) * force * 0.05;
        
        // Drag particles along with mouse velocity (wake effect)
        particle.vx += mouseVX * force * 0.1;
        particle.vy += mouseVY * force * 0.1;
        
        // Push them forward/backward in Z for 3D depth
        particle.vz += (Math.random() - 0.5) * force * 0.2;
      }

      // Apply velocity
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;

      // Wrap around bounds (ONLY when free falling)
      if (!isText && !isWave) {
        const halfW = viewport.width / 2;
        const halfH = viewport.height / 2;
        if (particle.y < -halfH - 2) {
          particle.y = halfH + 2;
          particle.x = (Math.random() - 0.5) * viewport.width;
        }
        if (particle.x < -halfW - 2) particle.x = halfW + 2;
        if (particle.x > halfW + 2) particle.x = -halfW - 2;
      }

      // 3. Rotation physics (flutters based on velocity)
      particle.rx += particle.rvx + (particle.vy * 0.2);
      particle.ry += particle.rvy + (particle.vx * 0.2);
      particle.rz += particle.rvz + (particle.vz * 0.2);

      // Update Instance Matrix
      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.rotation.set(particle.rx, particle.ry, particle.rz);
      dummy.scale.set(particle.scale, particle.scale, particle.scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, LEAF_COUNT]}>
      <shapeGeometry args={[leafShape]} />
      <meshStandardMaterial 
        side={THREE.DoubleSide} 
        roughness={0.2} 
        metalness={0.3}
        transparent
        opacity={0.9}
      />
      <instancedBufferAttribute attach="instanceColor" args={[colorArray, 3]} />
    </instancedMesh>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#d4b4ff" />
        <directionalLight position={[-10, 10, -10]} intensity={1} color="#ffffff" />
        <LeafParticles />
        <Preload all />
      </Canvas>
    </div>
  );
}
