/**
 * GPU wind.
 *
 * The previous forest gave every tree its own `useFrame` callback and its own
 * sine wave, which meant 32 CPU callbacks a frame and trees that swayed out of
 * sympathy with each other — no gust ever crossed the treeline.
 *
 * This moves the whole thing into the vertex shader. Each instance derives its
 * phase from its own world position, so a gust is a wave travelling across x/z
 * rather than every tree wobbling independently. Cost on the CPU is one uniform
 * write per frame, no matter how many trees there are.
 */
import * as THREE from 'three';

/** Shared clock for every wind material, so the whole forest agrees on time. */
export const windUniforms = {
  uTime: { value: 0 },
  /** 0 = dead still, 1 = full strength. Dropped for reduced motion. */
  uWind: { value: 1 },
};

const WIND_CHUNK = /* glsl */ `
  uniform float uTime;
  uniform float uWind;

  // Three overlapping frequencies: a slow base sway, a faster leaf-level
  // ripple, and a very slow envelope that swells and dies away as a gust.
  vec2 windOffset(vec3 worldPos, float amount) {
    float phase = worldPos.x * 0.14 + worldPos.z * 0.11;
    float base   = sin(uTime * 0.34 + phase) * 0.55;
    float ripple = sin(uTime * 1.55 + phase * 2.3) * 0.16;
    float gust   = sin(uTime * 0.11 + phase * 0.35) * sin(uTime * 0.07);
    float sway   = (base + ripple + gust * 0.9) * amount * uWind;
    return vec2(sway, sway * 0.42);
  }
`;

/**
 * Patches a standard material so instances bend in the wind.
 *
 * @param swayAmount how far this layer travels. Scale it with the layer's
 *   height up the tree — a trunk barely moves, the top cone moves most.
 */
export function applyWind(material: THREE.Material, swayAmount: number) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = windUniforms.uTime;
    shader.uniforms.uWind = windUniforms.uWind;

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${WIND_CHUNK}`)
      .replace(
        '#include <begin_vertex>',
        /* glsl */ `
        #include <begin_vertex>
        // Column 3 of the instance matrix is the instance's translation, which
        // is what makes the gust coherent across the treeline rather than local.
        vec3 iPos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
        vec2 sway = windOffset(iPos, ${swayAmount.toFixed(3)});
        transformed.x += sway.x;
        transformed.z += sway.y;
        `
      );
  };
  // Materials with different injected constants must not share a program.
  material.customProgramCacheKey = () => `wind-${swayAmount.toFixed(3)}`;
  return material;
}
