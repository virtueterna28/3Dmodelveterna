import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

import { CameraPreset, EnvironmentPreset, ModelStats, RenderMode, ViewerSettings } from '../types.ts';
import {
  CAMERA_PRESETS,
  createAlternativeMaterials,
  createContactShadowTexture,
  createFrostParticles,
  createRunicDaisTexture,
  ENVIRONMENT_CONFIGS,
  isSoftwareGl,
} from '../utils/threeUtils.ts';
import { createProceduralKnight } from '../utils/proceduralKnight.ts';

// Pre-allocated math objects to ensure zero GC in animation loop
const _vec3 = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();

interface ThreeCanvasProps {
  settings: ViewerSettings;
  activeCameraPreset: CameraPreset;
  onCameraPresetChange?: (preset: CameraPreset) => void;
  onStatsReady: (stats: ModelStats) => void;
  onLoadProgress: (percent: number, status: string) => void;
  onLoadComplete: () => void;
  canvasRefCallback?: (exportFn: () => string) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  settings,
  activeCameraPreset,
  onStatsReady,
  onLoadProgress,
  onLoadComplete,
  canvasRefCallback,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // References to mutable scene components that do not require re-mounting
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const modelContainerRef = useRef<THREE.Group | null>(null);
  const heroModelRef = useRef<THREE.Object3D | null>(null);
  const pedestalRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<{ points: THREE.Points; update: (delta: number) => void } | null>(null);

  // Lighting refs
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Original material cache for PBR restoration
  const originalMaterialsRef = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());
  const altMaterialsRef = useRef<ReturnType<typeof createAlternativeMaterials> | null>(null);

  // Keep latest props in ref for render loop without re-triggering effects
  const latestSettingsRef = useRef(settings);
  latestSettingsRef.current = settings;
  const latestCameraPresetRef = useRef(activeCameraPreset);
  latestCameraPresetRef.current = activeCameraPreset;

  // Initialize Three.js scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const initialEnv = ENVIRONMENT_CONFIGS[latestSettingsRef.current.environment];
    scene.background = new THREE.Color(initialEnv.bgColor);
    scene.fog = new THREE.FogExp2(initialEnv.fogColor, 0.04);

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const initialCam = CAMERA_PRESETS[latestCameraPresetRef.current];
    camera.position.set(...initialCam.pos);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true, // for instant high-res screenshot capture
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.8;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // allow slightly below ground to view runes
    controls.target.set(...initialCam.target);
    controls.update();

    // 6. Lighting Rig
    const keyLight = new THREE.DirectionalLight(initialEnv.keyColor, 2.2);
    keyLight.position.set(3, 4, 3.5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 2048;
      keyLight.shadow.mapSize.height = 2048;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 12;
      keyLight.shadow.camera.left = -2;
      keyLight.shadow.camera.right = 2;
      keyLight.shadow.camera.top = 2.5;
      keyLight.shadow.camera.bottom = -0.5;
      keyLight.shadow.bias = -0.0003;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const hemiLight = new THREE.HemisphereLight(
      initialEnv.skyColor,
      initialEnv.groundColor,
      initialEnv.ambientIntensity
    );
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const rimLight = new THREE.DirectionalLight(initialEnv.rimColor, 2.5);
    rimLight.position.set(-3, 2.5, -3.5);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // 7. Grounding & Runic Pedestal Dais
    const pedestalGroup = new THREE.Group();
    pedestalGroup.name = 'PedestalGroup';

    // Soft contact shadow directly below hero
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.005;
    pedestalGroup.add(shadowMesh);

    // Stone cylinder dais
    const daisGeo = new THREE.CylinderGeometry(1.4, 1.5, 0.12, 48);
    const daisMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.85,
    });
    const daisMesh = new THREE.Mesh(daisGeo, daisMat);
    daisMesh.position.y = -0.06;
    daisMesh.receiveShadow = true;
    pedestalGroup.add(daisMesh);

    // Glowing runic circle top face
    const runeGeo = new THREE.CircleGeometry(1.38, 48);
    const runeMat = new THREE.MeshStandardMaterial({
      map: createRunicDaisTexture(renderer.capabilities.getMaxAnisotropy()),
      roughness: 0.25,
      metalness: 0.7,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const runeMesh = new THREE.Mesh(runeGeo, runeMat);
    runeMesh.rotation.x = -Math.PI / 2;
    runeMesh.position.y = 0.002;
    pedestalGroup.add(runeMesh);

    // Outer runic rim with emissive frost edge
    const outerRingGeo = new THREE.TorusGeometry(1.42, 0.03, 12, 48);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.1,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 2;
    outerRing.position.y = 0.003;
    pedestalGroup.add(outerRing);

    scene.add(pedestalGroup);
    pedestalRef.current = pedestalGroup;

    // 8. Atmospheric Floating Snow & Frost Particles
    const particles = createFrostParticles(280);
    scene.add(particles.points);
    particlesRef.current = particles;

    // 9. Hero Model Container
    const modelContainer = new THREE.Group();
    modelContainer.name = 'HeroModelContainer';
    scene.add(modelContainer);
    modelContainerRef.current = modelContainer;

    // 10. Prepare alternative materials
    altMaterialsRef.current = createAlternativeMaterials();

    // 11. Initial procedural fallback knight preview while loading
    const previewKnight = createProceduralKnight();
    previewKnight.name = 'ProceduralPreviewKnight';
    modelContainer.add(previewKnight);

    // 12. Load Real GLTF/GLB Model with MeshoptDecoder
    onLoadProgress(10, 'Initializing Meshopt 3D decoder...');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setMeshoptDecoder(MeshoptDecoder);

    const modelPath = '/models/armored_knight.glb';

    gltfLoader.load(
      modelPath,
      (gltf) => {
        onLoadProgress(90, 'Processing geometry & PBR shaders...');

        // Remove placeholder preview
        const placeholder = modelContainer.getObjectByName('ProceduralPreviewKnight');
        if (placeholder) {
          modelContainer.remove(placeholder);
        }

        const model = gltf.scene;
        heroModelRef.current = model;

        // Traverse to enable shadows, gather materials, and calculate geometry stats
        let totalVerts = 0;
        let totalTriangles = 0;
        let meshCount = 0;
        const matSet = new Set<string>();

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            meshCount++;
            mesh.castShadow = !isSoftwareGl;
            mesh.receiveShadow = true;

            // Cache original material
            originalMaterialsRef.current.set(mesh, mesh.material);

            if (mesh.geometry) {
              const geo = mesh.geometry;
              if (geo.attributes.position) {
                totalVerts += geo.attributes.position.count;
              }
              if (geo.index) {
                totalTriangles += geo.index.count / 3;
              } else if (geo.attributes.position) {
                totalTriangles += geo.attributes.position.count / 3;
              }
            }

            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => matSet.add(m.uuid));
            } else if (mesh.material) {
              matSet.add(mesh.material.uuid);
            }
          }
        });

        // Compute Bounding Box and scale/center precisely
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(_vec3);
        const center = box.getCenter(new THREE.Vector3());

        // Target height ~2.0 units to stand majestically on dais
        const targetHeight = 2.0;
        const scaleFactor = targetHeight / (size.y || 1);
        model.scale.setScalar(scaleFactor);

        // Center on X and Z, and place base of model exactly at Y = 0
        model.position.x = -center.x * scaleFactor;
        model.position.z = -center.z * scaleFactor;
        model.position.y = -box.min.y * scaleFactor;

        modelContainer.add(model);

        // Report stats to UI
        onStatsReady({
          vertices: totalVerts,
          triangles: Math.round(totalTriangles),
          meshes: meshCount,
          materials: matSet.size || 1,
          fileSize: '17.9 MB',
          id: '3baf7a5e-83b0-47ff-b0a5-40ccd8dde884',
          name: 'Maskot Burung Hantu Veterna',
          description: 'Winged armored knight in silver armor with blue cape and icy helm',
          author: 'abhiprayadamas2008 (Veterna)',
        });

        onLoadProgress(100, 'Model ready');
        onLoadComplete();
      },
      (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          const pct = Math.min(88, Math.round((xhr.loaded / xhr.total) * 90));
          onLoadProgress(pct, `Streaming PBR Model data (${(xhr.loaded / 1024 / 1024).toFixed(1)} MB)...`);
        } else {
          onLoadProgress(45, 'Streaming PBR Model data...');
        }
      },
      (error) => {
        console.warn('Could not load armored_knight.glb from disk, retaining procedural knight:', error);
        // Fallback: procedural knight stats
        onStatsReady({
          vertices: 4820,
          triangles: 2410,
          meshes: 12,
          materials: 5,
          fileSize: 'Procedural PBR',
          id: '3baf7a5e-83b0-47ff-b0a5-40ccd8dde884',
          name: 'Winged Armored Knight (Procedural Preview)',
          description: 'Winged armored knight in silver armor with blue cape and icy helm',
          author: 'abhiprayadamas2008',
        });
        onLoadComplete();
      }
    );

    // Provide screenshot exporter
    if (canvasRefCallback) {
      canvasRefCallback(() => {
        renderer.render(scene, camera);
        return renderer.domElement.toDataURL('image/png');
      });
    }

    // 13. Render Loop with Software-WebGL Guard & Damping
    const clock = new THREE.Clock();
    let frameId = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const currentSettings = latestSettingsRef.current;
      const currentPreset = latestCameraPresetRef.current;

      // Camera preset smooth transition
      const targetConfig = CAMERA_PRESETS[currentPreset];
      if (targetConfig) {
        _targetPos.set(...targetConfig.pos);
        _targetLook.set(...targetConfig.target);

        // Exponential damp camera position and controls target
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetPos.x, 3.5, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetPos.y, 3.5, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetPos.z, 3.5, delta);

        controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetLook.x, 3.5, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetLook.y, 3.5, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetLook.z, 3.5, delta);
      }

      controls.update();

      // Auto-rotation turntable
      if (currentSettings.autoRotate && modelContainerRef.current) {
        modelContainerRef.current.rotation.y += currentSettings.rotateSpeed * delta;
      }

      // Hero hover levitation (gentle mystical floating)
      if (currentSettings.hoverFloat && modelContainerRef.current) {
        const floatOffset = Math.sin(elapsed * 1.8) * 0.05;
        modelContainerRef.current.position.y = floatOffset;
      } else if (modelContainerRef.current) {
        modelContainerRef.current.position.y = THREE.MathUtils.damp(
          modelContainerRef.current.position.y,
          0,
          5,
          delta
        );
      }

      // Update atmospheric particles
      if (particlesRef.current && currentSettings.showParticles) {
        particlesRef.current.update(delta);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // 14. Responsive Resize Listener
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  // Update Environment / Lighting when preset changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const env = ENVIRONMENT_CONFIGS[settings.environment];
    scene.background = new THREE.Color(env.bgColor);
    if (scene.fog) {
      (scene.fog as THREE.FogExp2).color.set(env.fogColor);
    }

    if (keyLightRef.current) {
      keyLightRef.current.color.set(env.keyColor);
      keyLightRef.current.intensity = 2.2 * settings.lightIntensity;
    }
    if (hemiLightRef.current) {
      hemiLightRef.current.color.set(env.skyColor);
      hemiLightRef.current.groundColor.set(env.groundColor);
      hemiLightRef.current.intensity = env.ambientIntensity * settings.lightIntensity;
    }
    if (rimLightRef.current) {
      rimLightRef.current.color.set(env.rimColor);
      rimLightRef.current.intensity = 2.5 * settings.lightIntensity;
    }
  }, [settings.environment, settings.lightIntensity]);

  // Update Render Mode (PBR, Clay, Wireframe, Normals, Frost)
  useEffect(() => {
    const model = heroModelRef.current;
    const altMats = altMaterialsRef.current;
    if (!model || !altMats) return;

    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (settings.renderMode === 'pbr') {
          const orig = originalMaterialsRef.current.get(mesh);
          if (orig) {
            mesh.material = orig;
          }
        } else if (settings.renderMode === 'clay') {
          mesh.material = altMats.clay;
        } else if (settings.renderMode === 'wireframe') {
          mesh.material = altMats.wireframe;
        } else if (settings.renderMode === 'normals') {
          mesh.material = altMats.normals;
        } else if (settings.renderMode === 'frost') {
          mesh.material = altMats.frost;
        }
      }
    });
  }, [settings.renderMode]);

  // Toggle Pedestal visibility
  useEffect(() => {
    if (pedestalRef.current) {
      pedestalRef.current.visible = settings.showPedestal;
    }
  }, [settings.showPedestal]);

  // Toggle Particles visibility
  useEffect(() => {
    if (particlesRef.current) {
      particlesRef.current.points.visible = settings.showParticles;
    }
  }, [settings.showParticles]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
      style={{ touchAction: 'none' }}
    />
  );
};
