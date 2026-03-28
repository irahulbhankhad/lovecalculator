/**
 * background.js — Three.js 3D Background
 * Creates floating hearts, light particles, and bloom glow.
 * After questions: transforms into a tree with hearts scene.
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

let scene, camera, renderer, composer;
let hearts = [];
let particles;
let teddyGroup = null;
let treeGroup = null;
let sceneMode = 'ambient'; // 'ambient' or 'celebration'
let animationId;

/**
 * Heart shape geometry using Three.js Shape
 */
function createHeartShape(s = 1) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0, -0.3 * s, -0.5 * s, -0.8 * s, -1 * s, -0.8 * s);
  shape.bezierCurveTo(-1.5 * s, -0.8 * s, -2 * s, -0.3 * s, -2 * s, 0.2 * s);
  shape.bezierCurveTo(-2 * s, 1 * s, -0.5 * s, 1.8 * s, 0, 2.5 * s);
  shape.bezierCurveTo(0.5 * s, 1.8 * s, 2 * s, 1 * s, 2 * s, 0.2 * s);
  shape.bezierCurveTo(2 * s, -0.3 * s, 1.5 * s, -0.8 * s, 1 * s, -0.8 * s);
  shape.bezierCurveTo(0.5 * s, -0.8 * s, 0, -0.3 * s, 0, 0);
  return shape;
}

/**
 * Create a 3D heart mesh
 */
function createHeartMesh(size, color, opacity = 0.6) {
  const heartShape = createHeartShape(size);
  const geometry = new THREE.ExtrudeGeometry(heartShape, {
    depth: size * 0.4,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: size * 0.08,
    bevelThickness: size * 0.05,
  });
  geometry.center();

  const material = new THREE.MeshPhysicalMaterial({
    color,
    transparent: true,
    opacity,
    roughness: 0.3,
    metalness: 0.1,
    emissive: color,
    emissiveIntensity: 0.15,
    side: THREE.DoubleSide,
  });

  return new THREE.Mesh(geometry, material);
}

/**
 * Create floating particle field
 */
function createParticleField() {
  const count = 300;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const colorPalette = [
    new THREE.Color('#ff2d7b'),
    new THREE.Color('#a855f7'),
    new THREE.Color('#ff6b9d'),
    new THREE.Color('#e040fb'),
  ];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;

    const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = Math.random() * 3 + 1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  return new THREE.Points(geometry, material);
}

/**
 * Build the simple tree shape (trunk + leaf sphere)
 */
function createTree() {
  const group = new THREE.Group();

  // Trunk
  const trunkGeo = new THREE.CylinderGeometry(0.15, 0.25, 3, 8);
  const trunkMat = new THREE.MeshPhysicalMaterial({
    color: '#5d3a1a',
    roughness: 0.8,
  });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 0;
  group.add(trunk);

  // Canopy (layered spheres)
  const leafColors = ['#1b6e2b', '#228b22', '#2d8f3d'];
  const sizes = [1.6, 1.3, 0.9];
  const yPositions = [2, 2.8, 3.5];
  sizes.forEach((s, i) => {
    const geo = new THREE.SphereGeometry(s, 16, 16);
    const mat = new THREE.MeshPhysicalMaterial({
      color: leafColors[i],
      roughness: 0.7,
      transparent: true,
      opacity: 0.9,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = yPositions[i];
    group.add(mesh);
  });

  // Hearts on tree
  const heartPositions = [
    { x: 0.8, y: 2.5, z: 0.5 },
    { x: -0.7, y: 3, z: 0.4 },
    { x: 0.3, y: 3.8, z: 0.3 },
    { x: -0.4, y: 2.2, z: 0.8 },
    { x: 0.6, y: 3.3, z: -0.3 },
  ];
  heartPositions.forEach((pos) => {
    const heart = createHeartMesh(0.12, '#ff2d7b', 0.9);
    heart.position.set(pos.x, pos.y, pos.z);
    heart.rotation.z = Math.PI;
    heart.userData.floatOffset = Math.random() * Math.PI * 2;
    group.add(heart);
  });

  return group;
}

/**
 * Build the teddy bear (spheres)
 */
function createTeddy() {
  const group = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({
    color: '#8B6914',
    roughness: 0.9,
    metalness: 0,
  });

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), mat);
  group.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), mat);
  head.position.y = 0.9;
  group.add(head);

  // Ears
  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), mat);
    ear.position.set(side * 0.35, 1.25, 0);
    group.add(ear);
  });

  // Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: '#111' });
  [-1, 1].forEach((side) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), eyeMat);
    eye.position.set(side * 0.15, 0.95, 0.4);
    group.add(eye);
  });

  // Nose
  const noseMat = new THREE.MeshBasicMaterial({ color: '#333' });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), noseMat);
  nose.position.set(0, 0.82, 0.43);
  group.add(nose);

  // Arms
  [-1, 1].forEach((side) => {
    const arm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.12, 0.5, 8, 8),
      mat
    );
    arm.position.set(side * 0.65, 0.2, 0);
    arm.rotation.z = side * 0.8;
    group.add(arm);
  });

  // Heart held by teddy
  const heart = createHeartMesh(0.15, '#ff2d7b', 0.95);
  heart.position.set(0, 0.4, 0.55);
  heart.rotation.z = Math.PI;
  heart.scale.set(1, 1, 0.5);
  group.add(heart);

  return group;
}

/**
 * Initialize the Three.js scene
 */
export function initBackground() {
  const canvas = document.getElementById('canvas-bg');

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0f, 0.04);

  // Camera
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 12);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // Lights
  const ambientLight = new THREE.AmbientLight(0x332244, 0.8);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0xff2d7b, 1.5, 30);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xa855f7, 1, 30);
  pointLight2.position.set(-5, -3, 5);
  scene.add(pointLight2);

  // Floating hearts
  const heartColors = [0xff2d7b, 0xa855f7, 0xff6b9d, 0xe040fb, 0xff1744];
  for (let i = 0; i < 12; i++) {
    const size = 0.08 + Math.random() * 0.12;
    const color = heartColors[Math.floor(Math.random() * heartColors.length)];
    const heart = createHeartMesh(size, color, 0.3 + Math.random() * 0.3);
    heart.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 10 - 3
    );
    heart.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.PI + (Math.random() - 0.5) * 0.3
    );
    heart.userData.speed = 0.2 + Math.random() * 0.3;
    heart.userData.floatOffset = Math.random() * Math.PI * 2;
    heart.userData.rotSpeed = (Math.random() - 0.5) * 0.01;
    hearts.push(heart);
    scene.add(heart);
  }

  // Particle field
  particles = createParticleField();
  scene.add(particles);

  // Post-processing — bloom
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.8,  // strength
    0.5,  // radius
    0.7   // threshold
  );
  composer.addPass(bloomPass);

  // Resize handler
  window.addEventListener('resize', onResize);

  // Start animation
  animate();
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

const clock = new THREE.Clock();

function animate() {
  animationId = requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  // Rotate particle field
  if (particles) {
    particles.rotation.y = elapsed * 0.02;
    particles.rotation.x = Math.sin(elapsed * 0.01) * 0.1;
  }

  // Float hearts
  hearts.forEach((heart) => {
    heart.position.y +=
      Math.sin(elapsed * heart.userData.speed + heart.userData.floatOffset) *
      0.003;
    heart.rotation.y += heart.userData.rotSpeed;
    heart.rotation.x += heart.userData.rotSpeed * 0.5;
  });

  // Animate tree hearts if celebration mode
  if (sceneMode === 'celebration' && treeGroup) {
    treeGroup.rotation.y = Math.sin(elapsed * 0.3) * 0.1;
    treeGroup.children.forEach((child) => {
      if (child.userData.floatOffset !== undefined) {
        child.position.y +=
          Math.sin(elapsed * 1.5 + child.userData.floatOffset) * 0.001;
      }
    });
  }

  if (teddyGroup) {
    teddyGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.2;
  }

  // Gentle camera sway
  camera.position.x = Math.sin(elapsed * 0.15) * 0.5;
  camera.position.y = Math.cos(elapsed * 0.1) * 0.3;

  composer.render();
}

/**
 * Switch to celebration mode: show tree with hearts + teddy
 */
export function switchToCelebration() {
  sceneMode = 'celebration';

  // Fade out floating hearts
  hearts.forEach((heart) => {
    heart.material.opacity = 0;
    heart.visible = false;
  });

  // Add tree
  treeGroup = createTree();
  treeGroup.position.set(-2.5, -3, -2);
  treeGroup.scale.set(0.8, 0.8, 0.8);
  scene.add(treeGroup);

  // Add teddy
  teddyGroup = createTeddy();
  teddyGroup.position.set(2, -2.5, -1);
  teddyGroup.scale.set(0.9, 0.9, 0.9);
  scene.add(teddyGroup);

  // Add more point lights for celebration
  const celebLight = new THREE.PointLight(0xff2d7b, 2, 20);
  celebLight.position.set(0, 3, 5);
  scene.add(celebLight);
}

/**
 * Reset to ambient mode
 */
export function resetBackground() {
  sceneMode = 'ambient';

  if (treeGroup) {
    scene.remove(treeGroup);
    treeGroup = null;
  }
  if (teddyGroup) {
    scene.remove(teddyGroup);
    teddyGroup = null;
  }

  hearts.forEach((heart) => {
    heart.visible = true;
    heart.material.opacity = 0.3 + Math.random() * 0.3;
  });
}

export default { initBackground, switchToCelebration, resetBackground };
