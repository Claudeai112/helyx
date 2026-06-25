"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  Preload,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  DepthOfField,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  globalFragmentShader,
  globalVertexShader,
  lightFragmentShader,
  lightVertexShader,
  nebulaFragmentShader,
  nebulaVertexShader,
} from "./global-shader";
import { sceneState } from "./scene-state";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function makeShaderUniforms() {
  return {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uDistort: { value: 1 },
    uTint: { value: new THREE.Vector3(0.42, 0.36, 0.9) },
    uOpacity: { value: 1 },
  };
}

function makeLightUniforms() {
  return {
    uTime: { value: 0 },
    uTint: { value: new THREE.Vector3(0.42, 0.36, 0.9) },
    uOpacity: { value: 0 },
  };
}

function makeNebulaUniforms() {
  return {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uTint: { value: new THREE.Vector3(0.42, 0.36, 0.9) },
  };
}

/**
 * Far layer (z: -8) — shader-painted nebula plane with fbm + domain
 * warping. Drifts slowly with scroll parallax (factor 0.2). Picks up
 * the current section tint from sceneState.
 */
function NebulaPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const uniforms = useMemo(() => makeNebulaUniforms(), []);

  useFrame((state) => {
    mouse.current.x += (state.pointer.x - mouse.current.x) * 0.06;
    mouse.current.y += (state.pointer.y - mouse.current.y) * 0.06;

    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      matRef.current.uniforms.uMouse.value.copy(mouse.current);
      matRef.current.uniforms.uTint.value.set(
        sceneState.tintR,
        sceneState.tintG,
        sceneState.tintB
      );
    }
    if (meshRef.current) {
      // parallax factor 0.2 — far-layer drift
      meshRef.current.position.x = sceneState.meshX * 0.2;
      meshRef.current.position.y = sceneState.meshY * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -8]}>
      <planeGeometry args={[30, 18]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/**
 * Mid layer (z: -3) — refractive icosahedron using drei's
 * MeshTransmissionMaterial. Parallax factor 0.6. Drifts toward cursor
 * for the "magnetic" feel.
 */
function IcoMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const cursor = useRef(new THREE.Vector2(0, 0));

  useFrame((state, dt) => {
    cursor.current.x += (state.pointer.x - cursor.current.x) * 0.08;
    cursor.current.y += (state.pointer.y - cursor.current.y) * 0.08;

    if (meshRef.current) {
      meshRef.current.rotation.x += dt * 0.08;
      meshRef.current.rotation.y += dt * 0.12;
      meshRef.current.rotation.z = sceneState.meshRotZ;
      // mid-layer parallax + cursor push
      meshRef.current.position.set(
        sceneState.meshX * 0.6 + cursor.current.x * 0.35,
        sceneState.meshY * 0.6 + cursor.current.y * 0.25,
        sceneState.meshZ
      );
      meshRef.current.scale.setScalar(sceneState.meshScale);
      meshRef.current.visible = sceneState.opIco > 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.2, 6]} />
      <MeshTransmissionMaterial
        transmission={1}
        thickness={2}
        roughness={0.15}
        chromaticAberration={0.05}
        distortion={0.4}
        distortionScale={0.5}
        temporalDistortion={0.2}
        ior={1.4}
        color={"#ffffff"}
        backside={false}
        samples={6}
        resolution={512}
        anisotropy={0.3}
      />
    </mesh>
  );
}

/**
 * Torus knot — services mesh. Keeps the lightweight custom shader
 * (sceneState-driven tint) because cross-fading 5 extra transmission
 * materials would blow the frame budget.
 */
function TorusMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => makeLightUniforms(), []);

  useFrame((state, dt) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      matRef.current.uniforms.uTint.value.set(
        sceneState.tintR,
        sceneState.tintG,
        sceneState.tintB
      );
      matRef.current.uniforms.uOpacity.value = sceneState.opTorus;
      matRef.current.visible = sceneState.opTorus > 0.01;
    }
    if (meshRef.current) {
      meshRef.current.rotation.x += dt * 0.18;
      meshRef.current.rotation.y += dt * 0.24;
      meshRef.current.position.set(
        sceneState.meshX * 0.6,
        sceneState.meshY * 0.6,
        sceneState.meshZ
      );
      meshRef.current.scale.setScalar(sceneState.meshScale * 0.95);
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.32, 160, 20]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={lightVertexShader}
        fragmentShader={lightFragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

function HelixMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const matsRef = useRef<THREE.MeshBasicMaterial[]>([]);

  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      arr.push([Math.cos(a) * 2, (i - 1.5) * 0.65, Math.sin(a) * 2]);
    }
    return arr;
  }, []);

  useFrame((_state, dt) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.45;
      groupRef.current.rotation.x = sceneState.meshRotZ * 0.6;
      groupRef.current.position.set(
        sceneState.meshX * 0.6,
        sceneState.meshY * 0.6,
        sceneState.meshZ
      );
      groupRef.current.scale.setScalar(sceneState.meshScale);
      groupRef.current.visible = sceneState.opHelix > 0.01;
    }
    matsRef.current.forEach((m, i) => {
      if (!m) return;
      m.opacity = sceneState.opHelix * 0.95;
      m.color.setRGB(
        i % 2 === 0 ? sceneState.tintR : sceneState.tintR * 0.6 + 0.2,
        i % 2 === 0 ? sceneState.tintG : sceneState.tintG * 0.8 + 0.1,
        i % 2 === 0 ? sceneState.tintB : sceneState.tintB * 0.7 + 0.2
      );
    });
  });

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.22, 28, 28]} />
          <meshBasicMaterial
            ref={(el) => {
              if (el) matsRef.current[i] = el;
            }}
            color="#00cec9"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function LatticeMesh() {
  const instRef = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const count = 7 * 7 * 3;

  const matrices = useMemo(() => {
    const arr: THREE.Matrix4[] = [];
    const dummy = new THREE.Matrix4();
    for (let x = 0; x < 7; x++) {
      for (let y = 0; y < 7; y++) {
        for (let z = 0; z < 3; z++) {
          dummy.makeTranslation(
            (x - 3) * 0.6,
            (y - 3) * 0.6,
            (z - 1) * 0.6
          );
          arr.push(dummy.clone());
        }
      }
    }
    return arr;
  }, []);

  const initialized = useRef(false);

  useFrame((_state, dt) => {
    const mesh = instRef.current;
    if (!mesh) return;
    mesh.visible = sceneState.opLattice > 0.01;
    if (matRef.current) {
      matRef.current.opacity = sceneState.opLattice * 0.55;
      matRef.current.color.setRGB(
        sceneState.tintR,
        sceneState.tintG,
        sceneState.tintB
      );
    }
    mesh.rotation.y += dt * 0.12;
    mesh.rotation.x = sceneState.meshRotZ * 0.4;
    mesh.position.set(
      sceneState.meshX * 0.6 + 1.5,
      sceneState.meshY * 0.6,
      sceneState.meshZ - 2
    );
    mesh.scale.setScalar(0.6 + sceneState.opLattice * 0.5);

    if (!initialized.current) {
      for (let i = 0; i < count; i++) mesh.setMatrixAt(i, matrices[i]);
      mesh.instanceMatrix.needsUpdate = true;
      initialized.current = true;
    }
  });

  return (
    <instancedMesh ref={instRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.16, 0.16, 0.16]} />
      <meshBasicMaterial
        ref={matRef}
        color="#00cec9"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

function PrismMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const matsRef = useRef<THREE.MeshBasicMaterial[]>([]);

  useFrame((_state, dt) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.15;
      groupRef.current.position.set(
        sceneState.meshX * 0.6,
        sceneState.meshY * 0.6 + 0.3,
        sceneState.meshZ - 0.5
      );
      groupRef.current.scale.setScalar(sceneState.meshScale * 0.9);
      groupRef.current.visible = sceneState.opPrism > 0.01;
    }
    matsRef.current.forEach((m) => {
      if (!m) return;
      m.opacity = sceneState.opPrism * 0.7;
      m.color.setRGB(sceneState.tintR, sceneState.tintG, sceneState.tintB);
    });
  });

  return (
    <group ref={groupRef}>
      {[-1.4, 0, 1.4].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <boxGeometry args={[0.55, 3, 0.55]} />
          <meshBasicMaterial
            ref={(el) => {
              if (el) matsRef.current[i] = el;
            }}
            color="#a78bfa"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function StarBurstMesh() {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const count = 800;

  /* eslint-disable react-hooks/purity */
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const dir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();
      const r = 1.2 + Math.random() * 2.8;
      arr[i * 3] = dir.x * r;
      arr[i * 3 + 1] = dir.y * r;
      arr[i * 3 + 2] = dir.z * r;
    }
    return arr;
  }, []);
  /* eslint-enable react-hooks/purity */

  useFrame((_state, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.2;
      ref.current.rotation.x += dt * 0.08;
      ref.current.position.set(
        sceneState.meshX * 0.6,
        sceneState.meshY * 0.6,
        sceneState.meshZ - 0.8
      );
      ref.current.visible = sceneState.opStar > 0.01;
    }
    if (matRef.current) {
      matRef.current.opacity = sceneState.opStar * 0.95;
      matRef.current.color.setRGB(
        sceneState.tintR,
        sceneState.tintG,
        sceneState.tintB
      );
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.05}
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Near layer (z: 2) — 3000-point particle field at parallax 1.0.
 * Larger size, additive blend, drifts with the full scroll signal.
 */
function NearParticles({ count = 3000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  /* eslint-disable react-hooks/purity */
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // distribute in a wide flat-ish slab near camera
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3 + 1.5;
    }
    return arr;
  }, [count]);
  /* eslint-enable react-hooks/purity */

  useFrame((_state, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.02;
      ref.current.position.set(
        sceneState.meshX * 1.0,
        sceneState.meshY * 1.0,
        0
      );
    }
    if (matRef.current) {
      matRef.current.color.setRGB(
        sceneState.tintR * 0.6 + 0.3,
        sceneState.tintG * 0.6 + 0.3,
        sceneState.tintB * 0.7 + 0.25
      );
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.035}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ScrollCamera() {
  const { camera } = useThree();
  useFrame(() => {
    /* eslint-disable react-hooks/immutability */
    camera.position.x += (sceneState.camX - camera.position.x) * 0.08;
    camera.position.y += (sceneState.camY - camera.position.y) * 0.08;
    camera.position.z += (sceneState.camZ - camera.position.z) * 0.08;
    camera.lookAt(0, 0, 0);
    /* eslint-enable react-hooks/immutability */
  });
  return null;
}

export function GlobalScene() {
  // Suppress unused warning on globalVertexShader / globalFragmentShader —
  // kept exported for future per-section shader use.
  void globalVertexShader;
  void globalFragmentShader;

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        {/* Rim light — cyan */}
        <pointLight position={[5, 5, 5]} color="#00cec9" intensity={2} />
        {/* Fill light — purple */}
        <pointLight position={[-5, 0, 5]} color="#6c5ce7" intensity={1.5} />
        <directionalLight position={[4, 4, 6]} intensity={0.6} />

        {/* Procedural environment built in-GPU from Lightformers — gives the
            glass icosahedron its reflections WITHOUT fetching a remote HDRI
            (drei presets load from a third-party CDN, which the CSP blocks and
            which would otherwise crash the scene). Fully self-contained. */}
        <Environment background={false} resolution={256}>
          <Lightformer intensity={2} color="#28e0c8" position={[0, 2, -5]} scale={[6, 6, 1]} />
          <Lightformer intensity={1} color="#00cec9" position={[-4, 0, -3]} scale={[3, 6, 1]} />
          <Lightformer intensity={0.6} color="#6c5ce7" position={[4, -1, -3]} scale={[3, 4, 1]} />
          <Lightformer intensity={0.4} color="#ffffff" position={[0, -3, -4]} scale={[8, 2, 1]} />
        </Environment>

        <ScrollCamera />

        {/* Far layer — parallax 0.2 */}
        <NebulaPlane />

        {/* Mid layer — parallax 0.6 */}
        <IcoMesh />
        <TorusMesh />
        <HelixMesh />
        <LatticeMesh />
        <PrismMesh />
        <StarBurstMesh />

        {/* Near layer — parallax 1.0 */}
        <NearParticles />

        <EffectComposer>
          <DepthOfField
            focusDistance={0.02}
            focalLength={0.05}
            bokehScale={3}
          />
          <Bloom
            intensity={1.4}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.0015, 0.0015)}
            radialModulation={false}
            modulationOffset={0}
          />
          <Noise opacity={0.06} premultiply blendFunction={BlendFunction.NORMAL} />
          <Vignette offset={0.3} darkness={0.6} eskil={false} />
        </EffectComposer>

        <Preload all />
      </Suspense>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
