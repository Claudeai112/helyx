/**
 * Module-scoped mutable scene state. GSAP timelines (running outside
 * the R3F Canvas) tween values here; useFrame hooks (running inside
 * the Canvas) read from it to update three.js objects.
 *
 * This avoids React re-renders for scroll updates and sidesteps R3F's
 * isolation from regular DOM effects.
 */
export const sceneState = {
  // shader uniforms
  distort: 0.8,
  tintR: 0.42,
  tintG: 0.36,
  tintB: 0.9,

  // mesh cross-fade opacities
  opIco: 1,
  opTorus: 0,
  opHelix: 0,
  opLattice: 0,
  opPrism: 0,
  opStar: 0,

  // mesh transform (GSAP controls; free-running X/Y rotation stays in useFrame)
  meshX: 0,
  meshY: -1.5,
  meshZ: -1.5,
  meshRotZ: 0,
  meshScale: 1.2,

  // camera
  camX: 0,
  camY: 0,
  camZ: 6,

  // fx
  bloomIntensity: 0.4,
};

export type SceneState = typeof sceneState;
