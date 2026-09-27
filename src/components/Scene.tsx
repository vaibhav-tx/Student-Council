"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';

const LEAF_COUNT = 800;

function LeafParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport, mouse } = useThree();

  // Create dummy object to compute matrix
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Custom leaf/petal shape
  const leafShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.2);
    shape.quadraticCurveTo(0.2, 0.1, 0.2, -0.1);
    shape.quadraticCurveTo(0, -0.2, 0, -0.2);
    shape.quadraticCurveTo(-0.2, -0.1, -0.2, 0.1);
    shape.quadraticCurveTo(0, 0.2, 0, 0.2);
    return shape;
  }, []);

  // Initialize particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < LEAF_COUNT; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 10,
        vx: 0,
        vy: 0,
        vz: 0,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        rvx: (Math.random() - 0.5) * 0.02,
        rvy: (Math.random() - 0.5) * 0.02,
        rvz: (Math.random() - 0.5) * 0.02,
        scale: Math.random() * 0.4 + 0.1,
        color: new THREE.Color().setHSL(0.75 + Math.random() * 0.1, 0.6, 0.5 + Math.random() * 0.3) // Purple hues
      });
    }
    return temp;
  }, []);

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
    
    // Calculate mouse position in world space roughly
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;

    particles.forEach((particle, i) => {
      const time = state.clock.getElapsedTime();
      
      // Wind force (drifting left/right and down)
      const windX = Math.sin(time * 0.5 + particle.y) * 0.01;
      const windY = -0.015 - Math.cos(time * 0.2 + particle.x) * 0.005;

      // Mouse interaction (wind gust)
      const dx = particle.x - mouseX;
      const dy = particle.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 4) {
        const force = (4 - dist) / 4;
        // The mouse creates a wake/gust that pushes particles away and slightly in the direction of movement
        particle.vx += (dx / dist) * force * 0.08;
        particle.vy += (dy / dist) * force * 0.08;
      }

      particle.vx += windX;
      particle.vy += windY;

      // Friction / Air resistance
      particle.vx *= 0.94;
      particle.vy *= 0.94;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;

      // Update rotation based on velocity to simulate fluttering
      particle.rx += particle.rvx + particle.vy * 0.1;
      particle.ry += particle.rvy + particle.vx * 0.1;
      particle.rz += particle.rvz;

      // Wrap around bounds
      const halfW = viewport.width / 2;
      const halfH = viewport.height / 2;
      if (particle.y < -halfH - 2) {
        particle.y = halfH + 2;
        particle.x = (Math.random() - 0.5) * viewport.width;
      }
      if (particle.x < -halfW - 2) particle.x = halfW + 2;
      if (particle.x > halfW + 2) particle.x = -halfW - 2;

      // Apply to dummy
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
