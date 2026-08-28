'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

// Simple zero-dependency Web Audio synthesizer for arcade sound effects
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playCollect() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(1174.66, now + 0.12); // D6
      osc2.frequency.setValueAtTime(880.00, now); // A5
      osc2.frequency.exponentialRampToValueAtTime(1760.00, now + 0.12); // A6

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.16);
      osc2.stop(now + 0.16);
    } catch (_) {}
  }

  playJump() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.18);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (_) {}
  }

  playHit() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // White noise buffer for collision crunch
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(60, now + 0.15);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
    } catch (_) {}
  }

  playGameOver() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const freqs = [330, 293.66, 220, 164.81];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.12;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.28);
      });
    } catch (_) {}
  }

  playStart() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const freqs = [220, 329.63, 440, 659.25];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.22);
      });
    } catch (_) {}
  }
}

export default function NotFoundGridGame() {
  const mountRef = useRef(null);
  const soundRef = useRef(null);

  // Game state visible to React HUD
  const [gameState, setGameState] = useState('ready'); // 'ready' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [shields, setShields] = useState(3);
  const [multiplier, setMultiplier] = useState(1);
  const [speedGhz, setSpeedGhz] = useState(1.0);
  const [soundMuted, setSoundMuted] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  // Game Loop references (mutable state inside requestAnimationFrame)
  const gameRef = useRef({
    state: 'ready',
    score: 0,
    highScore: 0,
    shields: 3,
    multiplier: 1,
    consecutiveGems: 0,
    speed: 38,
    baseSpeed: 38,
    maxSpeed: 85,
    distance: 0,
    playerX: 0,
    playerY: 0.8,
    targetPlayerX: 0,
    playerVelY: 0,
    isJumping: false,
    invincibleTimer: 0,
    glitchTimer: 0,
    keys: { left: false, right: false, up: false, space: false },
    mouseNormalizedX: 0,
    touchSteerX: null,
    hasInteracted: false,
  });

  // Load high score and sound engine on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hazem_404_high_score');
      if (saved) {
        const val = parseInt(saved, 10) || 0;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHighScore(val);
        gameRef.current.highScore = val;
      }
    } catch (_) {}
    soundRef.current = new SoundEngine();
  }, []);

  const toggleSound = () => {
    if (soundRef.current) {
      soundRef.current.muted = !soundRef.current.muted;
      setSoundMuted(soundRef.current.muted);
    }
  };

  const startGame = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.init();
      soundRef.current.playStart();
    }
    const g = gameRef.current;
    g.state = 'playing';
    g.score = 0;
    g.shields = 3;
    g.multiplier = 1;
    g.consecutiveGems = 0;
    g.speed = g.baseSpeed;
    g.distance = 0;
    g.playerX = 0;
    g.targetPlayerX = 0;
    g.playerY = 0.8;
    g.playerVelY = 0;
    g.isJumping = false;
    g.invincibleTimer = 0;
    g.glitchTimer = 0;

    setGameState('playing');
    setScore(0);
    setShields(3);
    setMultiplier(1);
    setSpeedGhz(1.0);
  }, []);

  // Three.js Game Engine Initialization
  useEffect(() => {
    let THREE;
    let renderer;
    let scene;
    let camera;
    let animationFrameId;
    let resizeObserver;

    const container = mountRef.current;
    if (!container) return;

    let isDisposed = false;

    // Dynamically import Three to avoid SSR issues
    import('three').then((ThreeModule) => {
      if (isDisposed) return;
      THREE = ThreeModule;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      // 1. Scene & Camera
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x050505);
      scene.fog = new THREE.FogExp2(0x050505, 0.016);

      camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 300);
      camera.position.set(0, 3.2, 7.5);
      camera.lookAt(0, 1.2, -18);

      // 2. Renderer
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      // 3. Vaporwave Moving Wireframe Terrain Mesh
      const gridWidth = 70;
      const gridLength = 140;
      const gridSegmentsX = 36;
      const gridSegmentsY = 70;

      const terrainGeometry = new THREE.PlaneGeometry(
        gridWidth,
        gridLength,
        gridSegmentsX,
        gridSegmentsY
      );
      terrainGeometry.rotateX(-Math.PI / 2);

      // Neon lime wireframe material matching the portfolio (#ccf200)
      const terrainMaterial = new THREE.MeshBasicMaterial({
        color: 0xccf200,
        wireframe: true,
        transparent: true,
        opacity: 0.38,
      });

      const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
      terrainMesh.position.set(0, -0.4, -35);
      scene.add(terrainMesh);

      // Store initial original vertices
      const posAttr = terrainGeometry.attributes.position;
      const vertexCount = posAttr.count;
      const originalVertices = new Float32Array(vertexCount * 3);
      for (let i = 0; i < vertexCount * 3; i++) {
        originalVertices[i] = posAttr.array[i];
      }

      // Pre-compute a pseudo-random noise table for spiky terrain
      const NOISE_SIZE = 256;
      const noiseLUT = new Float32Array(NOISE_SIZE);
      for (let i = 0; i < NOISE_SIZE; i++) {
        noiseLUT[i] = Math.random() * 2 - 1;
      }
      const hashNoise = (ix, iz) => {
        const idx = ((ix * 73856093) ^ (iz * 19349663)) & (NOISE_SIZE - 1);
        return noiseLUT[idx < 0 ? idx + NOISE_SIZE : idx];
      };

      // Road half-width: vertices within this X range stay flat
      const ROAD_HALF = 7;
      // Transition zone width where terrain ramps from flat to spiky
      const TRANSITION = 5;

      // Height formula: flat center road, sharp spiky noise on sides
      const calculateHeight = (x, z, time) => {
        const absX = Math.abs(x);

        // Center road is perfectly flat (y = 0)
        if (absX < ROAD_HALF) return 0;

        // Transition blend: 0 at road edge → 1 fully outside
        const blend = Math.min((absX - ROAD_HALF) / TRANSITION, 1);
        // Sharper blend curve for abrupt spike onset
        const t = blend * blend;

        // Jagged spiky noise: mix of sharp hash noise + high-freq sine
        const zScroll = z - time * 12;
        const spike1 = hashNoise(Math.floor(x * 1.3), Math.floor(zScroll * 0.4)) * 2.0;
        const spike2 = Math.sin(zScroll * 0.7 + x * 0.9) * 1.0;
        const spike3 = hashNoise(Math.floor(x * 0.7 + 17), Math.floor(zScroll * 0.25 + 31)) * 1.2;

        // Scale grows gently with distance from road
        const edgeScale = 1 + (absX - ROAD_HALF) * 0.06;

        return (spike1 + spike2 + spike3) * t * edgeScale;
      };

      // 4. Player Ship (Sleek Cyber Glider)
      const shipGroup = new THREE.Group();
      shipGroup.position.set(0, 0.8, 0);
      scene.add(shipGroup);

      // Jet body geometry (delta wing)
      const shipBodyGeom = new THREE.BufferGeometry();
      // Vertices of futuristic delta interceptor
      const shipVertices = new Float32Array([
        // Nose to wings
        0, 0.15, -1.2,   -0.9, -0.05, 0.9,   0, -0.15, 0.6, // left bottom
        0, 0.15, -1.2,    0, -0.15, 0.6,     0.9, -0.05, 0.9, // right bottom
        0, 0.15, -1.2,    0, 0.45, 0.5,     -0.9, -0.05, 0.9, // left top
        0, 0.15, -1.2,    0.9, -0.05, 0.9,   0, 0.45, 0.5, // right top
        // Thruster back plate
        -0.9, -0.05, 0.9, 0, 0.45, 0.5,      0.9, -0.05, 0.9,
        -0.9, -0.05, 0.9, 0.9, -0.05, 0.9,   0, -0.15, 0.6,
      ]);
      shipBodyGeom.setAttribute('position', new THREE.BufferAttribute(shipVertices, 3));
      shipBodyGeom.computeVertexNormals();

      const shipMaterial = new THREE.MeshBasicMaterial({
        color: 0x131313,
        side: THREE.DoubleSide,
      });
      const shipMesh = new THREE.Mesh(shipBodyGeom, shipMaterial);
      shipGroup.add(shipMesh);

      // Wireframe glow outline for ship
      const shipWireframeMat = new THREE.MeshBasicMaterial({
        color: 0xccf200,
        wireframe: true,
        transparent: true,
        opacity: 0.95,
      });
      const shipWireframe = new THREE.Mesh(shipBodyGeom.clone(), shipWireframeMat);
      shipGroup.add(shipWireframe);

      // Engine Thruster Core
      const engineGeom = new THREE.SphereGeometry(0.18, 8, 8);
      const engineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const engineMesh = new THREE.Mesh(engineGeom, engineMat);
      engineMesh.position.set(0, 0.1, 0.7);
      shipGroup.add(engineMesh);

      // 5. Horizon Wireframe Sun / Digital Monolith
      const sunGeom = new THREE.CircleGeometry(18, 32);
      const sunMat = new THREE.MeshBasicMaterial({
        color: 0xccf200,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
      });
      const sunMesh = new THREE.Mesh(sunGeom, sunMat);
      sunMesh.position.set(0, 10, -95);
      scene.add(sunMesh);

      // Horizon grid guide lines
      const horizonLineGeom = new THREE.BufferGeometry();
      const horizonPts = [];
      for (let i = -60; i <= 60; i += 6) {
        horizonPts.push(i, 0, -95, 0, 0, 0);
      }
      horizonLineGeom.setAttribute('position', new THREE.Float32BufferAttribute(horizonPts, 3));
      const horizonLineMat = new THREE.LineBasicMaterial({
        color: 0x343434,
        transparent: true,
        opacity: 0.4,
      });
      const horizonLines = new THREE.LineSegments(horizonLineGeom, horizonLineMat);
      scene.add(horizonLines);

      // 6. Cyber Stars / Floating Dust Particles
      const starCount = 100;
      const starGeom = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 80;
        starPositions[i * 3 + 1] = Math.random() * 25 + 2;
        starPositions[i * 3 + 2] = -Math.random() * 120;
      }
      starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xccf200,
        size: 0.25,
        transparent: true,
        opacity: 0.6,
      });
      const starField = new THREE.Points(starGeom, starMat);
      scene.add(starField);

      // 7. Dynamic Game Entities: Collectibles (Data Bytes) & Obstacles (Void Glitches)
      const dataByteGeometry = new THREE.OctahedronGeometry(0.55, 0);
      const dataByteMaterial = new THREE.MeshBasicMaterial({
        color: 0xccf200,
        wireframe: true,
      });
      const dataByteInnerMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
      });

      // Red/Danger Hazard Monolith Geometry (#ff1a14)
      const glitchGeometry = new THREE.ConeGeometry(0.7, 1.8, 4);
      glitchGeometry.rotateY(Math.PI / 4);
      const glitchMaterial = new THREE.MeshBasicMaterial({
        color: 0xff1a14,
        wireframe: true,
      });
      const glitchInnerMat = new THREE.MeshBasicMaterial({
        color: 0x450000,
        transparent: true,
        opacity: 0.9,
      });

      const entities = [];
      const MAX_ENTITIES = 16;

      for (let i = 0; i < MAX_ENTITIES; i++) {
        // Collectible group
        const byteGroup = new THREE.Group();
        const outerByte = new THREE.Mesh(dataByteGeometry, dataByteMaterial);
        const innerByte = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), dataByteInnerMat);
        byteGroup.add(outerByte);
        byteGroup.add(innerByte);
        byteGroup.visible = false;
        scene.add(byteGroup);

        // Obstacle group
        const hazardGroup = new THREE.Group();
        const outerHazard = new THREE.Mesh(glitchGeometry, glitchMaterial);
        const innerHazard = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.4, 4), glitchInnerMat);
        hazardGroup.add(outerHazard);
        hazardGroup.add(innerHazard);
        hazardGroup.visible = false;
        scene.add(hazardGroup);

        entities.push({
          type: 'none', // 'byte' | 'glitch' | 'none'
          mesh: null,
          byteMesh: byteGroup,
          hazardMesh: hazardGroup,
          x: 0,
          y: 0,
          z: -999,
          active: false,
          radius: 0.8,
        });
      }

      // Spawning helper
      let spawnZ = -30;
      const spawnNextEntity = (zPos) => {
        const entity = entities.find((e) => !e.active);
        if (!entity) return;

        // Choose lanes: -5, -2.5, 0, 2.5, 5
        const lanes = [-5, -2.5, 0, 2.5, 5];
        const chosenLane = lanes[Math.floor(Math.random() * lanes.length)];

        // Decide type: 60% Collectible Byte, 40% Glitch Hazard
        const isGlitch = Math.random() < 0.42;

        entity.active = true;
        entity.type = isGlitch ? 'glitch' : 'byte';
        entity.x = chosenLane + (Math.random() - 0.5) * 0.8;
        entity.z = zPos;
        entity.y = isGlitch ? 0.9 : 1.2;

        if (isGlitch) {
          entity.mesh = entity.hazardMesh;
          entity.hazardMesh.visible = true;
          entity.byteMesh.visible = false;
          entity.radius = 0.85;
        } else {
          entity.mesh = entity.byteMesh;
          entity.byteMesh.visible = true;
          entity.hazardMesh.visible = false;
          entity.radius = 0.95;
        }
        entity.mesh.position.set(entity.x, entity.y, entity.z);
      };

      // Seed initial track with entities
      for (let z = -25; z >= -120; z -= 14) {
        spawnNextEntity(z);
        spawnZ = z;
      }

      // 8. Event Listeners for Keyboard & Mouse & Touch
      const handleKeyDown = (e) => {
        const g = gameRef.current;
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          g.keys.left = true;
          g.hasInteracted = true;
        }
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          g.keys.right = true;
          g.hasInteracted = true;
        }
        if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
          g.keys.space = true;
          g.hasInteracted = true;
          if (g.state === 'ready' || g.state === 'gameover') {
            startGame();
          } else if (g.state === 'playing' && !g.isJumping) {
            g.isJumping = true;
            g.playerVelY = 14;
            if (soundRef.current) soundRef.current.playJump();
          }
          e.preventDefault();
        }
      };

      const handleKeyUp = (e) => {
        const g = gameRef.current;
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') g.keys.left = false;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') g.keys.right = false;
        if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') g.keys.space = false;
      };

      // --- Mouse-only handlers (desktop) ---
      const handleMouseMove = (e) => {
        if ('ontouchstart' in window) return; // skip on touch devices
        const rect = container.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const normX = (clientX / rect.width) * 2 - 1;
        gameRef.current.mouseNormalizedX = normX * 6.5;
        gameRef.current.hasInteracted = true;
      };

      const handleMouseDown = (e) => {
        if ('ontouchstart' in window) return;
        const g = gameRef.current;
        if (g.state === 'ready' || g.state === 'gameover') {
          startGame();
        } else if (g.state === 'playing' && !g.isJumping) {
          g.isJumping = true;
          g.playerVelY = 14;
          if (soundRef.current) soundRef.current.playJump();
        }
      };

      // --- Touch handlers (mobile) ---
      // Touch steering: drag left/right from wherever you first touch
      let touchStartX = null;
      let touchCurrentX = null;
      let touchIsJumpZone = false; // right-side tap = jump

      const handleTouchStart = (e) => {
        e.preventDefault();
        const g = gameRef.current;
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const relX = (touch.clientX - rect.left) / rect.width; // 0..1

        if (g.state === 'ready' || g.state === 'gameover') {
          // Don't start game from touch on canvas — let buttons handle it
          return;
        }

        g.hasInteracted = true;

        // Right third of screen = jump zone
        if (relX > 0.65) {
          touchIsJumpZone = true;
          if (g.state === 'playing' && !g.isJumping) {
            g.isJumping = true;
            g.playerVelY = 14;
            if (soundRef.current) soundRef.current.playJump();
          }
        } else {
          touchIsJumpZone = false;
          touchStartX = touch.clientX;
          touchCurrentX = touch.clientX;
        }
      };

      const handleTouchMove = (e) => {
        e.preventDefault();
        if (touchIsJumpZone) return;
        const touch = e.touches[0];
        touchCurrentX = touch.clientX;

        const g = gameRef.current;
        if (touchStartX !== null) {
          // Drag delta mapped to steering: 80px drag = full lane width
          const dx = (touchCurrentX - touchStartX) / 80;
          g.touchSteerX = Math.max(-6.2, Math.min(6.2, dx * 6.5));
          g.hasInteracted = true;
        }
      };

      const handleTouchEnd = (e) => {
        e.preventDefault();
        touchStartX = null;
        touchCurrentX = null;
        touchIsJumpZone = false;
        gameRef.current.touchSteerX = null;
      };

      // Prevent scrolling/bouncing on the game container
      container.style.touchAction = 'none';

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd, { passive: false });

      // 9. Resize Handling
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);

      // 10. Main Animation & Game Loop
      let lastTime = performance.now();
      let totalElapsedTime = 0;
      let lastHudUpdate = 0;

      const animate = (currentTime) => {
        animationFrameId = requestAnimationFrame(animate);

        const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
        lastTime = currentTime;
        totalElapsedTime += delta;

        const g = gameRef.current;

        // Difficulty scaling over time: progressive but balanced
        if (g.state === 'playing') {
          // Speed curves up logarithmically: starts at 38, approaches ~75 after 90s
          g.speed = Math.min(
            g.maxSpeed,
            g.baseSpeed + Math.log2(1 + g.distance / 120) * 8.5
          );
          g.distance += g.speed * delta;
          g.score += Math.round(g.speed * delta * 1.5 * g.multiplier);

          // Throttle React HUD updates to ~5fps (every 200ms)
          if (currentTime - lastHudUpdate > 200) {
            lastHudUpdate = currentTime;
            setScore(g.score);
            setMultiplier(g.multiplier);
            setSpeedGhz((g.speed / 28).toFixed(1));
            if (g.score > g.highScore) {
              g.highScore = g.score;
              setHighScore(g.score);
              try {
                localStorage.setItem('hazem_404_high_score', g.score.toString());
              } catch (_) {}
            }
          }
        }

        // --- Player Controls & Steering Physics ---
        if (g.state === 'playing' || g.state === 'ready') {
          const steerSpeed = 22;
          if (g.touchSteerX !== null) {
            // Touch drag steering (mobile): direct position from drag delta
            g.targetPlayerX = g.touchSteerX;
          } else if (g.keys.left) {
            g.targetPlayerX = Math.max(-6.2, g.targetPlayerX - steerSpeed * delta);
          } else if (g.keys.right) {
            g.targetPlayerX = Math.min(6.2, g.targetPlayerX + steerSpeed * delta);
          } else if (g.hasInteracted) {
            // Smoothly track mouse if no keyboard left/right (desktop)
            g.targetPlayerX += (g.mouseNormalizedX - g.targetPlayerX) * 0.14;
            g.targetPlayerX = Math.max(-6.2, Math.min(6.2, g.targetPlayerX));
          }

          // Smooth interpolation for ship X
          const diffX = g.targetPlayerX - g.playerX;
          g.playerX += diffX * 0.18;

          // Banking roll rotation
          shipGroup.rotation.z = -diffX * 0.28;
          shipGroup.rotation.y = diffX * 0.15;
          shipGroup.position.x = g.playerX;

          // Jumping Physics
          if (g.isJumping) {
            g.playerVelY -= 36 * delta; // Gravity
            g.playerY += g.playerVelY * delta;
            if (g.playerY <= 0.8) {
              g.playerY = 0.8;
              g.isJumping = false;
              g.playerVelY = 0;
            }
          } else {
            // Slight hover bobbing
            g.playerY = 0.8 + Math.sin(totalElapsedTime * 6) * 0.08;
          }
          shipGroup.position.y = g.playerY;

          // Thruster pulse
          engineMesh.scale.setScalar(0.8 + Math.random() * 0.4);
        }

        // --- Update Terrain Wireframe Mesh ---
        const pos = terrainGeometry.attributes.position;
        const scrollZ = g.distance * 0.35 + totalElapsedTime * 10;

        for (let i = 0; i < vertexCount; i++) {
          const vx = originalVertices[i * 3];
          const vz = originalVertices[i * 3 + 2];
          // Calculate procedural height based on displaced position
          const h = calculateHeight(vx, vz - scrollZ, totalElapsedTime);
          pos.array[i * 3 + 1] = h; // Set Y elevation
        }
        pos.needsUpdate = true;

        // --- Update & Spawn Entities (Bytes & Glitches) ---
        const forwardSpeed = g.state === 'playing' ? g.speed : 18;

        entities.forEach((entity) => {
          if (!entity.active) return;

          entity.z += forwardSpeed * delta;
          entity.mesh.position.z = entity.z;

          // Rotate collectibles and hazards
          if (entity.type === 'byte') {
            entity.byteMesh.rotation.y += delta * 3.5;
            entity.byteMesh.rotation.x += delta * 2.0;
          } else if (entity.type === 'glitch') {
            entity.hazardMesh.rotation.y += delta * 2.0;
            // Pulsing scale for threat
            const pulse = 1.0 + Math.sin(totalElapsedTime * 8 + entity.x) * 0.15;
            entity.hazardMesh.scale.set(pulse, pulse, pulse);
          }

          // --- Collision Detection ---
          if (g.state === 'playing' && Math.abs(entity.z - shipGroup.position.z) < 1.1) {
            const distX = Math.abs(entity.x - g.playerX);
            const distY = Math.abs(entity.y - g.playerY);

            // Hit collision check
            if (distX < entity.radius && distY < 1.4) {
              if (entity.type === 'byte') {
                // Collect byte!
                entity.active = false;
                entity.byteMesh.visible = false;
                g.consecutiveGems += 1;
                g.multiplier = Math.min(4, 1 + Math.floor(g.consecutiveGems / 4));
                g.score += 250 * g.multiplier;
                if (soundRef.current) soundRef.current.playCollect();
              } else if (entity.type === 'glitch' && g.invincibleTimer <= 0) {
                // Collide with Glitch!
                g.shields -= 1;
                g.consecutiveGems = 0;
                g.multiplier = 1;
                g.invincibleTimer = 1.4; // 1.4s invulnerability
                g.glitchTimer = 0.35;
                setShields(g.shields);
                setIsGlitching(true);

                if (soundRef.current) soundRef.current.playHit();

                // Camera shake
                camera.position.x = (Math.random() - 0.5) * 0.8;
                camera.position.y = 3.2 + (Math.random() - 0.5) * 0.5;

                if (g.shields <= 0) {
                  // Game Over
                  g.state = 'gameover';
                  setGameState('gameover');
                  if (soundRef.current) soundRef.current.playGameOver();
                }
              }
            }
          }

          // Recurse entity if passed behind player
          if (entity.z > 8) {
            entity.active = false;
            entity.mesh.visible = false;
          }
        });

        // Invulnerability & Glitch timers
        if (g.invincibleTimer > 0) {
          g.invincibleTimer -= delta;
          // Flash ship transparency
          shipWireframe.material.opacity = Math.sin(totalElapsedTime * 30) > 0 ? 0.9 : 0.2;
        } else {
          shipWireframe.material.opacity = 0.95;
        }

        if (g.glitchTimer > 0) {
          g.glitchTimer -= delta;
          if (g.glitchTimer <= 0) setIsGlitching(false);
        }

        // Camera recovery to center
        camera.position.x += (0 - camera.position.x) * 0.1;
        camera.position.y += (3.2 - camera.position.y) * 0.1;

        // Keep spawning new entities ahead
        spawnZ += forwardSpeed * delta;
        if (spawnZ >= -115) {
          spawnNextEntity(-125 - Math.random() * 8);
          spawnZ = -125;
        }

        // Star dust drift
        const starPos = starGeom.attributes.position;
        for (let i = 0; i < starCount; i++) {
          starPos.array[i * 3 + 2] += (forwardSpeed * 0.2) * delta;
          if (starPos.array[i * 3 + 2] > 5) {
            starPos.array[i * 3 + 2] = -120;
          }
        }
        starPos.needsUpdate = true;

        // Render scene
        renderer.render(scene, camera);
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        if (container) {
          container.removeEventListener('mousemove', handleMouseMove);
          container.removeEventListener('mousedown', handleMouseDown);
          container.removeEventListener('touchstart', handleTouchStart);
          container.removeEventListener('touchmove', handleTouchMove);
          container.removeEventListener('touchend', handleTouchEnd);
        }
      };
    });

    return () => {
      isDisposed = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (resizeObserver && container) resizeObserver.unobserve(container);
      if (renderer && renderer.domElement && container) {
        container.innerHTML = '';
        renderer.dispose();
      }
    };
  }, [startGame]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505] font-[family-name:var(--font-mono)] select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 z-0 cursor-crosshair" />

      {/* Glitch Overlay Screen Flash */}
      {isGlitching && (
        <div className="absolute inset-0 pointer-events-none z-20 bg-red-900/30 mix-blend-screen animate-pulse" />
      )}

      {/* Retro CRT Scanlines & Noise */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.75) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 6px 100%',
        }}
      />

      {/* TOP HUD BAR */}
      <header className="absolute top-0 left-0 right-0 z-30 p-4 md:p-6 flex items-center justify-between border-b border-border-primary/60 bg-[#050505]/70 backdrop-blur-sm">
        {/* Left: 404 Status */}
        <div className="flex items-center gap-3">
          <span className="inline-block w-2.5 h-2.5 bg-primary-fixed animate-ping rounded-full" />
          <span className="text-[12px] font-bold tracking-wider text-primary-fixed uppercase">
            STATUS: 404 // VOID GRID REACHED
          </span>
        </div>

        {/* Center: Live Telemetry */}
        <div className="hidden md:flex items-center gap-8 text-[12px]">
          <div>
            <span className="text-text-muted mr-2">SCORE:</span>
            <span className="text-primary font-bold">{score.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-text-muted mr-2">BEST:</span>
            <span className="text-primary-fixed-dim">{highScore.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-text-muted mr-2">BANDWIDTH:</span>
            <span className="text-primary-fixed">{speedGhz} GHz</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted mr-1">SHIELD:</span>
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`inline-block w-3 h-3 border ${
                  shields >= s
                    ? 'bg-primary-fixed border-primary-fixed'
                    : 'bg-transparent border-border-primary'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Sound Toggle & Quick Escape */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSound}
            className="text-[11px] uppercase tracking-wider text-text-muted hover:text-primary-fixed transition-colors border border-border-primary px-2.5 py-1 bg-surface"
          >
            [ AUDIO: {soundMuted ? 'OFF' : 'ON'} ]
          </button>
          <Link
            href="/"
            className="text-[11px] font-bold uppercase tracking-wider text-black bg-primary-fixed hover:bg-white transition-colors px-3 py-1"
          >
            [ WARP HOME ]
          </Link>
        </div>
      </header>

      {/* MOBILE COMPACT TELEMETRY */}
      <div className="md:hidden absolute top-14 left-3 right-3 z-30 flex justify-between items-center text-[10px] bg-surface/80 px-2.5 py-1.5 border border-border-primary">
        <div>
          <span className="text-text-muted">SCR </span>
          <span className="text-primary font-bold">{score}</span>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`inline-block w-2 h-2 border ${
                shields >= s
                  ? 'bg-primary-fixed border-primary-fixed'
                  : 'bg-transparent border-border-primary'
              }`}
            />
          ))}
        </div>
        <div>
          <span className="text-primary-fixed">x{multiplier}</span>
        </div>
      </div>

      {/* MOBILE ON-SCREEN TOUCH CONTROLS */}
      {gameState === 'playing' && (
        <div className="md:hidden absolute bottom-0 left-0 right-0 z-40 flex items-end justify-between p-3 pb-6 pointer-events-none">
          {/* Left / Right steering buttons */}
          <div className="flex gap-2 pointer-events-auto">
            <button
              onTouchStart={(e) => {
                e.stopPropagation();
                gameRef.current.keys.left = true;
                gameRef.current.hasInteracted = true;
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                gameRef.current.keys.left = false;
              }}
              className="w-16 h-16 border-2 border-primary-fixed/50 bg-surface/40 backdrop-blur-sm flex items-center justify-center text-primary-fixed text-2xl active:bg-primary-fixed/20 active:border-primary-fixed"
              aria-label="Steer Left"
            >
              ◀
            </button>
            <button
              onTouchStart={(e) => {
                e.stopPropagation();
                gameRef.current.keys.right = true;
                gameRef.current.hasInteracted = true;
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                gameRef.current.keys.right = false;
              }}
              className="w-16 h-16 border-2 border-primary-fixed/50 bg-surface/40 backdrop-blur-sm flex items-center justify-center text-primary-fixed text-2xl active:bg-primary-fixed/20 active:border-primary-fixed"
              aria-label="Steer Right"
            >
              ▶
            </button>
          </div>

          {/* Jump button */}
          <button
            onTouchStart={(e) => {
              e.stopPropagation();
              const g = gameRef.current;
              if (g.state === 'playing' && !g.isJumping) {
                g.isJumping = true;
                g.playerVelY = 14;
                if (soundRef.current) soundRef.current.playJump();
              }
            }}
            className="w-20 h-16 border-2 border-primary-fixed/50 bg-surface/40 backdrop-blur-sm flex items-center justify-center text-primary-fixed text-xs font-bold uppercase tracking-wider active:bg-primary-fixed/20 active:border-primary-fixed pointer-events-auto"
            aria-label="Jump"
          >
            JUMP ▲
          </button>
        </div>
      )}

      {/* CENTER OVERLAY: READY / IDLE STATE */}
      {gameState === 'ready' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 pointer-events-none">
          <div className="max-w-xl w-full bg-surface/90 border border-border-primary p-6 md:p-8 backdrop-blur-md text-center pointer-events-auto shadow-2xl">
            <div className="text-[11px] uppercase tracking-[0.2em] text-primary-fixed mb-2">
              404 // ROUTE DISCONNECTED
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-extrabold uppercase text-primary mb-3 tracking-tight">
              Oops, there is nothing here.
            </h1>
            <p className="text-[13px] md:text-[14px] text-text-muted mb-6 max-w-md mx-auto leading-relaxed">
              The coordinates you requested drifted into the deep noise grid. Pilot through the
              vaporwave terrain or warp safely back to known space.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <button
                onClick={startGame}
                className="w-full sm:w-auto font-bold uppercase tracking-wider text-black bg-primary-fixed hover:bg-white transition-colors px-6 py-3 text-[13px]"
              >
                <span className="hidden sm:inline">[ START GRID MISSION (SPACE / CLICK) ]</span>
                <span className="sm:hidden">[ TAP TO START ]</span>
              </button>
              <Link
                href="/projects"
                className="w-full sm:w-auto font-medium uppercase tracking-wider text-text-muted hover:text-primary hover:border-primary transition-colors border border-border-primary bg-surface-container-high px-5 py-3 text-[13px]"
              >
                [ VIEW PROJECTS ]
              </Link>
            </div>

            {/* Controls Info Guide — Desktop */}
            <div className="hidden sm:grid pt-4 border-t border-border-primary/80 grid-cols-3 gap-3 text-[11px] text-text-dim text-left">
              <div>
                <span className="text-text-muted block font-semibold">STEER:</span>
                <span>[A / D] or [← / →] or Mouse</span>
              </div>
              <div>
                <span className="text-text-muted block font-semibold">JUMP / BOOST:</span>
                <span>[SPACE] or [W] or Click</span>
              </div>
              <div>
                <span className="text-primary-fixed block font-semibold">OBJECTIVE:</span>
                <span>Collect Bytes, Dodge Glitches</span>
              </div>
            </div>

            {/* Controls Info Guide — Mobile */}
            <div className="sm:hidden pt-4 border-t border-border-primary/80 grid grid-cols-2 gap-2 text-[10px] text-text-dim text-left">
              <div>
                <span className="text-text-muted block font-semibold">STEER:</span>
                <span>◀ ▶ buttons or drag</span>
              </div>
              <div>
                <span className="text-text-muted block font-semibold">JUMP:</span>
                <span>JUMP ▲ button</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CENTER OVERLAY: GAME OVER STATE */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 pointer-events-none">
          <div className="max-w-md w-full bg-surface/95 border border-red-500/50 p-6 md:p-8 backdrop-blur-md text-center pointer-events-auto shadow-2xl">
            <div className="text-[11px] uppercase tracking-[0.2em] text-red-400 mb-2 font-bold animate-pulse">
              SIGNAL TERMINATED // SHIELD DEPLETED
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase text-primary mb-4 tracking-tight">
              GRID COLLISION
            </h2>

            <div className="bg-surface-container-high border border-border-primary p-4 mb-6 grid grid-cols-2 gap-4 text-left">
              <div>
                <div className="text-[10px] uppercase text-text-muted">FINAL RECOVERY:</div>
                <div className="text-2xl font-bold text-primary">{score.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-text-muted">ALL-TIME BEST:</div>
                <div className="text-2xl font-bold text-primary-fixed">{highScore.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={startGame}
                className="w-full font-bold uppercase tracking-wider text-black bg-primary-fixed hover:bg-white transition-colors py-3 text-[13px]"
              >
                [ REBOOT SYSTEM (SPACE) ]
              </button>
              <div className="grid grid-cols-3 gap-2">
                <Link
                  href="/"
                  className="text-center text-[11px] uppercase text-text-muted hover:text-primary border border-border-primary py-2 bg-surface hover:bg-surface-hover transition-colors"
                >
                  [ HOME ]
                </Link>
                <Link
                  href="/projects"
                  className="text-center text-[11px] uppercase text-text-muted hover:text-primary border border-border-primary py-2 bg-surface hover:bg-surface-hover transition-colors"
                >
                  [ PROJECTS ]
                </Link>
                <Link
                  href="/blog"
                  className="text-center text-[11px] uppercase text-text-muted hover:text-primary border border-border-primary py-2 bg-surface hover:bg-surface-hover transition-colors"
                >
                  [ BLOG ]
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CONTROLS HINT — desktop only */}
      {gameState === 'playing' && (
        <div className="hidden md:flex absolute bottom-4 left-0 right-0 z-20 pointer-events-none justify-center">
          <div className="bg-[#050505]/80 border border-border-primary px-4 py-1.5 text-[11px] text-text-muted backdrop-blur-sm">
            <span className="text-primary-fixed mr-2">✦ TIP:</span>
            <span>Use [A / D] or Mouse to steer • [SPACE] to jump hazards • Multiplier: <strong className="text-primary-fixed">x{multiplier}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
