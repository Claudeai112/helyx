export const globalVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uDistort;

  vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
  vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m*m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vNormal = normal;
    vec3 pos = position;
    float n = snoise(pos * 0.9 + uTime * 0.22);
    float n2 = snoise(pos * 2.2 - uTime * 0.18);
    float mouseInfl = (uMouse.x + uMouse.y) * 0.15;
    float displace = (n * 0.38 + n2 * 0.12 + mouseInfl) * uDistort;
    vec3 newPos = pos + normal * displace;
    vPos = newPos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

export const globalFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uTint;
  uniform float uOpacity;

  void main() {
    // Time-driven variation on top of the section tint.
    float t = sin(vPos.x * 1.3 + vPos.y * 0.9 + uTime * 0.6) * 0.5 + 0.5;
    float t2 = sin(vPos.z * 1.1 - vPos.y * 0.7 + uTime * 0.45) * 0.5 + 0.5;

    vec3 base = uTint;
    vec3 col = mix(base * 0.7, base * 1.35, t);
    col = mix(col, base + vec3(0.05, 0.02, 0.08), smoothstep(0.3, 0.9, t2));

    // rim light
    float fres = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
    col += fres * (uTint * 0.6);

    // depth shade
    float depth = smoothstep(-2.0, 2.0, vPos.z);
    col *= 0.55 + depth * 0.45;

    // mouse glow
    float mouseGlow = length(uMouse) * 0.25;
    col += vec3(mouseGlow * 0.08, mouseGlow * 0.05, mouseGlow * 0.12);

    gl_FragColor = vec4(col, uOpacity);
  }
`;

/**
 * Nebula backdrop — 4-octave fbm + 2-iteration domain warping,
 * cursor-reactive UV offset, smooth 4-stop palette (deep purple →
 * brand purple → violet → cyan). Renders to a large plane that sits
 * far behind the refractive main mesh.
 */
export const nebulaVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const nebulaFragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uTint;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x)
         + (c - a) * u.y * (1.0 - u.x)
         + (d - b) * u.x * u.y;
  }
  // 4-octave fbm
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      v += amp * valueNoise(p);
      p *= 2.03;
      amp *= 0.5;
    }
    return v;
  }

  // smooth 4-stop palette (deepPurple → brandPurple → violet → cyan)
  vec3 palette(float t) {
    vec3 deepPurple  = vec3(0.102, 0.039, 0.243); // #1a0a3e
    vec3 brandPurple = vec3(0.423, 0.361, 0.906); // #6c5ce7
    vec3 violet      = vec3(0.654, 0.545, 0.980); // #a78bfa
    vec3 cyan        = vec3(0.000, 0.808, 0.788); // #00cec9

    t = clamp(t, 0.0, 1.0);
    // cosine-smoothed stops via smoothstep
    float s1 = smoothstep(0.00, 0.33, t);
    float s2 = smoothstep(0.33, 0.66, t);
    float s3 = smoothstep(0.66, 1.00, t);
    vec3 c01 = mix(deepPurple, brandPurple, s1);
    vec3 c12 = mix(c01, violet, s2);
    vec3 c23 = mix(c12, cyan, s3);
    return c23;
  }

  void main() {
    // center-remap UV so (0,0) is plane center
    vec2 uv = vUv - 0.5;
    uv.x *= 1.6; // widescreen aspect

    // cursor offsets + slow time drift
    uv += uMouse * 0.18;
    uv.x += uTime * 0.012;
    uv.y -= uTime * 0.008;

    // Domain warping — 2 iterations
    vec2 q = vec2(
      fbm(uv * 1.5 + uTime * 0.05),
      fbm(uv * 1.5 + vec2(3.1, 7.9) - uTime * 0.04)
    );
    vec2 r = vec2(
      fbm(uv * 1.8 + q * 2.4 + vec2(1.7, 9.2) + uTime * 0.03),
      fbm(uv * 1.8 + q * 2.4 + vec2(8.3, 2.8) + uTime * 0.02)
    );
    float f = fbm(uv * 1.2 + r * 1.8);

    // Palette drive
    float t = f * 1.4 - 0.15;
    vec3 col = palette(t);

    // subtle section-tint blend (lifts scene color toward current section)
    col = mix(col, col * (0.4 + uTint * 1.2), 0.35);

    // radial vignette within plane
    float d = length(uv);
    float vg = 1.0 - smoothstep(0.15, 0.95, d);
    col *= 0.35 + 0.65 * vg;

    // soft noise dithering to kill banding
    col += (hash(vUv * 1024.0) - 0.5) * 0.012;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export const lightVertexShader = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const lightFragmentShader = /* glsl */ `
  varying vec3 vPos;
  uniform float uTime;
  uniform vec3 uTint;
  uniform float uOpacity;
  void main() {
    float t = sin(vPos.x * 1.6 + vPos.y * 1.2 + uTime * 0.8) * 0.5 + 0.5;
    vec3 col = mix(uTint * 0.65, uTint * 1.3, t);
    gl_FragColor = vec4(col, uOpacity);
  }
`;
