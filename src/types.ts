export type RenderMode = 'pbr' | 'clay' | 'wireframe' | 'normals' | 'frost';

export type EnvironmentPreset = 'citadel' | 'throne' | 'studio' | 'abyss';

export type CameraPreset = 'front' | 'helm' | 'wings' | 'hero' | 'top';

export interface ModelStats {
  vertices: number;
  triangles: number;
  meshes: number;
  materials: number;
  fileSize: string;
  id: string;
  name: string;
  description: string;
  author: string;
}

export interface ViewerSettings {
  renderMode: RenderMode;
  environment: EnvironmentPreset;
  autoRotate: boolean;
  rotateSpeed: number;
  hoverFloat: boolean;
  showPedestal: boolean;
  showParticles: boolean;
  wireframeColor: string;
  lightIntensity: number;
  soundEnabled: boolean;
}
