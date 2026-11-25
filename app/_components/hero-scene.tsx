"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const GOLD = new THREE.Color("#f4d9a0");
const AMBER = new THREE.Color("#c8792c");
const MOCHA = 0x584632;
const NIGHT = 0x261e16;

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/**
 * Two door leaves with light slits that form a cross (the church logo),
 * then swing ajar so light spills across the floor with drifting dust.
 */
export default function HeroScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL: the CSS gradient behind stays as the hero
    }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.domElement.style.opacity = "0";
    renderer.domElement.style.transition = "opacity 1.6s ease";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(NIGHT, 7, 17);
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
    const disposables: { dispose(): void }[] = [];
    const track = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

    // room
    const floor = new THREE.Mesh(
      track(new THREE.PlaneGeometry(40, 30)),
      track(new THREE.MeshStandardMaterial({ color: 0x3b2f22, roughness: 0.85 })),
    );
    floor.rotation.x = -Math.PI / 2;
    const wall = new THREE.Mesh(
      track(new THREE.PlaneGeometry(40, 14)),
      track(new THREE.MeshStandardMaterial({ color: 0x2f251b, roughness: 1 })),
    );
    wall.position.set(0, 7, -0.12);
    scene.add(floor, wall);

    // the light beyond the doorway
    const glowMat = track(new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0, toneMapped: false }));
    const glow = new THREE.Mesh(track(new THREE.PlaneGeometry(2.1, 3.25)), glowMat);
    glow.position.set(0, 1.62, -0.1);
    scene.add(glow);

    // frame
    const frameMat = track(new THREE.MeshStandardMaterial({ color: NIGHT, roughness: 0.7 }));
    const jamb = track(new THREE.BoxGeometry(0.14, 3.4, 0.3));
    const head = track(new THREE.BoxGeometry(2.42, 0.16, 0.3));
    for (const [g, x, y] of [[jamb, -1.13, 1.7], [jamb, 1.13, 1.7], [head, 0, 3.32]] as const) {
      const m = new THREE.Mesh(g, frameMat);
      m.position.set(x, y, 0);
      scene.add(m);
    }

    // one leaf, hinged at its local x=0; a slit near the free edge lets light through
    const doorMat = track(new THREE.MeshStandardMaterial({ color: MOCHA, roughness: 0.55, metalness: 0.08 }));
    const W = 0.985, T = 0.07, SLIT = 0.42;
    const box = (w: number, h: number, x: number, y: number, z = 0, d = T) => {
      const m = new THREE.Mesh(track(new THREE.BoxGeometry(w, h, d)), doorMat);
      m.position.set(x, y, z);
      return m;
    };
    const leaf = new THREE.Group();
    leaf.add(
      box(W, 2.05, W / 2, 1.025),
      box(W, 0.95, W / 2, 2.725),
      box(W - SLIT, 0.2, (W - SLIT) / 2, 2.15),
      box(W - 0.3, 1.5, W / 2, 1.05, T / 2 + 0.015, 0.03), // raised lower panel
    );
    const left = new THREE.Group();
    left.add(leaf);
    left.position.set(-1, 0, 0);
    const right = left.clone();
    right.position.x = 1;
    right.scale.x = -1;
    scene.add(left, right);

    // lights
    scene.add(new THREE.AmbientLight(0xf4d9a0, 0.12));
    const fill = new THREE.DirectionalLight(0xc8792c, 0.35);
    fill.position.set(3, 4, 8);
    const spill = new THREE.PointLight(0xf2c27e, 0, 10, 1.5);
    spill.position.set(0, 1.8, 0.5);
    scene.add(fill, spill);

    // floor light pool, widening away from the doorway
    const poolMat = track(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uOpen: { value: 0 }, uGold: { value: GOLD }, uAmber: { value: AMBER } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
        fragmentShader: `
          uniform float uOpen; uniform vec3 uGold; uniform vec3 uAmber; varying vec2 vUv;
          void main(){
            float d = 1. - vUv.y;                       // 0 at door, 1 near camera
            float x = abs(vUv.x - .5) * 8.;
            float half_ = mix(.35, 2.6, d) * uOpen;
            float a = smoothstep(half_, half_ * .35, x) * pow(1. - d, 1.7) * uOpen;
            gl_FragColor = vec4(mix(uGold, uAmber, d * .8) * a * .9, a);
          }`,
      }),
    );
    const pool = new THREE.Mesh(track(new THREE.PlaneGeometry(8, 8)), poolMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(0, 0.005, 4);
    scene.add(pool);

    // haze around the doorway
    const hazeMat = track(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uI: { value: 0 }, uC: { value: GOLD } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
        fragmentShader: `uniform float uI; uniform vec3 uC; varying vec2 vUv;
          void main(){ vec2 p = (vUv - .5) * vec2(1.6, 1.); float a = pow(max(0., 1. - length(p) * 2.), 2.2) * uI;
          gl_FragColor = vec4(uC * a, a); }`,
      }),
    );
    const haze = new THREE.Mesh(track(new THREE.PlaneGeometry(7, 6)), hazeMat);
    haze.position.set(0, 1.7, 0.4);
    scene.add(haze);

    // dust in the beam
    const N = 520;
    const pos = new Float32Array(N * 3);
    const seed = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos.set([(Math.random() - 0.5) * 3.6, Math.random() * 3.4, 0.3 + Math.random() * 4.8], i * 3);
      seed[i] = Math.random();
    }
    const dustGeo = track(new THREE.BufferGeometry());
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const dustMat = track(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uOpen: { value: 0 }, uPR: { value: renderer.getPixelRatio() }, uC: { value: GOLD } },
        vertexShader: `
          uniform float uTime; uniform float uOpen; uniform float uPR; attribute float aSeed; varying float vA;
          void main(){
            vec3 p = position;
            p.y = mod(p.y + uTime * .045 * (.4 + aSeed), 3.4);
            p.x += sin(uTime * .25 + aSeed * 20.) * .09;
            vec4 mv = modelViewMatrix * vec4(p, 1.);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (1.6 + aSeed * 3.2) * uPR * (6. / -mv.z);
            float beam = 1. - smoothstep(.15, 1. + p.z * .4, abs(p.x));
            vA = beam * uOpen * (.3 + .7 * abs(sin(uTime * .7 + aSeed * 30.)));
          }`,
        fragmentShader: `uniform vec3 uC; varying float vA;
          void main(){ float a = smoothstep(.5, 0., length(gl_PointCoord - .5)) * vA; gl_FragColor = vec4(uC * a, a); }`,
      }),
    );
    scene.add(new THREE.Points(dustGeo, dustMat));

    // camera framing + pointer parallax
    const look = new THREE.Vector3();
    let baseX = 0, px = 0, py = 0, tx = 0, ty = 0;
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      baseX = camera.aspect < 0.7 ? 0.9 : camera.aspect < 1 ? 0.55 : camera.aspect < 1.3 ? 0.25 : 0; // leave room for the vertical verse on narrow screens
      camera.position.z = camera.aspect < 0.7 ? 11.5 : camera.aspect < 1 ? 9 : 7.4;
      camera.updateProjectionMatrix();
      if (reduce) frame(10);
    };
    const onPointer = (e: PointerEvent) => {
      tx = (e.clientX / innerWidth - 0.5) * 2;
      ty = (e.clientY / innerHeight - 0.5) * 2;
    };

    const frame = (t: number) => {
      const crossIn = clamp01(t / 1.1);
      const open = ease(clamp01((t - 1.2) / 2.8));
      const ang = 0.5 * open + Math.sin(t * 0.6) * 0.012 * open;
      left.rotation.y = -ang;
      right.rotation.y = ang;
      glowMat.opacity = crossIn;
      spill.intensity = 1.2 * crossIn + 22 * open;
      poolMat.uniforms.uOpen.value = open;
      hazeMat.uniforms.uI.value = 0.12 * crossIn + 0.4 * open;
      dustMat.uniforms.uOpen.value = open;
      dustMat.uniforms.uTime.value = t;
      px += (tx - px) * 0.04;
      py += (ty - py) * 0.04;
      camera.position.x = baseX + px * 0.35;
      camera.position.y = 1.55 - py * 0.15;
      look.set(baseX * 0.6, 1.5, 0);
      camera.lookAt(look);
      renderer.render(scene, camera);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let raf = 0, visible = true;
    const t0 = performance.now();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (visible) frame((performance.now() - t0) / 1000);
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    if (reduce) frame(10);
    else {
      addEventListener("pointermove", onPointer, { passive: true });
      loop();
    }
    requestAnimationFrame(() => (renderer.domElement.style.opacity = "1"));

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onPointer);
      ro.disconnect();
      io.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} aria-hidden className="absolute inset-0" />;
}
