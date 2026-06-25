"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { heroFragmentShader, heroVertexShader } from "./hero-shader";

function Icosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state, dt) => {
    // lerp mouse for smooth response
    target.current.x = state.pointer.x;
    target.current.y = state.pointer.y;
    mouse.current.x += (target.current.x - mouse.current.x) * 0.06;
    mouse.current.y += (target.current.y - mouse.current.y) * 0.06;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uMouse.value.set(
        mouse.current.x,
        mouse.current.y
      );
    }
    if (meshRef.current) {
      meshRef.current.rotation.x += dt * 0.08;
      meshRef.current.rotation.y += dt * 0.12;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1.5]}>
      <icosahedronGeometry args={[1.2, 6]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={heroVertexShader}
        fragmentShader={heroFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function Particles({ count = 2000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  /* eslint-disable react-hooks/purity */
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // distribute on a thick spherical shell
      const r = 3.5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);
  /* eslint-enable react-hooks/purity */

  useFrame((state, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.04;
      ref.current.rotation.x += dt * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#a78bfa"
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ResizeHandler() {
  const { gl, size } = useThree();
  const pixelRatio = Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2);
  gl.setPixelRatio(pixelRatio);
  gl.setSize(size.width, size.height, false);
  return null;
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 4, 6]} intensity={0.9} />
      <Icosahedron />
      <Particles />
      <EffectComposer>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.025}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0012, 0.0012)}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
      <ResizeHandler />
    </Canvas>
  );
}
