import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PastelGlobeScene: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = rootRef.current;
    if (!container || typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      container.style.background = 'radial-gradient(circle at 50% 42%,#0b182c 0%,#0d2238 55%,#102b4c 85%)';
      return;
    }

    // Scene & renderer
    const scene = new THREE.Scene();
    // changed fog to darker tone
    scene.fog = new THREE.Fog(0x0b1b2f, 38, 130);
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // Camera (unchanged)
    const camera = new THREE.PerspectiveCamera(48, container.clientWidth / container.clientHeight, 0.1, 300);
    camera.position.set(0,4,32);

    // Lights (dark ambient, cooler key)
    const hemiLight = new THREE.HemisphereLight(0x1e3a8a, 0x0a1422, 0.55);
    const dir = new THREE.DirectionalLight(0x5a8ff0, 0.85);
    dir.position.set(14,20,12);
    const rim = new THREE.DirectionalLight(0x3b1fa8, 0.55);
    rim.position.set(-16,-6,-10);
    // subtle fill
    const fill = new THREE.PointLight(0x2563eb, 0.6, 140);
    fill.position.set(0,6,18);
    scene.add(hemiLight, dir, rim, fill);

    // Globe group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Globe geometry with darker gradient (replaced pastel colors)
    const globeGeo = new THREE.SphereGeometry(8,48,32);
    const pos = globeGeo.attributes.position as THREE.BufferAttribute;
    const colors:number[] = [];
    const cTop = new THREE.Color('#1e3a8a'); // deep indigo
    const cBot = new THREE.Color('#0f172a'); // near navy
    for (let i=0;i<pos.count;i++){
      const y = pos.getY(i);
      const t = (y + 8)/16;
      const col = cTop.clone().lerp(cBot,t);
      colors.push(col.r,col.g,col.b);
    }
    globeGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors,3));
    const globeMat = new THREE.MeshStandardMaterial({
      vertexColors:true,
      roughness:.4,
      metalness:.25,
      envMapIntensity:.5
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globe);

    // Outline (cool glow wireframe)
    const outline = new THREE.Mesh(
      new THREE.SphereGeometry(8.06,48,32),
      new THREE.MeshBasicMaterial({ color:0x60a5fa, transparent:true, opacity:.09, wireframe:true })
    );
    globeGroup.add(outline);

    // Glow sprite (cooler cyan core)
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 256;
    {
      const g = glowCanvas.getContext('2d')!;
      const grad = g.createRadialGradient(128,128,0,128,128,128);
      grad.addColorStop(0,'rgba(96,165,250,0.95)');
      grad.addColorStop(0.4,'rgba(56,130,246,0.35)');
      grad.addColorStop(1,'rgba(56,130,246,0)');
      g.fillStyle = grad; g.fillRect(0,0,256,256);
    }
    const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(glowCanvas),
      transparent:true,
      blending:THREE.AdditiveBlending,
      depthWrite:false
    }));
    glowSprite.scale.set(24,24,1);
    globeGroup.add(glowSprite);

    // Floating icon sprites (emoji)
    type IconSpec = { emoji:string; radius:number; size:number; speed:number; y:number; phase:number; };
    const iconsSpec:IconSpec[] = [
      { emoji:'📘', radius:14, size:2.9, speed:0.04, y:3, phase:0 },
      { emoji:'🎓', radius:15.5, size:3.1, speed:0.032, y:-1, phase:2 },
      { emoji:'✈️', radius:17, size:3.2, speed:0.028, y:1.5, phase:4 }
    ];
    const iconSprites: { sprite:THREE.Sprite; spec:IconSpec }[] = [];
    const makeEmojiTexture = (char:string) => {
      const c = document.createElement('canvas'); c.width = c.height = 128;
      const ctx = c.getContext('2d')!;
      ctx.font = '90px Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(char,64,64);
      return new THREE.CanvasTexture(c);
    };
    iconsSpec.forEach(spec=>{
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeEmojiTexture(spec.emoji),
        transparent:true,
        depthWrite:false
      }));
      sprite.scale.set(spec.size,spec.size,1);
      globeGroup.add(sprite);
      iconSprites.push({ sprite, spec });
    });

    // Interaction state
    let pointerX=0, pointerY=0, tPX=0, tPY=0, lastMove = performance.now();
    const onPointer = (e:PointerEvent) => {
      const r = container.getBoundingClientRect();
      const x = (e.clientX - r.left)/r.width;
      const y = (e.clientY - r.top)/r.height;
      tPX = (x - .5)*2;
      tPY = (y - .5)*2;
      lastMove = performance.now();
    };
    window.addEventListener('pointermove', onPointer);

    // Scroll parallax
    const onScroll = () => {
      globeGroup.position.y = window.scrollY * -0.04;
    };
    window.addEventListener('scroll', onScroll, { passive:true });

    // Resize
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    // Visibility pause
    let paused = false;
    const onVis = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', onVis);

    // Animation loop (manual easing)
    let frame = 0;
    let rafId:number;
    const start = performance.now();
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (paused) return;
      frame++;
      const elapsed = (performance.now() - start) / 1000;

      if (performance.now() - lastMove > 4000) {
        tPX = Math.sin(elapsed * 0.4) * 0.4;
        tPY = Math.cos(elapsed * 0.35) * 0.35;
      }
      pointerX += (tPX - pointerX) * 0.05;
      pointerY += (tPY - pointerY) * 0.05;

      // Slow globe rotation
      globe.rotation.y += 0.0009;
      globe.rotation.x += 0.00025;

      // Gentle group drift
      globeGroup.rotation.z = pointerX * 0.15;
      globeGroup.position.x = pointerX * 1.4;
      globeGroup.position.y += (pointerY * 0.4 - globeGroup.position.y) * 0.06;

      // Outline & glow pulse
      const pulse = (Math.sin(elapsed * 0.9) + 1) / 2;
      (outline.material as THREE.MeshBasicMaterial).opacity = 0.11 + pulse * 0.035;
      glowSprite.scale.setScalar(24 + Math.sin(elapsed * 0.85) * 1.4 + 1);

      // Camera subtle bob & sway
      camera.position.y = 4 + Math.sin(elapsed * 0.22) * 1.1;
      camera.position.x = Math.sin(elapsed * 0.12) * 1.5;
      camera.position.z = 32 + Math.sin(elapsed * 0.09) * -1.2;
      camera.lookAt(globeGroup.position);

      // Icons orbit
      iconSprites.forEach(({ sprite, spec }) => {
        const ang = frame * spec.speed + spec.phase;
        const r = spec.radius;
        sprite.position.set(
          Math.cos(ang) * r,
          spec.y + Math.sin(elapsed * 0.6 + spec.phase) * 1.2,
          Math.sin(ang) * r
        );
        sprite.lookAt(camera.position);
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.dispose();
      scene.traverse(o=>{
        if ((o as any).geometry) (o as any).geometry.dispose();
        if ((o as any).material){
          const m = (o as any).material;
          if (Array.isArray(m)) m.forEach(mm=>mm.dispose()); else m.dispose();
        }
      });
      container.innerHTML='';
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="pastel-globe-scene"
      aria-hidden="true"
      style={{
        position:'absolute',
        inset:0,
        zIndex:0,
        pointerEvents:'none',
        overflow:'hidden',
        // darker radial background
        background:'radial-gradient(circle at 50% 42%, #0b182c 0%, #0d2238 50%, #102b4c 80%)'
      }}
    />
  );
};

export default PastelGlobeScene;
