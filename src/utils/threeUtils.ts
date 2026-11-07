import * as THREE from 'three';
import { CameraPreset, EnvironmentPreset } from '../types.ts';

/**
 * Detect software WebGL renderer (SwiftShader, llvmpipe, WARP, etc.)
 * Strictly based on GPU renderer string, not user agent.
 */
export const isSoftwareGl = (() => {
  if (typeof document === 'undefined') return true;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return true;
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
  const gpu = String(gl.getParameter(param));
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
})();

/**
 * Generate procedural soft radial contact shadow texture.
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  gradient.addColorStop(0.3, 'rgba(0, 5, 15, 0.5)');
  gradient.addColorStop(0.7, 'rgba(0, 8, 20, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Generate procedural runic dais pedestal texture with glowing icy glyphs.
 */
export function createRunicDaisTexture(anisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Dark obsidian stone base with radial gradient
  const bgGrad = ctx.createRadialGradient(512, 512, 80, 512, 512, 500);
  bgGrad.addColorStop(0, '#101726');
  bgGrad.addColorStop(0.6, '#0b0f19');
  bgGrad.addColorStop(1, '#05070d');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Concentric icy rings
  const center = 512;
  const rings = [140, 260, 360, 440, 480];

  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  rings.forEach((r) => {
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Secondary dashed rings
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 12]);
  ctx.strokeStyle = 'rgba(125, 211, 252, 0.5)';
  [200, 310, 410].forEach((r) => {
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // Runic radial ticks and glyphs
  const glyphCount = 32;
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 2;
  for (let i = 0; i < glyphCount; i++) {
    const angle = (i / glyphCount) * Math.PI * 2;
    const x1 = center + Math.cos(angle) * 360;
    const y1 = center + Math.sin(angle) * 360;
    const x2 = center + Math.cos(angle) * 440;
    const y2 = center + Math.sin(angle) * 440;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Small chevron rune markings
    if (i % 2 === 0) {
      const rx = center + Math.cos(angle) * 400;
      const ry = center + Math.sin(angle) * 400;
      ctx.beginPath();
      ctx.arc(rx, ry, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(186, 230, 253, 0.6)';
      ctx.fill();
    }
  }

  // Central compass star
  ctx.save();
  ctx.translate(center, center);
  for (let s = 0; s < 8; s++) {
    ctx.rotate((Math.PI * 2) / 8);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(8, 70);
    ctx.lineTo(0, 110);
    ctx.lineTo(-8, 70);
    ctx.closePath();
    ctx.fillStyle = s % 2 === 0 ? 'rgba(56, 189, 248, 0.7)' : 'rgba(14, 165, 233, 0.35)';
    ctx.fill();
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  return texture;
}

/**
 * Create procedural floating frost particles (snow crystals / glacial motes).
 */
export function createFrostParticles(count = 250): {
  points: THREE.Points;
  update: (delta: number) => void;
} {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 5.0;
    positions[i3 + 1] = Math.random() * 4.0;
    positions[i3 + 2] = (Math.random() - 0.5) * 5.0;

    velocities[i3] = (Math.random() - 0.5) * 0.15;
    velocities[i3 + 1] = 0.1 + Math.random() * 0.25; // Gentle upward drift
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.15;

    scales[i] = 0.5 + Math.random() * 1.5;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  // Procedural snowflake / soft frost particle texture
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 64;
  pCanvas.height = 64;
  const pCtx = pCanvas.getContext('2d')!;
  const pGrad = pCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
  pGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  pGrad.addColorStop(0.3, 'rgba(125, 211, 252, 0.8)');
  pGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.3)');
  pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  pCtx.fillStyle = pGrad;
  pCtx.fillRect(0, 0, 64, 64);

  const particleTexture = new THREE.CanvasTexture(pCanvas);
  particleTexture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.PointsMaterial({
    size: 0.09,
    map: particleTexture,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);

  const update = (delta: number) => {
    const pos = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] += velocities[i3] * delta;
      pos[i3 + 1] += velocities[i3 + 1] * delta;
      pos[i3 + 2] += velocities[i3 + 2] * delta;

      // Wrap around bounds
      if (pos[i3 + 1] > 4.2) {
        pos[i3 + 1] = 0.05;
        pos[i3] = (Math.random() - 0.5) * 4.5;
        pos[i3 + 2] = (Math.random() - 0.5) * 4.5;
      }
    }
    geometry.attributes.position.needsUpdate = true;
  };

  return { points, update };
}

/**
 * Materials for inspection modes:
 * - Clay sculpt: Studio grey PBR material for topology appreciation
 * - Wireframe: Clean tactical lines
 * - Normals: Diagnostic normal vector visualization
 * - Frost: Glacial crystalline shader with Fresnel rim glow
 */
export function createAlternativeMaterials(): {
  clay: THREE.MeshStandardMaterial;
  wireframe: THREE.MeshBasicMaterial;
  normals: THREE.MeshNormalMaterial;
  frost: THREE.MeshPhysicalMaterial;
} {
  const clay = new THREE.MeshStandardMaterial({
    color: 0x94a3b8, // Slate gray clay
    roughness: 0.65,
    metalness: 0.08,
  });

  const wireframe = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
  });

  const normals = new THREE.MeshNormalMaterial({
    wireframe: false,
  });

  const frost = new THREE.MeshPhysicalMaterial({
    color: 0x93c5fd,
    emissive: 0x0284c7,
    emissiveIntensity: 0.25,
    roughness: 0.15,
    metalness: 0.2,
    transmission: 0.35,
    ior: 1.45,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
  });

  return { clay, wireframe, normals, frost };
}

/**
 * Camera preset positions and target points tailored to the knight's anatomy.
 */
export const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  front: {
    pos: [0, 1.4, 3.2],
    target: [0, 1.1, 0],
  },
  helm: {
    pos: [0, 1.75, 1.25],
    target: [0, 1.65, 0],
  },
  wings: {
    pos: [0, 1.5, -2.8],
    target: [0, 1.2, 0],
  },
  hero: {
    pos: [1.6, 0.4, 2.2],
    target: [0, 1.3, 0],
  },
  top: {
    pos: [0, 3.6, 1.0],
    target: [0, 0.9, 0],
  },
};

/**
 * Lighting presets for different thematic atmospheres.
 */
export const ENVIRONMENT_CONFIGS: Record<
  EnvironmentPreset,
  {
    name: string;
    keyColor: number;
    skyColor: number;
    groundColor: number;
    rimColor: number;
    bgColor: string;
    fogColor: number;
    ambientIntensity: number;
  }
> = {
  citadel: {
    name: 'Frost Citadel',
    keyColor: 0xe0f2fe, // Cool icy silver
    skyColor: 0x38bdf8, // Glacial cyan
    groundColor: 0x0c1322,
    rimColor: 0x0284c7, // Vivid cyan rim
    bgColor: '#070a12',
    fogColor: 0x070a12,
    ambientIntensity: 0.7,
  },
  throne: {
    name: 'Royal Hall',
    keyColor: 0xfef08a, // Warm royal gold
    skyColor: 0xfbbf24,
    groundColor: 0x1f1610,
    rimColor: 0x60a5fa, // Blue mantle contrast rim
    bgColor: '#0f0c08',
    fogColor: 0x0f0c08,
    ambientIntensity: 0.75,
  },
  studio: {
    name: 'Clean Studio',
    keyColor: 0xffffff,
    skyColor: 0xdbeafe,
    groundColor: 0x1e293b,
    rimColor: 0x94a3b8,
    bgColor: '#0f172a',
    fogColor: 0x0f172a,
    ambientIntensity: 0.9,
  },
  abyss: {
    name: 'Abyssal Noir',
    keyColor: 0x38bdf8,
    skyColor: 0x1e1b4b,
    groundColor: 0x030712,
    rimColor: 0x67e8f9,
    bgColor: '#030508',
    fogColor: 0x030508,
    ambientIntensity: 0.45,
  },
};
