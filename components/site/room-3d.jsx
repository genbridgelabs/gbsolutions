"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowUp, Compass, MousePointer2 } from "lucide-react";

/**
 * An immersive, first-person room built in WebGL from the project's own
 * photographs. There are no 3D scans in this project, so the room is a set the
 * photographs are hung in — honest about what it is, and still somewhere you
 * can walk around.
 */
export default function Room3D({ project }) {
  const mountRef = useRef(null);
  const apiRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [active, setActive] = useState(0);
  const [moved, setMoved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let disposed = false;
    let teardown = () => {};

    import("three")
      .then((THREE) => {
        if (disposed || !mountRef.current) return;
        teardown = createScene(THREE, mountRef.current, project, {
          onReady: () => setStatus("ready"),
          onActive: setActive,
          onMove: () => setMoved(true),
          onApi: (api) => {
            apiRef.current = api;
          },
        });
      })
      .catch((error) => {
        console.error("room: webgl unavailable", error?.message);
        setStatus("error");
      });

    return () => {
      disposed = true;
      apiRef.current = null;
      teardown();
    };
  }, [project]);

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") router.push(`/work/${project.slug}`);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, project.slug]);

  const photos =
    project.images.length > 0
      ? project.images.slice(0, 4)
      : [{ url: project.cover, alt: project.coverAlt, caption: "" }];
  const caption = photos[Math.min(active, photos.length - 1)];

  function hold(code, down) {
    apiRef.current?.setKey(code, down);
  }

  return (
    <div className="fixed inset-0 z-[70] bg-indigo-deep text-plaster">
      <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-4 p-4 sm:p-6">
          <Link
            href={`/work/${project.slug}`}
            className="pointer-events-auto inline-flex items-center gap-2.5 bg-indigo-deep/55 px-3.5 py-2.5 text-[0.76rem] text-plaster/85 backdrop-blur-sm transition-colors hover:text-brass-light"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.6} />
            {project.title}
          </Link>

          <p className="inline-flex items-center gap-2 bg-indigo-deep/45 px-3 py-2 text-[0.66rem] tracking-[0.02em] text-plaster/55 backdrop-blur-sm">
            <Compass className="size-3.5" strokeWidth={1.5} />
            3D room · {project.place}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4 p-4 sm:p-6">
          <div
            aria-live="polite"
            className="max-w-[19rem] bg-indigo-deep/55 px-4 py-3.5 backdrop-blur-sm sm:max-w-sm"
          >
            <p className="num text-[0.64rem] text-brass-light">
              Photograph {String(active + 1).padStart(2, "0")} /{" "}
              {String(photos.length).padStart(2, "0")}
            </p>
            <p
              key={caption.url + active}
              className="anim-fade mt-1.5 font-display text-[1.05rem] leading-snug text-plaster"
            >
              {caption.caption || caption.alt || project.title}
            </p>
            <p className="mt-1 text-[0.68rem] text-plaster/50">
              Walk closer to read the room
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <p
              className={`hidden items-center gap-2 text-[0.68rem] text-plaster/45 transition-opacity duration-700 sm:flex ${
                moved ? "opacity-0" : "opacity-100"
              }`}
            >
              <MousePointer2 className="size-3.5" strokeWidth={1.5} />
              Drag to look · W A S D to walk · Esc to leave
            </p>

            <div className="flex gap-2 sm:hidden">
              <button
                type="button"
                aria-label="Walk forward"
                onPointerDown={() => hold("KeyW", true)}
                onPointerUp={() => hold("KeyW", false)}
                onPointerLeave={() => hold("KeyW", false)}
                onPointerCancel={() => hold("KeyW", false)}
                className="pointer-events-auto flex size-12 items-center justify-center border border-plaster/30 bg-indigo-deep/50 text-plaster backdrop-blur-sm active:border-brass-light active:text-brass-light"
              >
                <ArrowUp className="size-4" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                aria-label="Walk backward"
                onPointerDown={() => hold("KeyS", true)}
                onPointerUp={() => hold("KeyS", false)}
                onPointerLeave={() => hold("KeyS", false)}
                onPointerCancel={() => hold("KeyS", false)}
                className="pointer-events-auto flex size-12 items-center justify-center border border-plaster/30 bg-indigo-deep/50 text-plaster backdrop-blur-sm active:border-brass-light active:text-brass-light"
              >
                <ArrowDown className="size-4" strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {status !== "ready" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-indigo-deep">
          {status === "error" ? (
            <div className="max-w-sm px-6 text-center">
              <p className="font-display text-[1.4rem] text-plaster">
                This device will not draw the room.
              </p>
              <p className="mt-2 text-[0.82rem] leading-relaxed text-plaster/55">
                WebGL is switched off or unavailable in this browser. The
                photographs and the project story are still on the project page.
              </p>
              <Link
                href={`/work/${project.slug}`}
                className="mt-6 inline-flex border border-plaster/30 px-4 py-2.5 text-[0.78rem] text-plaster transition-colors hover:border-brass-light hover:text-brass-light"
              >
                Back to {project.title}
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <span className="mx-auto block h-px w-16 origin-left animate-pulse bg-brass-light" />
              <p className="mt-5 text-[0.72rem] tracking-[0.02em] text-plaster/55">
                Hanging the photographs
              </p>
            </div>
          )}
        </div>
      ) : null}

      <p className="sr-only">
        An interactive 3D room of photographs from {project.title}. Use the arrow
        keys or W A S D to walk, drag to look around, and press Escape to leave.
        The same photographs are on the project page.
      </p>
    </div>
  );
}

function createScene(THREE, mount, project, callbacks) {
  const WIDTH = 12;
  const DEPTH = 9.5;
  const HEIGHT = 4.2;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // No filmic curve: the walls should be the exact plaster colour, not a
  // muddy brown after ACES crushes the highlights.
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.touchAction = "none";
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101725);
  scene.fog = new THREE.Fog(0x101725, 16, 34);

  const camera = new THREE.PerspectiveCamera(
    64,
    mount.clientWidth / Math.max(1, mount.clientHeight),
    0.1,
    60
  );
  camera.rotation.order = "YXZ";

  // Inward-facing planes, not a BackSide box: box normals point outwards and
  // leave the inner walls unlit, which reads as a brown cave.
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xdad2c1,
    roughness: 0.94,
    metalness: 0,
  });

  function addPlane(width, height, material, position, rotation) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    scene.add(mesh);
    return mesh;
  }

  addPlane(WIDTH, HEIGHT, wallMaterial, [0, HEIGHT / 2, -DEPTH / 2], [0, 0, 0]);
  addPlane(WIDTH, HEIGHT, wallMaterial, [0, HEIGHT / 2, DEPTH / 2], [0, Math.PI, 0]);
  addPlane(DEPTH, HEIGHT, wallMaterial, [-WIDTH / 2, HEIGHT / 2, 0], [0, Math.PI / 2, 0]);
  addPlane(DEPTH, HEIGHT, wallMaterial, [WIDTH / 2, HEIGHT / 2, 0], [0, -Math.PI / 2, 0]);

  addPlane(
    WIDTH,
    DEPTH,
    new THREE.MeshStandardMaterial({ color: 0x5b4f42, roughness: 0.8 }),
    [0, 0, 0],
    [-Math.PI / 2, 0, 0]
  );

  addPlane(
    WIDTH,
    DEPTH,
    new THREE.MeshBasicMaterial({ color: 0xe9e2d4 }),
    [0, HEIGHT, 0],
    [Math.PI / 2, 0, 0]
  );

  const rug = new THREE.Mesh(
    new THREE.PlaneGeometry(7.2, 4.4),
    new THREE.MeshStandardMaterial({ color: 0xa89a83, roughness: 0.95 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.02, 0.2);
  scene.add(rug);

  // Skirting grounds the walls; without it the plaster appears to float.
  const skirtingMaterial = new THREE.MeshStandardMaterial({
    color: 0x2b2620,
    roughness: 0.85,
  });
  const skirting = 0.16;
  const addSkirting = (width, position, rotationY) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, skirting, 0.035),
      skirtingMaterial
    );
    mesh.position.set(...position);
    mesh.rotation.y = rotationY;
    scene.add(mesh);
  };
  addSkirting(WIDTH, [0, skirting / 2, -DEPTH / 2 + 0.02], 0);
  addSkirting(WIDTH, [0, skirting / 2, DEPTH / 2 - 0.02], 0);
  addSkirting(DEPTH, [-WIDTH / 2 + 0.02, skirting / 2, 0], Math.PI / 2);
  addSkirting(DEPTH, [WIDTH / 2 - 0.02, skirting / 2, 0], Math.PI / 2);

  // Two ceiling coves: the only light sources you can see.
  const coveMaterial = new THREE.MeshBasicMaterial({ color: 0xfff1d9 });
  for (const x of [-2.6, 2.6]) {
    const cove = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.03, 6.4),
      new THREE.MeshBasicMaterial({ color: 0xf3e6cd })
    );
    cove.position.set(x, HEIGHT - 0.06, 0);
    scene.add(cove);
  }

  // A window on the right wall: emissive, so it reads as daylight without
  // another light source, and it gives the room a direction.
  addPlane(
    3.4,
    2.5,
    new THREE.MeshBasicMaterial({ color: 0xfff7e8 }),
    [WIDTH / 2 - 0.04, 2.2, 1.6],
    [0, -Math.PI / 2, 0]
  );

  const mullionMaterial = new THREE.MeshStandardMaterial({
    color: 0x2b2620,
    roughness: 0.9,
  });
  for (const z of [-0.05, 1.6, 3.25]) {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 2.5, 0.05),
      mullionMaterial
    );
    bar.position.set(WIDTH / 2 - 0.07, 2.2, z);
    scene.add(bar);
  }
  const transom = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.05, 3.4),
    mullionMaterial
  );
  transom.position.set(WIDTH / 2 - 0.07, 2.2, 1.6);
  scene.add(transom);

  // A low console under the prints: scale, and something at human height.
  const console3d = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.55, 0.44),
    new THREE.MeshStandardMaterial({ color: 0x3a2e26, roughness: 0.65 })
  );
  console3d.position.set(0, 0.275, -DEPTH / 2 + 0.34);
  scene.add(console3d);

  scene.add(new THREE.HemisphereLight(0xfbf4e6, 0x3a332a, 1.55));
  const key = new THREE.DirectionalLight(0xfff2e2, 0.95);
  key.position.set(2.5, 5.5, 3.5);
  scene.add(key);
  const fill = new THREE.PointLight(0xffe9cc, 7, 14, 2);
  fill.position.set(0, HEIGHT - 0.4, 1.6);
  scene.add(fill);

  const photos =
    project.images.length > 0
      ? project.images.slice(0, 4)
      : [{ url: project.cover, alt: project.coverAlt, caption: "" }];

  const loader = new THREE.TextureLoader();
  const brassMaterial = new THREE.MeshStandardMaterial({
    color: 0xa67c33,
    metalness: 0.72,
    roughness: 0.32,
  });

  const frames = [];
  const geometry = new THREE.PlaneGeometry(2.7, 1.8);
  const frameGeometry = new THREE.BoxGeometry(2.86, 1.96, 0.05);

  // Hung around a corner rather than in a line: two on the back wall and one
  // on each side wall, so walking turns up photographs instead of a strip.
  const layout = [
    { position: [-2.5, 1.98, -DEPTH / 2 + 0.06], yaw: 0 },
    { position: [2.5, 1.98, -DEPTH / 2 + 0.06], yaw: 0 },
    { position: [-WIDTH / 2 + 0.06, 1.98, -1.4], yaw: Math.PI / 2 },
    { position: [WIDTH / 2 - 0.06, 1.98, -2.1], yaw: -Math.PI / 2 },
  ];

  photos.forEach((photo, index) => {
    const texture = loader.load(photo.url);
    texture.colorSpace = THREE.SRGBColorSpace;

    const spot = layout[index % layout.length];
    const group = new THREE.Group();
    group.position.set(...spot.position);
    group.rotation.y = spot.yaw;

    const frame = new THREE.Mesh(frameGeometry, brassMaterial);
    frame.position.z = -0.02;
    group.add(frame);

    const print = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
    );
    print.position.z = 0.015;
    group.add(print);

    const light = new THREE.PointLight(0xffe8c4, 3.2, 4.6, 2);
    light.position.set(0, 1.35, 0.8);
    group.add(light);

    scene.add(group);

    frames.push({
      group,
      position: new THREE.Vector3(...spot.position),
      caption: photo.caption || photo.alt || project.title,
    });
  });

  // Dust in the projector light — the room should not look like a still.
  const dustCount = 240;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * WIDTH * 0.9;
    dustPositions[i * 3 + 1] = 0.4 + Math.random() * (HEIGHT - 1);
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * DEPTH * 0.9;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(dustPositions, 3)
  );
  const dust = new THREE.Points(
    dustGeometry,
    new THREE.PointsMaterial({
      color: 0xf3ead8,
      size: 0.022,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  scene.add(dust);

  const state = { x: 0.9, z: 2.1, yaw: 0.16, pitch: -0.02 };
  const keys = new Set();
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function setKey(code, down) {
    if (down) keys.add(code);
    else keys.delete(code);
    if (down) callbacks.onMove?.();
  }

  const canvas = renderer.domElement;

  function onPointerDown(event) {
    canvas.setPointerCapture?.(event.pointerId);
    canvas.dataset.dragging = "1";
    canvas.dataset.lastX = String(event.clientX);
    canvas.dataset.lastY = String(event.clientY);
  }

  function onPointerMove(event) {
    if (canvas.dataset.dragging !== "1") return;
    const lastX = Number(canvas.dataset.lastX || event.clientX);
    const lastY = Number(canvas.dataset.lastY || event.clientY);
    state.yaw -= (event.clientX - lastX) * 0.0026;
    state.pitch = clamp(state.pitch - (event.clientY - lastY) * 0.0018, -0.55, 0.5);
    canvas.dataset.lastX = String(event.clientX);
    canvas.dataset.lastY = String(event.clientY);
    callbacks.onMove?.();
  }

  function onPointerUp() {
    canvas.dataset.dragging = "";
  }

  const keyCodes = new Set([
    "KeyW",
    "KeyA",
    "KeyS",
    "KeyD",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
  ]);

  function onKeyDown(event) {
    if (keyCodes.has(event.code)) {
      event.preventDefault();
      setKey(event.code, true);
    }
  }

  function onKeyUp(event) {
    if (keyCodes.has(event.code)) setKey(event.code, false);
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  const resizeObserver = new ResizeObserver(() => {
    const width = mount.clientWidth;
    const height = Math.max(1, mount.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
  resizeObserver.observe(mount);

  const clock = new THREE.Clock();
  const forward = new THREE.Vector3();
  let frameId = 0;
  let ready = false;
  let activeIndex = -1;
  let captionClock = 0;

  function animate() {
    frameId = requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);

    const stride = 2.5 * delta;
    let ahead = 0;
    let side = 0;
    if (keys.has("KeyW") || keys.has("ArrowUp")) ahead += stride;
    if (keys.has("KeyS") || keys.has("ArrowDown")) ahead -= stride;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) side -= stride;
    if (keys.has("KeyD") || keys.has("ArrowRight")) side += stride;

    state.x += -Math.sin(state.yaw) * ahead + Math.cos(state.yaw) * side;
    state.z += -Math.cos(state.yaw) * ahead - Math.sin(state.yaw) * side;
    state.x = clamp(state.x, -WIDTH / 2 + 1.1, WIDTH / 2 - 1.1);
    state.z = clamp(state.z, -DEPTH / 2 + 1.1, DEPTH / 2 - 1.1);

    camera.position.set(state.x, 1.65, state.z);
    camera.rotation.y = state.yaw;
    camera.rotation.x = state.pitch;

    const dustPositionsNow = dustGeometry.attributes.position.array;
    for (let i = 0; i < dustCount; i++) {
      dustPositionsNow[i * 3 + 1] += delta * 0.055;
      if (dustPositionsNow[i * 3 + 1] > HEIGHT - 0.2) {
        dustPositionsNow[i * 3 + 1] = 0.3;
      }
    }
    dustGeometry.attributes.position.needsUpdate = true;

    captionClock += delta;
    if (captionClock > 0.2) {
      captionClock = 0;
      forward.set(0, 0, -1).applyEuler(camera.rotation);
      let best = -1;
      let bestDot = 0.8;
      frames.forEach((frame, index) => {
        const toFrame = frame.position
          .clone()
          .sub(camera.position)
          .normalize();
        const dot = toFrame.dot(forward);
        if (dot > bestDot) {
          bestDot = dot;
          best = index;
        }
      });
      if (best !== -1 && best !== activeIndex) {
        activeIndex = best;
        callbacks.onActive(best);
      }
    }

    renderer.render(scene, camera);

    if (!ready) {
      ready = true;
      callbacks.onReady();
    }
  }

  animate();
  callbacks.onApi({ setKey });

  return () => {
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);

    scene.traverse((node) => {
      if (node.geometry) node.geometry.dispose();
      const material = node.material;
      if (Array.isArray(material)) {
        material.forEach((entry) => {
          entry.map?.dispose();
          entry.dispose();
        });
      } else if (material) {
        material.map?.dispose();
        material.dispose();
      }
    });

    renderer.dispose();
    if (renderer.domElement.parentNode === mount) {
      mount.removeChild(renderer.domElement);
    }
  };
}
