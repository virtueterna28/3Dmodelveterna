import * as THREE from 'three';

/**
 * Creates a high-fidelity procedural 3-12 part Winged Armored Knight
 * adhering to the Three.js skill guidelines.
 * Used for instant preview and rock-solid fallback.
 */
export function createProceduralKnight(): THREE.Group {
  const knightGroup = new THREE.Group();
  knightGroup.name = 'ProceduralWingedKnight';

  // Materials with varied roughness and metalness
  const silverArmorMat = new THREE.MeshStandardMaterial({
    color: 0xd4d8e2,
    metalness: 0.9,
    roughness: 0.18,
  });

  const darkSteelMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.85,
    roughness: 0.35,
  });

  const blueCapeMat = new THREE.MeshStandardMaterial({
    color: 0x1d4ed8, // Royal cobalt blue
    metalness: 0.05,
    roughness: 0.75,
    side: THREE.DoubleSide,
  });

  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.95,
    roughness: 0.2,
  });

  const icyVisorMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.6,
    metalness: 0.1,
    roughness: 0.08,
    transmission: 0.4,
    ior: 1.5,
  });

  // 1. Torso & Cuirass
  const torsoGroup = new THREE.Group();
  const cuirassGeo = new THREE.CylinderGeometry(0.36, 0.26, 0.75, 12);
  const cuirass = new THREE.Mesh(cuirassGeo, silverArmorMat);
  cuirass.position.y = 1.35;
  cuirass.scale.set(1, 1, 0.7);
  cuirass.castShadow = true;
  cuirass.receiveShadow = true;
  torsoGroup.add(cuirass);

  // Gorget / Neck guard
  const gorgetGeo = new THREE.TorusGeometry(0.2, 0.06, 8, 16);
  const gorget = new THREE.Mesh(gorgetGeo, goldTrimMat);
  gorget.rotation.x = Math.PI / 2;
  gorget.position.y = 1.72;
  torsoGroup.add(gorget);

  // 2. Helmet & Icy Visor
  const helmGroup = new THREE.Group();
  helmGroup.position.y = 1.95;

  const helmetGeo = new THREE.SphereGeometry(0.22, 16, 14);
  const helmet = new THREE.Mesh(helmetGeo, silverArmorMat);
  helmet.scale.set(0.9, 1.1, 0.95);
  helmGroup.add(helmet);

  // Slitted Icy Crest Visor
  const visorGeo = new THREE.BoxGeometry(0.26, 0.08, 0.12);
  const visor = new THREE.Mesh(visorGeo, icyVisorMat);
  visor.position.set(0, 0.02, 0.18);
  helmGroup.add(visor);

  // Helmet Glacial Horns / Crest
  const crestGeo = new THREE.ConeGeometry(0.06, 0.35, 6);
  const crestLeft = new THREE.Mesh(crestGeo, icyVisorMat);
  crestLeft.position.set(-0.16, 0.22, -0.04);
  crestLeft.rotation.z = 0.35;
  crestLeft.rotation.x = -0.2;
  helmGroup.add(crestLeft);

  const crestRight = new THREE.Mesh(crestGeo, icyVisorMat);
  crestRight.position.set(0.16, 0.22, -0.04);
  crestRight.rotation.z = -0.35;
  crestRight.rotation.x = -0.2;
  helmGroup.add(crestRight);

  knightGroup.add(helmGroup);
  knightGroup.add(torsoGroup);

  // 3. Pauldrons (Shoulder Plates)
  const pauldronGeo = new THREE.SphereGeometry(0.18, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.6);
  const pauldronLeft = new THREE.Mesh(pauldronGeo, silverArmorMat);
  pauldronLeft.position.set(-0.42, 1.62, 0);
  pauldronLeft.rotation.z = -0.35;
  knightGroup.add(pauldronLeft);

  const pauldronRight = new THREE.Mesh(pauldronGeo, silverArmorMat);
  pauldronRight.position.set(0.42, 1.62, 0);
  pauldronRight.rotation.z = 0.35;
  knightGroup.add(pauldronRight);

  // 4. Arms & Gauntlets
  const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.55, 8);
  const armLeft = new THREE.Mesh(armGeo, darkSteelMat);
  armLeft.position.set(-0.42, 1.25, 0.05);
  armLeft.rotation.z = -0.15;
  knightGroup.add(armLeft);

  const armRight = new THREE.Mesh(armGeo, darkSteelMat);
  armRight.position.set(0.42, 1.25, 0.05);
  armRight.rotation.z = 0.15;
  knightGroup.add(armRight);

  // 5. Wings (Silver & Glacial Wing Blades)
  const wingsGroup = new THREE.Group();
  wingsGroup.position.set(0, 1.5, -0.18);

  const createWing = (dir: number) => {
    const wing = new THREE.Group();
    for (let f = 0; f < 5; f++) {
      const featherGeo = new THREE.ConeGeometry(0.08 - f * 0.01, 0.75 - f * 0.08, 4);
      featherGeo.scale(0.3, 1, 0.1);
      const feather = new THREE.Mesh(featherGeo, f % 2 === 0 ? silverArmorMat : icyVisorMat);
      feather.position.set(dir * (0.2 + f * 0.15), 0.2 + f * 0.12, -f * 0.05);
      feather.rotation.z = dir * (-0.7 - f * 0.18);
      feather.rotation.y = dir * 0.2;
      wing.add(feather);
    }
    return wing;
  };

  wingsGroup.add(createWing(-1));
  wingsGroup.add(createWing(1));
  knightGroup.add(wingsGroup);

  // 6. Flowing Heraldic Blue Cape
  const capeShape = new THREE.Shape();
  capeShape.moveTo(-0.25, 0);
  capeShape.lineTo(0.25, 0);
  capeShape.lineTo(0.5, -1.35);
  capeShape.lineTo(-0.5, -1.35);
  capeShape.closePath();

  const capeGeo = new THREE.ShapeGeometry(capeShape);
  const cape = new THREE.Mesh(capeGeo, blueCapeMat);
  cape.position.set(0, 1.65, -0.2);
  cape.rotation.x = 0.12; // Slight flowing backward angle
  knightGroup.add(cape);

  // 7. Fauld, Tassets & Legs
  const tassetGeo = new THREE.ConeGeometry(0.32, 0.4, 8);
  const tassets = new THREE.Mesh(tassetGeo, silverArmorMat);
  tassets.position.y = 0.95;
  tassets.rotation.x = Math.PI;
  knightGroup.add(tassets);

  const legGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.8, 8);
  const legLeft = new THREE.Mesh(legGeo, silverArmorMat);
  legLeft.position.set(-0.18, 0.48, 0);
  knightGroup.add(legLeft);

  const legRight = new THREE.Mesh(legGeo, silverArmorMat);
  legRight.position.set(0.18, 0.48, 0);
  knightGroup.add(legRight);

  // Sabatons (Boots grounded flush on y=0)
  const bootGeo = new THREE.BoxGeometry(0.14, 0.1, 0.26);
  const bootLeft = new THREE.Mesh(bootGeo, darkSteelMat);
  bootLeft.position.set(-0.18, 0.05, 0.04);
  knightGroup.add(bootLeft);

  const bootRight = new THREE.Mesh(bootGeo, darkSteelMat);
  bootRight.position.set(0.18, 0.05, 0.04);
  knightGroup.add(bootRight);

  // 8. Glacial Runic Greatsword (planted or resting)
  const swordGroup = new THREE.Group();
  swordGroup.position.set(0.48, 0, 0.25);

  const bladeGeo = new THREE.BoxGeometry(0.08, 1.4, 0.02);
  const blade = new THREE.Mesh(bladeGeo, icyVisorMat);
  blade.position.y = 0.7;
  swordGroup.add(blade);

  const crossguardGeo = new THREE.BoxGeometry(0.32, 0.06, 0.06);
  const crossguard = new THREE.Mesh(crossguardGeo, goldTrimMat);
  crossguard.position.y = 1.35;
  swordGroup.add(crossguard);

  const hiltGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
  const hilt = new THREE.Mesh(hiltGeo, darkSteelMat);
  hilt.position.y = 1.52;
  swordGroup.add(hilt);

  const pommelGeo = new THREE.SphereGeometry(0.05, 8, 8);
  const pommel = new THREE.Mesh(pommelGeo, goldTrimMat);
  pommel.position.y = 1.7;
  swordGroup.add(pommel);

  knightGroup.add(swordGroup);

  return knightGroup;
}
