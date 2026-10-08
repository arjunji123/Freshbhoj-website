"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Floating 3D shapes behind the hero. Decorative only — pointer-events none, paused when off-screen / reduced motion. */
export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return; // no WebGL (old device / blocked) — hero simply renders without the 3D layer
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 14;

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 6, 8);
    scene.add(key);
    const rim = new THREE.PointLight(0xffc21a, 40, 40);
    rim.position.set(-6, -3, 4);
    scene.add(rim);

    const mat = (color: number, opts: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
      new THREE.MeshPhysicalMaterial({ color, roughness: 0.25, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.15, ...opts });

    const defs: { geo: THREE.BufferGeometry; m: THREE.Material; pos: [number, number, number]; s: number; speed: number }[] = [
      { geo: new THREE.TorusGeometry(1, 0.38, 24, 64), m: mat(0xffc21a), pos: [-7.2, 3.2, -1], s: 1.1, speed: 0.6 },
      { geo: new THREE.SphereGeometry(1, 40, 40), m: mat(0xffffff, { transmission: 0.2, opacity: 0.95, transparent: true }), pos: [6.8, 4.2, -2], s: 0.9, speed: 0.8 },
      { geo: new THREE.IcosahedronGeometry(1, 0), m: mat(0x7ff0dc), pos: [-8.5, -3.2, -2], s: 1.0, speed: 0.5 },
      { geo: new THREE.TorusKnotGeometry(0.8, 0.26, 100, 16), m: mat(0xffffff, { opacity: 0.9, transparent: true }), pos: [8.2, -3.6, -1], s: 0.9, speed: 0.7 },
      { geo: new THREE.OctahedronGeometry(1, 0), m: mat(0xffc21a), pos: [0.5, 5.8, -4], s: 0.6, speed: 0.9 },
      { geo: new THREE.SphereGeometry(1, 32, 32), m: mat(0x7ff0dc), pos: [-3.2, -5.2, -3], s: 0.55, speed: 0.6 },
    ];
    const meshes = defs.map((d) => {
      const mesh = new THREE.Mesh(d.geo, d.m);
      mesh.position.set(...d.pos);
      mesh.scale.setScalar(d.s);
      scene.add(mesh);
      return { mesh, base: d.pos, speed: d.speed };
    });

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const narrow = w < 768;
      meshes.forEach((m, i) => (m.mesh.visible = !narrow || i < 3));
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(mount);
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();
      meshes.forEach(({ mesh, base, speed }, i) => {
        mesh.rotation.x = t * 0.25 * speed + i;
        mesh.rotation.y = t * 0.35 * speed;
        mesh.position.y = base[1] + Math.sin(t * speed + i) * 0.35;
        mesh.position.x = base[0] + mouse.x * 0.5 * (i % 2 ? 1 : -1);
      });
      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 0.4 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    if (reduced) {
      renderer.render(scene, camera);
    } else {
      tick();
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      defs.forEach((d) => { d.geo.dispose(); d.m.dispose(); });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} aria-hidden className="pointer-events-none absolute inset-0 z-0 [&>canvas]:w-full [&>canvas]:h-full" />;
}
