/* ============================================================
   THE LACQUER BAR — Three.js centrepiece (vanilla)

   A film-set of glossy nail-polish bottles and mirror-chrome
   liquid blobs. Reflections come from a built-in RoomEnvironment
   (no HDR download needed). The whole set leans toward the mouse
   and every object gently bobs on a sine wave.
   ============================================================ */

import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export function initScene(canvas) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- renderer ---------- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();          // transparent — CSS gradient shows behind

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  /* ---------- reflections + lighting ---------- */
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new THREE.PointLight(0xd9ff3d, 60, 40);   // acid rim
  rim.position.set(-6, 3, 4);
  scene.add(rim);
  const fill = new THREE.PointLight(0xff5a7a, 30, 40);   // warm pink fill
  fill.position.set(5, -4, 2);
  scene.add(fill);

  /* ---------- material helpers ---------- */
  const lacquer = (color) =>
    new THREE.MeshPhysicalMaterial({
      color, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08,
      metalness: 0, envMapIntensity: 1.1,
    });
  const metal = (color, rough = 0.05) =>
    new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 1, envMapIntensity: 1.3 });

  /* ---------- a nail-polish bottle from primitives ---------- */
  function makeBottle(bodyColor, capColor) {
    const g = new THREE.Group();

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.66, 1.25, 48), lacquer(bodyColor));
    g.add(body);

    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.62, 40, 24), lacquer(bodyColor));
    shoulder.scale.set(1, 0.42, 1);
    shoulder.position.y = 0.62;
    g.add(shoulder);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.24, 24), metal(0xcfd2d6, 0.2));
    neck.position.y = 0.86;
    g.add(neck);

    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.9, 40), lacquer(capColor));
    cap.material.clearcoatRoughness = 0.05;
    cap.position.y = 1.44;
    g.add(cap);

    return g;
  }

  /* ---------- a mirror-chrome liquid blob ---------- */
  function makeBlob(radius, color) {
    return new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 4), metal(color, 0.04));
  }

  /* ---------- the floating set ---------- */
  const rig = new THREE.Group();
  scene.add(rig);

  const items = [];
  function place(obj, x, y, z, opts = {}) {
    obj.position.set(x, y, z);
    obj.rotation.set(opts.rx || 0, opts.ry || 0, opts.rz || 0);
    rig.add(obj);
    items.push({
      obj, baseY: y,
      amp: opts.amp ?? 0.28,
      speed: opts.speed ?? 1.1,
      phase: Math.random() * Math.PI * 2,
      spin: opts.spin ?? 0.15,
    });
  }

  place(makeBottle(0xd9ff3d, 0x16110f), 2.4, -0.4, 0.4, { rz: 0.14, spin: 0.2 });
  place(makeBottle(0xe9c4c0, 0x16110f), 3.8, 1.2, -0.9, { rz: -0.2, speed: 0.9, spin: -0.16 });
  place(makeBottle(0x8f172b, 0xf2ece0), 1.2, -1.9, 0.1, { rz: 0.28, speed: 1.3, spin: 0.24 });
  place(makeBlob(0.78, 0xf3f4f6), 3.2, -1.7, 0.6, { amp: 0.4, speed: 1.5, spin: 0.3 });
  place(makeBlob(0.5, 0xdfe3e8), 0.7, 1.8, -0.8, { amp: 0.5, speed: 1.8, spin: -0.4 });
  place(makeBlob(0.56, 0xd9ff3d), 4.4, -0.2, -1.3, { amp: 0.36, speed: 1.2, spin: 0.28 });

  /* ---------- pointer lean ---------- */
  const pointer = { x: 0, y: 0 };
  if (!reduceMotion) {
    window.addEventListener("pointermove", (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    });
  }

  /* ---------- sizing ---------- */
  function resize() {
    const w = canvas.clientWidth || canvas.parentElement.clientWidth;
    const h = canvas.clientHeight || canvas.parentElement.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // pull the camera back a touch on portrait / narrow screens so nothing clips awkwardly
    camera.position.z = camera.aspect < 1 ? 12 : 9;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  /* ---------- render loop, paused when off-screen ---------- */
  const clock = new THREE.Clock();
  let visible = true;
  let running = false;

  function frame() {
    if (!visible) { running = false; return; }
    running = true;
    const t = clock.getElapsedTime();

    for (const it of items) {
      it.obj.position.y = it.baseY + Math.sin(t * it.speed + it.phase) * it.amp;
      it.obj.rotation.y += it.spin * 0.01;
    }
    const tx = pointer.x * 0.4;
    const ty = -pointer.y * 0.25;
    rig.rotation.y += (tx - rig.rotation.y) * 0.05;
    rig.rotation.x += (ty - rig.rotation.x) * 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  function start() { if (!running) { clock.getDelta(); requestAnimationFrame(frame); } }

  if (reduceMotion) {
    // one static, well-composed frame — no animation
    renderer.render(scene, camera);
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible) start();
      },
      { threshold: 0.02 }
    );
    io.observe(canvas);
    start();
  }
}
