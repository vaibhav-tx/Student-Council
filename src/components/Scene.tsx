"use client";

import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';

const LEAF_COUNT = 1500;

function LeafParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport, mouse } = useThree();
  const scrollY = useRef(0);

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
    shape.moveTo(0, 0.2);
    shape.quadraticCurveTo(0.2, 0.1, 0.2, -0.1);
    shape.quadraticCurveTo(0, -0.2, 0, -0.2);
    shape.quadraticCurveTo(-0.2, -0.1, -0.2, 0.1);
    shape.quadraticCurveTo(0, 0.2, 0, 0.2);
    return shape;
  }, []);

  // Generate target points for text
  const textTargets = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return Array(LEAF_COUNT).fill({x:0, y:0, z:0});
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '900 130px "Inter", sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('STUDENT', 600, 130);
    ctx.fillText('COUNCIL', 600, 270);
    
    const imgData = ctx.getImageData(0, 0, 1200, 400).data;
    const points = [];
    for (let y = 0; y < 400; y += 4) {
      for (let x = 0; x < 1200; x += 4) {
        if (imgData[(y * 1200 + x) * 4] > 128) {
          points.push({
            x: (x - 600) * 0.02,
            y: -(y - 200) * 0.02,
            z: 0
          });
        }
      }
    }
    
    // Shuffle and pick
    const shuffled = points.sort(() => 0.5 - Math.random());
    const finalTargets = [];
    for(let i = 0; i < LEAF_COUNT; i++) {
      finalTargets.push(shuffled[i % shuffled.length]);
    }
    return finalTargets;
  }, []);

  // Initialize particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < LEAF_COUNT; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40 + 20, // Start high up
        z: (Math.random() - 0.5) * 20,
        vx: 0, vy: 0, vz: 0,
        rx: Math.random() * Math.PI, ry: Math.random() * Math.PI, rz: Math.random() * Math.PI,
        rvx: (Math.random() - 0.5) * 0.02, rvy: (Math.random() - 0.5) * 0.02, rvz: (Math.random() - 0.5) * 0.02,
        scale: Math.random() * 0.3 + 0.1,
        color: new THREE.Color().setHSL(0.75 + Math.random() * 0.1, 0.6, 0.5 + Math.random() * 0.3),
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
    const time = state.clock.getElapsedTime();
    
    const scroll = scrollY.current;
    const isText = scroll < 200;
    const isWave = scroll > 1500;

    particles.forEach((particle, i) => {
      // Ambient Wind
      const windX = Math.sin(time * 0.5 + particle.y) * 0.01;
      const windY = -0.015 - Math.cos(time * 0.2 + particle.x) * 0.005;
      const windZ = Math.sin(time * 0.3 + particle.x) * 0.01;

      if (isText) {
        // Form Text
        const tx = particle.textTarget.x;
        const ty = particle.textTarget.y + (scroll * 0.01); // Parallax effect
        const tz = particle.textTarget.z;
        
        particle.vx += (tx - particle.x) * 0.02;
        particle.vy += (ty - particle.y) * 0.02;
        particle.vz += (tz - particle.z) * 0.02;
        
        particle.vx *= 0.85;
        particle.vy *= 0.85;
        particle.vz *= 0.85;
      } else if (isWave) {
        // Form Wave/Tornado pattern when scrolled deep
        const tx = particle.textTarget.x; 
        const ty = Math.sin(time * 2 + particle.x * 0.5) * 2 + (scroll * 0.005);
        const tz = Math.cos(time * 2 + particle.x * 0.5) * 2;
        
        particle.vx += (tx - particle.x) * 0.01;
        particle.vy += (ty - particle.y) * 0.01;
        particle.vz += (tz - particle.z) * 0.01;
        
        particle.vx *= 0.9;
        particle.vy *= 0.9;
        particle.vz *= 0.9;
      } else {
        // Free falling / swirling leaves in the middle sections
        particle.vx += windX;
        particle.vy += windY;
        particle.vz += windZ;
        
        particle.vx *= 0.96;
        particle.vy *= 0.96;
        particle.vz *= 0.96;
      }

      // Mouse interaction (Subtle wind gust effect on hover)
      const dx = particle.x - mouseX;
      const dy = particle.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 3) {
        const force = (3 - dist) / 3;
        particle.vx += (dx / dist) * force * 0.15;
        particle.vy += (dy / dist) * force * 0.15;
      }

      // Apply velocity
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;

      // Wrap around bounds (ONLY when free falling, not when bound to shapes)
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

      // Update rotation based on velocity to simulate fluttering physics
      particle.rx += particle.rvx + (particle.vy * 0.1);
      particle.ry += particle.rvy + (particle.vx * 0.1);
      particle.rz += particle.rvz;

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
      <meshStandardMaterial side={THREE.DoubleSide} roughness={0.4} metalness={0.1} />
      <instancedBufferAttribute attach="instanceColor" args={[colorArray, 3]} />
    </instancedMesh>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#d4b4ff" />
        <directionalLight position={[-10, 10, -10]} intensity={1} color="#ffffff" />
        <LeafParticles />
        <Preload all />
      </Canvas>
    </div>
  );
}
