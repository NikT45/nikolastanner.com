"use client";

import {
  Canvas,
  useFrame,
  useLoader,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import BadgePhotoView, { type Quad } from "./BadgePhotoView";
import * as THREE from "three";

/* The real badge that lived on my monitor, pinned through its slot as a
   small 3D scene. It swings about the pin with pendulum physics, idles with
   a faint sway, and can be grabbed and flung. Reduced motion keeps the drag
   but drops the idle. */

const IMAGE_ASPECT = 1226 / 1283; // height / width of guest-badge.webp
const BADGE_W = 1.75;
const BADGE_H = BADGE_W * IMAGE_ASPECT;
const SLOT_FROM_TOP = 0.13 * BADGE_H; // the slot in the artwork sits ~13% down
const MAX_SWING = 1.25; // radians either side

function Badge({
  reduced,
  shadowOpacity,
  scale,
  hidden,
  onTap,
}: {
  reduced: boolean;
  shadowOpacity: number;
  scale: number;
  /* true while the photo view owns the badge */
  hidden: boolean;
  /* a click without a drag: receives the badge's projected quad in viewport px */
  onTap: (quad: Quad) => void;
}) {
  const texture = useLoader(THREE.TextureLoader, "/guest-badge.webp");
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const pivot = useRef<THREE.Group>(null);
  const card = useRef<THREE.Mesh>(null);
  const { viewport, camera, gl } = useThree();
  /* pin at the canvas centre so a full loop over the top still fits */
  const anchorY = 0;
  /* the pin goes through the slot, so the pivot-to-centre arm is short */
  const armLen = BADGE_H / 2 - SLOT_FROM_TOP;

  const s = useRef({
    theta: 0, // swing in the plane of the screen
    omega: 0,
    twist: 0, // slow turn around the lanyard
    twistV: 0,
    t: 0,
    dragging: false,
    lastTheta: 0,
    lastTime: 0,
    downX: 0,
    downY: 0,
    downT: 0,
  });

  /* The card's four corners projected to viewport pixels, so the 2D copy
     can start exactly where the 3D badge is drawn, tilt included. */
  const projectedQuad = (): Quad => {
    const m = card.current!;
    const rect = gl.domElement.getBoundingClientRect();
    const corners = [
      [-BADGE_W / 2, BADGE_H / 2],
      [BADGE_W / 2, BADGE_H / 2],
      [BADGE_W / 2, -BADGE_H / 2],
      [-BADGE_W / 2, -BADGE_H / 2],
    ];
    return corners.map(([x, y]) => {
      const v = m.localToWorld(new THREE.Vector3(x, y, 0)).project(camera);
      return [
        rect.left + ((v.x + 1) / 2) * rect.width,
        rect.top + ((1 - v.y) / 2) * rect.height,
      ];
    }) as Quad;
  };

  useFrame((_, rawDt) => {
    const st = s.current;
    const dt = Math.min(Math.max(rawDt, 0), 1 / 30);
    st.t += dt;
    if (!st.dragging) {
      const g = 9.81;
      const rest = reduced ? 0 : 0.035 * Math.sin(st.t * 0.7); // idle sway target
      st.omega +=
        (-(g / armLen) * Math.sin(st.theta - rest) - 1.1 * st.omega) * dt;
      st.theta += st.omega * dt;
      /* a little twist follows the swing velocity and relaxes */
      const twistTarget = THREE.MathUtils.clamp(st.omega * 0.22, -0.6, 0.6);
      st.twistV += ((twistTarget - st.twist) * 18 - 4 * st.twistV) * dt;
      st.twist += st.twistV * dt;
    }
    if (pivot.current) {
      pivot.current.rotation.z = st.theta;
      pivot.current.rotation.y = st.twist;
    }
  });

  /* The canvas is a large square over the page, so it must stay scrollable
     on touch. Only a touch that lands on the card should start a drag:
     pointerdown fires before touchstart for the same finger, so by the time
     touchstart arrives `dragging` says whether the card was hit, and only
     then is the browser's scroll gesture cancelled. */
  useEffect(() => {
    const el = gl.domElement;
    const block = (e: TouchEvent) => {
      if (s.current.dragging) e.preventDefault();
    };
    el.addEventListener("touchstart", block, { passive: false });
    return () => el.removeEventListener("touchstart", block);
  }, [gl]);

  /* Pointer position → swing angle. The badge centre sits at (armLen·sinθ,
     -armLen·cosθ) below the pivot, so θ = atan2(x, -y) of the pointer
     relative to the pivot. */
  const angleFromPointer = (e: ThreeEvent<PointerEvent>) => {
    const x = (e.pointer.x * viewport.width) / 2;
    const y = (e.pointer.y * viewport.height) / 2 - anchorY;
    return THREE.MathUtils.clamp(Math.atan2(x, -y), -MAX_SWING, MAX_SWING);
  };

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    const st = s.current;
    st.dragging = true;
    st.omega = 0;
    st.lastTheta = st.theta;
    st.lastTime = performance.now();
    st.downX = e.clientX;
    st.downY = e.clientY;
    st.downT = st.lastTime;
    document.body.style.cursor = "grabbing";
  };
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    const st = s.current;
    if (!st.dragging) return;
    const now = performance.now();
    const theta = angleFromPointer(e);
    const dt = Math.max((now - st.lastTime) / 1000, 1 / 240);
    st.omega = THREE.MathUtils.clamp((theta - st.lastTheta) / dt, -12, 12);
    st.theta = theta;
    st.lastTheta = theta;
    st.lastTime = now;
  };
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    const st = s.current;
    if (!st.dragging) return;
    st.dragging = false;
    (e.target as Element).releasePointerCapture(e.pointerId);
    document.body.style.cursor = "";
    /* a short press with no travel is a tap: open the photo view */
    const moved = Math.hypot(e.clientX - st.downX, e.clientY - st.downY);
    if (moved < 6 && performance.now() - st.downT < 350) {
      st.omega = 0;
      onTap(projectedQuad());
      return;
    }
    /* a fling that is too slow still gets a nudge so it never feels dead */
    if (Math.abs(st.omega) < 0.3) st.omega += Math.sign(st.theta || 1) * -0.3;
  };

  return (
    <group position={[0, anchorY, 0]} scale={scale} visible={!hidden}>
      {/* invisible "page" behind the badge that only shows the shadow it
          casts, so the card reads as floating above the page */}
      <mesh position={[0, 0, -0.18]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <shadowMaterial
          transparent
          depthWrite={false}
          opacity={shadowOpacity}
        />
      </mesh>
      {/* pin through the slot, in front of the card */}
      <mesh position={[0, 0, 0.03]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color="#6f7c86"
          metalness={0.6}
          roughness={0.35}
        />
      </mesh>
      <group ref={pivot}>
        {/* badge: textured front, plain card back so it reads as a real card */}
        <group position={[0, -(BADGE_H / 2 - SLOT_FROM_TOP), 0]}>
          <mesh
            ref={card}
            castShadow
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onPointerOver={() => {
              if (!s.current.dragging) document.body.style.cursor = "grab";
            }}
            onPointerOut={() => {
              if (!s.current.dragging) document.body.style.cursor = "";
            }}
          >
            <planeGeometry args={[BADGE_W, BADGE_H]} />
            <meshStandardMaterial
              map={texture}
              transparent
              alphaTest={0.02}
              roughness={0.85}
            />
          </mesh>
          <mesh castShadow position={[0, 0, -0.004]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[BADGE_W * 0.955, BADGE_H * 0.955]} />
            <meshStandardMaterial color="#e6dfd0" roughness={0.95} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* `scale` enlarges the whole scene; keep the swing radius (~1.7 units ×
   scale) inside half the canvas height (viewport is ~4.9 units tall). */
export default function HangingBadge({
  className,
  scale = 1,
}: {
  className?: string;
  scale?: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [dark, setDark] = useState(false);
  const [view, setView] = useState<Quad | null>(null);
  const closeView = useCallback(() => setView(null), []);

  /* Only run the render loop while the badge is on screen. */
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    /* shadow strength follows the theme attribute set by ThemeToggle */
    const root = document.documentElement;
    const readTheme = () => setDark(root.getAttribute("data-theme") === "dark");
    readTheme();
    const mo = new MutationObserver(readTheme);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div
      ref={host}
      className={className}
      aria-label="my old google guest badge, hanging. click it to see where it lived"
      role="img"
    >
      <Canvas
        shadows="variance"
        dpr={[1, 2]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 8.6], fov: 32 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        /* pan-y keeps page scrolling alive over the empty parts of the
           canvas; touches on the card itself are cancelled in Badge */
        style={{ background: "transparent", touchAction: "pan-y" }}
      >
        <ambientLight intensity={1.15} />
        <directionalLight
          position={[1.2, 2.6, 5.5]}
          intensity={1.1}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-radius={18}
          shadow-blurSamples={24}
          shadow-bias={-0.0008}
          shadow-camera-near={0.5}
          shadow-camera-far={12}
          shadow-camera-left={-3.5}
          shadow-camera-right={3.5}
          shadow-camera-top={3.5}
          shadow-camera-bottom={-3.5}
        />
        <Suspense fallback={null}>
          <Badge
            reduced={reduced}
            shadowOpacity={dark ? 0.42 : 0.18}
            scale={scale}
            hidden={view !== null}
            onTap={setView}
          />
        </Suspense>
      </Canvas>
      {view && <BadgePhotoView start={view} onClose={closeView} />}
    </div>
  );
}
