import * as THREE from 'three';

export const SIGNATURE_YELLOW = 0xe8b93f;

function bar(group, w, h, x, y, rotationZ = 0) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, 0.22, 2, 2, 2),
    new THREE.MeshStandardMaterial({
      color: SIGNATURE_YELLOW,
      metalness: 0.78,
      roughness: 0.24,
      emissive: 0x2a1a00,
      emissiveIntensity: 0.12
    })
  );
  mesh.position.set(x, y, 0);
  mesh.rotation.z = rotationZ;
  group.add(mesh);
  return mesh;
}

export function createFNSignature(world) {
  const root = new THREE.Group();
  root.name = 'farah-fn-signature';
  root.position.set(1.72, 1.70, -1.28);
  root.rotation.set(
    THREE.MathUtils.degToRad(-4),
    THREE.MathUtils.degToRad(-10),
    THREE.MathUtils.degToRad(-2)
  );

  const letters = new THREE.Group();

  // F
  bar(letters, 0.25, 1.55, -0.72, 0);
  bar(letters, 0.90, 0.24, -0.40, 0.66);
  bar(letters, 0.68, 0.22, -0.50, 0.08);

  // Slash
  const slash = bar(letters, 0.16, 1.78, 0.05, 0, THREE.MathUtils.degToRad(-19));
  slash.position.z = 0.05;

  // N
  bar(letters, 0.25, 1.55, 0.62, 0);
  bar(letters, 0.25, 1.55, 1.40, 0);
  bar(letters, 0.22, 1.72, 1.01, 0, THREE.MathUtils.degToRad(27));

  root.add(letters);

  const yellowRing = new THREE.MeshBasicMaterial({
    color: SIGNATURE_YELLOW,
    transparent: true,
    opacity: 0.52,
    depthWrite: false
  });
  const whiteRing = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.20,
    depthWrite: false
  });

  const orbitA = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.009, 8, 160), yellowRing);
  orbitA.scale.y = 0.52;
  orbitA.rotation.set(THREE.MathUtils.degToRad(65), THREE.MathUtils.degToRad(3), THREE.MathUtils.degToRad(-10));
  root.add(orbitA);

  const orbitB = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.007, 8, 160), whiteRing);
  orbitB.scale.y = 0.70;
  orbitB.rotation.set(THREE.MathUtils.degToRad(78), THREE.MathUtils.degToRad(24), THREE.MathUtils.degToRad(17));
  root.add(orbitB);

  const yellowOrb = new THREE.MeshStandardMaterial({
    color: SIGNATURE_YELLOW,
    metalness: 0.65,
    roughness: 0.22,
    emissive: 0x3b2400,
    emissiveIntensity: 0.20
  });
  const darkOrb = new THREE.MeshStandardMaterial({
    color: 0x171719,
    metalness: 0.86,
    roughness: 0.18
  });

  const orbA = new THREE.Mesh(new THREE.SphereGeometry(0.105, 24, 24), yellowOrb);
  const orbB = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 20), darkOrb);
  const orbC = new THREE.Mesh(new THREE.SphereGeometry(0.055, 18, 18), yellowOrb.clone());
  root.add(orbA, orbB, orbC);

  root.userData.signature = { letters, slash, orbitA, orbitB, orbA, orbB, orbC };
  world.add(root);
  return root;
}

export function animateFNSignature(signature, now, pointer) {
  if (!signature) return;
  const t = now * 0.001;
  const { letters, slash, orbitA, orbitB, orbA, orbB, orbC } = signature.userData.signature;

  signature.rotation.y = THREE.MathUtils.lerp(
    signature.rotation.y,
    THREE.MathUtils.degToRad(-10) + pointer.x * 0.10,
    0.035
  );
  signature.rotation.x = THREE.MathUtils.lerp(
    signature.rotation.x,
    THREE.MathUtils.degToRad(-4) - pointer.y * 0.06,
    0.035
  );
  signature.position.y = 1.70 + Math.sin(t * 0.42) * 0.025;
  letters.position.z = Math.sin(t * 0.35) * 0.018;
  slash.position.z = 0.05 + Math.sin(t * 0.72) * 0.025;
  orbitA.rotation.z = t * 0.055;
  orbitB.rotation.z = -t * 0.038;

  const a = t * 0.34;
  orbA.position.set(Math.cos(a) * 1.54, Math.sin(a) * 0.58, Math.sin(a * 0.7) * 0.12);
  const b = -t * 0.25 + 1.8;
  orbB.position.set(Math.cos(b) * 1.29, Math.sin(b) * 0.73, Math.cos(b * 0.8) * 0.16);
  const c = t * 0.18 + 3.4;
  orbC.position.set(Math.cos(c) * 1.05, Math.sin(c) * 0.48, Math.sin(c) * 0.22);
}
