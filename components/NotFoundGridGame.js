'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import filter from 'leo-profanity';

// Zero-dependency Web Audio synthesizer for arcade sound effects & space shooter SFX
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
      osc2.frequency.setValueAtTime(880.0, now); // A5
      osc2.frequency.exponentialRampToValueAtTime(1760.0, now + 0.12); // A6

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

  // --- Space Shooter Easter Egg Sound FX ---
  playLaser() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.09);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (_) {}
  }

  playExplosion() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(40, now + 0.25);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
    } catch (_) {}
  }

  playEasterFanfare() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, t: 0.0 },  // C5
        { f: 659.25, t: 0.1 },  // E5
        { f: 783.99, t: 0.2 },  // G5
        { f: 1046.5, t: 0.3 },  // C6
        { f: 1318.5, t: 0.42 }, // E6
        { f: 1567.98, t: 0.54 }, // G6
      ];

      notes.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const st = now + n.t;

        osc.type = 'square';
        osc.frequency.setValueAtTime(n.f, st);

        gain.gain.setValueAtTime(0.12, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(st);
        osc.stop(st + 0.3);
      });
    } catch (_) {}
  }

  playWarp() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 1.2);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.35);
    } catch (_) {}
  }

  playPowerup() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const st = now + idx * 0.05;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, st);

        gain.gain.setValueAtTime(0.14, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(st);
        osc.stop(st + 0.18);
      });
    } catch (_) {}
  }

  playBomb() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.6);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.75);
    } catch (_) {}
  }
}

export default function NotFoundGridGame() {
  const mountRef = useRef(null);
  const soundRef = useRef(null);

  // Modes: 'ready' | 'playing' | 'gameover' | 'easter_transition' | 'shooter_playing' | 'shooter_gameover'
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [shooterScore, setShooterScore] = useState(0);
  const [shooterHighScore, setShooterHighScore] = useState(0);
  const [shields, setShields] = useState(3);
  const [multiplier, setMultiplier] = useState(1);
  const [speedGhz, setSpeedGhz] = useState(1.0);
  const [soundMuted, setSoundMuted] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  // Easter Egg specific state
  const [easterEggBanner, setEasterEggBanner] = useState(false);
  const [activePowerup, setActivePowerup] = useState(null);
  const [sectorWave, setSectorWave] = useState(1);

  // Global Leaderboard State
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [leaderboardTab, setLeaderboardTab] = useState('space_shooter');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [leaderboardNotice, setLeaderboardNotice] = useState(null);
  const [pilotCallsign, setPilotCallsign] = useState('PILOT');
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [submissionRank, setSubmissionRank] = useState(null);

  // Mutable Game Loop references inside requestAnimationFrame
  const gameRef = useRef({
    state: 'ready',
    score: 0,
    highScore: 0,
    shooterScore: 0,
    shooterHighScore: 0,
    shields: 3,
    multiplier: 1,
    consecutiveGems: 0,
    speed: 38,
    baseSpeed: 38,
    maxSpeed: 85,
    distance: 0,
    playerX: 0,
    playerY: 0.8,
    playerZ: 0,
    targetPlayerX: 0,
    targetPlayerZ: 0,
    playerVelY: 0,
    isJumping: false,
    invincibleTimer: 0,
    glitchTimer: 0,
    keys: { left: false, right: false, up: false, down: false, space: false },
    mouseNormalizedX: 0,
    mouseNormalizedY: 0,
    touchSteerX: null,
    touchSteerZ: null,
    hasInteracted: false,

    // Space spam detector
    spacePressTimes: [],

    // Easter Egg Transition & Shooter Mode
    transitionProgress: 0,
    transitionDuration: 2.2,
    shooterTime: 0,
    shooterSector: 1,
    laserCooldown: 0,
    powerupTimer: 0,
    powerupType: null,
    waveSpawnTimer: 0,
    nextWaveDelay: 1.6,
    hasActiveBoss: false,
  });

  // Load high scores & sound engine on mount
  useEffect(() => {
    document.body.classList.add('hide-chatbot');
    try {
      const savedGrid = localStorage.getItem('hazem_404_high_score');
      if (savedGrid) {
        const val = parseInt(savedGrid, 10) || 0;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHighScore(val);
        gameRef.current.highScore = val;
      }
      const savedShooter = localStorage.getItem('hazem_404_shooter_high_score');
      if (savedShooter) {
        const val = parseInt(savedShooter, 10) || 0;
        setShooterHighScore(val);
        gameRef.current.shooterHighScore = val;
      }
      const savedCallsign = localStorage.getItem('hazem_404_callsign');
      if (savedCallsign) {
        setPilotCallsign(savedCallsign);
      }
    } catch (_) {}
    soundRef.current = new SoundEngine();

    return () => {
      document.body.classList.remove('hide-chatbot');
    };
  }, []);

  const toggleSound = () => {
    if (soundRef.current) {
      soundRef.current.muted = !soundRef.current.muted;
      setSoundMuted(soundRef.current.muted);
    }
  };

  // Fetch leaderboard data from API
  const fetchLeaderboard = useCallback(async (mode = 'space_shooter') => {
    setIsLoadingLeaderboard(true);
    setLeaderboardNotice(null);
    try {
      const res = await fetch(`/api/leaderboard?mode=${mode}&limit=20`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setLeaderboardData(json.data);
        if (json.message) {
          setLeaderboardNotice(json.message);
        }
      } else {
        setLeaderboardNotice(json.error || 'Unable to fetch leaderboard.');
        setLeaderboardData([]);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setLeaderboardNotice('Network error fetching scores.');
      setLeaderboardData([]);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  }, []);

  // Open the leaderboard modal
  const openLeaderboard = useCallback(
    (mode = 'space_shooter') => {
      setLeaderboardTab(mode);
      setShowLeaderboardModal(true);
      fetchLeaderboard(mode);
    },
    [fetchLeaderboard]
  );

  // Submit high score to global Supabase leaderboard
  const submitScore = async (mode, scoreVal, sectorVal = 1) => {
    if (!scoreVal || scoreVal <= 0 || isSubmittingScore || scoreSubmitted) return;
    if (filter.check(pilotCallsign)) {
      alert('Callsign contains prohibited words. Please choose another callsign.');
      return;
    }
    setIsSubmittingScore(true);
    try {
      const cleanCallsign = (pilotCallsign || 'PILOT').trim().toUpperCase().slice(0, 16);
      try {
        localStorage.setItem('hazem_404_callsign', cleanCallsign);
      } catch (_) {}

      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_name: cleanCallsign,
          score: scoreVal,
          game_mode: mode,
          sector: sectorVal,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setScoreSubmitted(true);
        setSubmissionRank(json.rank || 1);
        if (soundRef.current) soundRef.current.playCollect();
      } else {
        alert(json.error || 'Failed to submit score to leaderboard.');
      }
    } catch (err) {
      console.error('Submit score error:', err);
      alert('Network error submitting score.');
    } finally {
      setIsSubmittingScore(false);
    }
  };

  // Start original Grid Runner
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
    g.playerZ = 0;
    g.playerVelY = 0;
    g.isJumping = false;
    g.invincibleTimer = 0;
    g.glitchTimer = 0;

    setGameState('playing');
    setScore(0);
    setShields(3);
    setMultiplier(1);
    setSpeedGhz(1.0);
    setEasterEggBanner(false);
    setScoreSubmitted(false);
    setSubmissionRank(null);
  }, []);

  // Trigger Easter Egg Space Shooter
  const triggerEasterEgg = useCallback(() => {
    const g = gameRef.current;
    if (g.state === 'easter_transition' || g.state === 'shooter_playing') {
      return;
    }

    if (soundRef.current) {
      soundRef.current.init();
      soundRef.current.playWarp();
      setTimeout(() => {
        if (soundRef.current) soundRef.current.playEasterFanfare();
      }, 700);
    }

    g.state = 'easter_transition';
    g.transitionProgress = 0;
    g.shooterTime = 0;
    g.shooterScore = 0;
    g.shields = 4;
    g.multiplier = 1;
    g.shooterSector = 1;
    g.laserCooldown = 0;
    g.powerupTimer = 0;
    g.powerupType = null;
    g.waveSpawnTimer = 0;
    g.nextWaveDelay = 1.6;
    g.hasActiveBoss = false;
    g.invincibleTimer = 2.0;

    setGameState('easter_transition');
    setEasterEggBanner(true);
    setShooterScore(0);
    setShields(4);
    setSectorWave(1);
    setActivePowerup(null);
    setScoreSubmitted(false);
    setSubmissionRank(null);

    setTimeout(() => {
      setEasterEggBanner(false);
    }, 4500);
  }, []);

  // Restart Space Shooter
  const restartShooter = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.init();
      soundRef.current.playStart();
    }
    const g = gameRef.current;
    g.state = 'shooter_playing';
    g.shooterTime = 0;
    g.shooterScore = 0;
    g.shields = 4;
    g.multiplier = 1;
    g.shooterSector = 1;
    g.laserCooldown = 0;
    g.powerupTimer = 0;
    g.powerupType = null;
    g.waveSpawnTimer = 0;
    g.nextWaveDelay = 1.6;
    g.hasActiveBoss = false;
    g.invincibleTimer = 1.5;
    g.playerX = 0;
    g.playerZ = 6;
    g.targetPlayerX = 0;
    g.targetPlayerZ = 6;

    setGameState('shooter_playing');
    setShooterScore(0);
    setShields(4);
    setSectorWave(1);
    setActivePowerup(null);
    setScoreSubmitted(false);
    setSubmissionRank(null);
  }, []);

  // Return from Shooter back to standard Grid Runner
  const returnToGrid = useCallback(() => {
    startGame();
  }, [startGame]);

  // Main Three.js Game Engine Initialization
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
      scene.fog = new THREE.FogExp2(0x050505, 0.015);

      camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 300);
      const defaultCamPos = { x: 0, y: 3.2, z: 7.5 };
      const defaultCamLook = { x: 0, y: 1.2, z: -18 };
      camera.position.set(defaultCamPos.x, defaultCamPos.y, defaultCamPos.z);
      camera.lookAt(defaultCamLook.x, defaultCamLook.y, defaultCamLook.z);

      // 2. Renderer
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      // 3. Vaporwave Wireframe Terrain Mesh
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

      const terrainMaterial = new THREE.MeshBasicMaterial({
        color: 0xccf200,
        wireframe: true,
        transparent: true,
        opacity: 0.38,
      });

      const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
      terrainMesh.position.set(0, -0.4, -35);
      scene.add(terrainMesh);

      const posAttr = terrainGeometry.attributes.position;
      const vertexCount = posAttr.count;
      const originalVertices = new Float32Array(vertexCount * 3);
      for (let i = 0; i < vertexCount * 3; i++) {
        originalVertices[i] = posAttr.array[i];
      }

      const NOISE_SIZE = 256;
      const noiseLUT = new Float32Array(NOISE_SIZE);
      for (let i = 0; i < NOISE_SIZE; i++) {
        noiseLUT[i] = Math.random() * 2 - 1;
      }
      const hashNoise = (ix, iz) => {
        const idx = ((ix * 73856093) ^ (iz * 19349663)) & (NOISE_SIZE - 1);
        return noiseLUT[idx < 0 ? idx + NOISE_SIZE : idx];
      };

      const ROAD_HALF = 7;
      const TRANSITION = 5;

      const calculateHeight = (x, z, time) => {
        const absX = Math.abs(x);
        if (absX < ROAD_HALF) return 0;
        const blend = Math.min((absX - ROAD_HALF) / TRANSITION, 1);
        const t = blend * blend;

        const zScroll = z - time * 12;
        const spike1 = hashNoise(Math.floor(x * 1.3), Math.floor(zScroll * 0.4)) * 2.0;
        const spike2 = Math.sin(zScroll * 0.7 + x * 0.9) * 1.0;
        const spike3 = hashNoise(Math.floor(x * 0.7 + 17), Math.floor(zScroll * 0.25 + 31)) * 1.2;
        const edgeScale = 1 + (absX - ROAD_HALF) * 0.06;

        return (spike1 + spike2 + spike3) * t * edgeScale;
      };

      // 4. Player Ship
      const shipGroup = new THREE.Group();
      shipGroup.position.set(0, 0.8, 0);
      scene.add(shipGroup);

      const shipBodyGeom = new THREE.BufferGeometry();
      const shipVertices = new Float32Array([
        0, 0.15, -1.2, -0.9, -0.05, 0.9, 0, -0.15, 0.6,
        0, 0.15, -1.2, 0, -0.15, 0.6, 0.9, -0.05, 0.9,
        0, 0.15, -1.2, 0, 0.45, 0.5, -0.9, -0.05, 0.9,
        0, 0.15, -1.2, 0.9, -0.05, 0.9, 0, 0.45, 0.5,
        -0.9, -0.05, 0.9, 0, 0.45, 0.5, 0.9, -0.05, 0.9,
        -0.9, -0.05, 0.9, 0.9, -0.05, 0.9, 0, -0.15, 0.6,
      ]);
      shipBodyGeom.setAttribute('position', new THREE.BufferAttribute(shipVertices, 3));
      shipBodyGeom.computeVertexNormals();

      const shipMaterial = new THREE.MeshBasicMaterial({
        color: 0x131313,
        side: THREE.DoubleSide,
      });
      const shipMesh = new THREE.Mesh(shipBodyGeom, shipMaterial);
      shipGroup.add(shipMesh);

      const shipWireframeMat = new THREE.MeshBasicMaterial({
        color: 0xccf200,
        wireframe: true,
        transparent: true,
        opacity: 0.95,
      });
      const shipWireframe = new THREE.Mesh(shipBodyGeom.clone(), shipWireframeMat);
      shipGroup.add(shipWireframe);

      const engineGeom = new THREE.SphereGeometry(0.2, 8, 8);
      const engineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const engineMesh = new THREE.Mesh(engineGeom, engineMat);
      engineMesh.position.set(0, 0.1, 0.7);
      shipGroup.add(engineMesh);

      const thrusterConeGeom = new THREE.ConeGeometry(0.35, 2.0, 8);
      thrusterConeGeom.rotateX(-Math.PI / 2);
      thrusterConeGeom.translate(0, 0, 1.2);
      const thrusterConeMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.0,
      });
      const thrusterCone = new THREE.Mesh(thrusterConeGeom, thrusterConeMat);
      shipGroup.add(thrusterCone);

      // 5. Horizon Sun
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

      // 6. Deep Space Dynamic Stars with Varied Depth & Colors
      const starCount = 260;
      const starGeom = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 160;
        starPositions[i * 3 + 1] = Math.random() * 70 - 15;
        starPositions[i * 3 + 2] = -Math.random() * 180 + 20;
      }
      starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xccf200,
        size: 0.35,
        transparent: true,
        opacity: 0.75,
      });
      const starField = new THREE.Points(starGeom, starMat);
      scene.add(starField);

      // 7. Grid Mode Entities (Bytes & Hazards)
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
      const MAX_GRID_ENTITIES = 16;

      for (let i = 0; i < MAX_GRID_ENTITIES; i++) {
        const byteGroup = new THREE.Group();
        const outerByte = new THREE.Mesh(dataByteGeometry, dataByteMaterial);
        const innerByte = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), dataByteInnerMat);
        byteGroup.add(outerByte);
        byteGroup.add(innerByte);
        byteGroup.visible = false;
        scene.add(byteGroup);

        const hazardGroup = new THREE.Group();
        const outerHazard = new THREE.Mesh(glitchGeometry, glitchMaterial);
        const innerHazard = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.4, 4), glitchInnerMat);
        hazardGroup.add(outerHazard);
        hazardGroup.add(innerHazard);
        hazardGroup.visible = false;
        scene.add(hazardGroup);

        entities.push({
          type: 'none',
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

      let spawnZ = -30;
      const spawnNextEntity = (zPos) => {
        const entity = entities.find((e) => !e.active);
        if (!entity) return;

        const lanes = [-5, -2.5, 0, 2.5, 5];
        const chosenLane = lanes[Math.floor(Math.random() * lanes.length)];
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

      for (let z = -25; z >= -120; z -= 14) {
        spawnNextEntity(z);
        spawnZ = z;
      }

      // =======================================================
      // 8. RICH PROCEDURAL SPACE SHOOTER ENTITIES & GEOMETRIES
      // =======================================================

      // A. Player Lasers
      const MAX_LASERS = 40;
      const laserGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 6);
      laserGeometry.rotateX(Math.PI / 2);
      const laserMaterial = new THREE.MeshBasicMaterial({
        color: 0xccf200,
        transparent: true,
        opacity: 0.95,
      });

      const lasers = [];
      for (let i = 0; i < MAX_LASERS; i++) {
        const mesh = new THREE.Mesh(laserGeometry, laserMaterial.clone());
        mesh.visible = false;
        scene.add(mesh);
        lasers.push({
          mesh,
          active: false,
          vx: 0,
          vz: -75,
          damage: 1,
        });
      }

      const fireLaser = (originX, originY, originZ, angleOffset = 0, color = 0xccf200) => {
        const laser = lasers.find((l) => !l.active);
        if (!laser) return;

        laser.active = true;
        laser.mesh.visible = true;
        laser.mesh.position.set(originX, originY, originZ);
        laser.mesh.material.color.setHex(color);

        const speed = 78;
        laser.vx = Math.sin(angleOffset) * speed;
        laser.vz = -Math.cos(angleOffset) * speed;
        laser.mesh.rotation.y = -angleOffset;
      };

      // B. Procedural Enemies & Organic Asteroid Models
      const MAX_SHOOTER_ENEMIES = 28;
      const shooterEnemies = [];

      // 1. Alien Drone (Cyan swept wing fighter)
      const scoutGroupTemplate = () => {
        const group = new THREE.Group();
        const bodyGeom = new THREE.ConeGeometry(0.7, 1.6, 4);
        bodyGeom.rotateX(Math.PI / 2);
        const bodyMesh = new THREE.Mesh(
          bodyGeom,
          new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true })
        );
        const coreMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.25, 6, 6),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        group.add(bodyMesh);
        group.add(coreMesh);
        return group;
      };

      // 2. Alien Interceptor (Violet dual-wing attack ship)
      const interceptorGroupTemplate = () => {
        const group = new THREE.Group();
        const wingL = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 0.1, 1.8),
          new THREE.MeshBasicMaterial({ color: 0xd946ef, wireframe: true })
        );
        wingL.position.set(-0.7, 0, 0);
        wingL.rotation.y = 0.3;

        const wingR = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 0.1, 1.8),
          new THREE.MeshBasicMaterial({ color: 0xd946ef, wireframe: true })
        );
        wingR.position.set(0.7, 0, 0);
        wingR.rotation.y = -0.3;

        const center = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.55, 0),
          new THREE.MeshBasicMaterial({ color: 0xff00aa })
        );
        group.add(wingL);
        group.add(wingR);
        group.add(center);
        return group;
      };

      // 3. Dreadnought Boss Cruiser (Large crimson flagship)
      const dreadnoughtGroupTemplate = () => {
        const group = new THREE.Group();
        const hullGeom = new THREE.CylinderGeometry(2.2, 1.6, 0.7, 6);
        const hullMesh = new THREE.Mesh(
          hullGeom,
          new THREE.MeshBasicMaterial({ color: 0xff1a14, wireframe: true })
        );
        const coreMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.6, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xffaa00 })
        );
        group.add(hullMesh);
        group.add(coreMesh);
        return group;
      };

      // 4. Organic Asteroid Geometries
      const asteroidGeometries = [
        new THREE.DodecahedronGeometry(1.0, 0),
        new THREE.IcosahedronGeometry(0.9, 0),
        new THREE.OctahedronGeometry(1.1, 0),
      ];

      const asteroidPalette = [0xd97706, 0xb45309, 0x78716c, 0xea580c, 0xa8a29e];

      for (let i = 0; i < MAX_SHOOTER_ENEMIES; i++) {
        const containerGroup = new THREE.Group();

        const scoutGroup = scoutGroupTemplate();
        const interceptorGroup = interceptorGroupTemplate();
        const dreadnoughtGroup = dreadnoughtGroupTemplate();

        const geomChoice = asteroidGeometries[i % asteroidGeometries.length];
        const colChoice = asteroidPalette[i % asteroidPalette.length];
        const asteroidMesh = new THREE.Mesh(
          geomChoice,
          new THREE.MeshBasicMaterial({ color: colChoice, wireframe: true })
        );

        containerGroup.add(scoutGroup);
        containerGroup.add(interceptorGroup);
        containerGroup.add(dreadnoughtGroup);
        containerGroup.add(asteroidMesh);

        containerGroup.visible = false;
        scene.add(containerGroup);

        shooterEnemies.push({
          group: containerGroup,
          scoutGroup,
          interceptorGroup,
          dreadnoughtGroup,
          asteroidMesh,
          type: 'none', // 'scout' | 'interceptor' | 'cruiser' | 'asteroid'
          active: false,
          hp: 1,
          maxHp: 1,
          scoreValue: 100,
          x: 0,
          y: 0,
          z: -999,
          vx: 0,
          speed: 16,
          radius: 1.0,
          originX: 0,
          patternPhase: 0,
          rotSpeedX: 0,
          rotSpeedY: 0,
          rotSpeedZ: 0,
          hitFlashTimer: 0,
        });
      }

      // Spawns a single randomized shooter enemy with gradual difficulty scaling
      const spawnSingleEnemy = (type, customX = null, customZ = null, customSpeed = null) => {
        const enemy = shooterEnemies.find((e) => !e.active);
        if (!enemy) return;

        const g = gameRef.current;
        // Smooth logarithmic difficulty scaling (starts at 1.0, reaches ~1.25 after 1.5 mins, capped at 1.40)
        const timeScaling = Math.log2(1 + (g.shooterTime || 0) / 45) * 0.14;
        const sectorScaling = Math.min(0.2, ((g.shooterSector || 1) - 1) * 0.05);
        const difficulty = Math.min(1.4, 1.0 + timeScaling + sectorScaling);
        const speedMult = 1.0 + (difficulty - 1.0) * 0.55; // gentle speed boost (up to +22% max)

        enemy.active = true;
        enemy.type = type;
        enemy.group.visible = true;

        enemy.scoutGroup.visible = type === 'scout';
        enemy.interceptorGroup.visible = type === 'interceptor';
        enemy.dreadnoughtGroup.visible = type === 'cruiser';
        enemy.asteroidMesh.visible = type === 'asteroid';
        enemy.hitFlashTimer = 0;

        const startZ = customZ !== null ? customZ : -32 - Math.random() * 8;
        const startX = customX !== null ? customX : (Math.random() - 0.5) * 18;

        enemy.x = startX;
        enemy.originX = startX;
        enemy.y = 0;
        enemy.z = startZ;
        enemy.vx = 0;
        enemy.group.scale.set(1, 1, 1);

        if (type === 'scout') {
          enemy.hp = 1;
          enemy.maxHp = 1;
          enemy.scoreValue = 150;
          enemy.speed = (customSpeed || 19 + Math.random() * 5) * speedMult;
          enemy.radius = 1.0;
          enemy.patternPhase = Math.random() * Math.PI * 2;
        } else if (type === 'interceptor') {
          enemy.hp = 2;
          enemy.maxHp = 2;
          enemy.scoreValue = 250;
          enemy.speed = (customSpeed || 16 + Math.random() * 4) * speedMult;
          enemy.radius = 1.2;
          enemy.patternPhase = Math.random() * Math.PI * 2;
          enemy.vx = (Math.random() - 0.5) * 4.0;
        } else if (type === 'asteroid') {
          // Organic non-uniform shape scaling
          const scaleX = 0.6 + Math.random() * 1.5;
          const scaleY = 0.6 + Math.random() * 1.4;
          const scaleZ = 0.6 + Math.random() * 1.5;
          enemy.asteroidMesh.scale.set(scaleX, scaleY, scaleZ);

          const isBig = Math.max(scaleX, scaleZ) > 1.4;
          enemy.hp = isBig ? 3 : 1;
          enemy.maxHp = enemy.hp;
          enemy.scoreValue = isBig ? 300 : 120;
          enemy.speed = (customSpeed || 12 + Math.random() * 6) * speedMult;
          enemy.radius = Math.max(scaleX, scaleZ) * 0.9;
          enemy.rotSpeedX = (Math.random() - 0.5) * 3.5;
          enemy.rotSpeedY = (Math.random() - 0.5) * 3.5;
          enemy.rotSpeedZ = (Math.random() - 0.5) * 3.5;
          enemy.vx = (Math.random() - 0.5) * 3.0;
        } else if (type === 'cruiser') {
          enemy.hp = 12;
          enemy.maxHp = 12;
          enemy.scoreValue = 1500;
          enemy.speed = 8 * Math.min(1.2, speedMult);
          enemy.radius = 2.4;
          enemy.x = (Math.random() - 0.5) * 8;
          enemy.originX = enemy.x;
          gameRef.current.hasActiveBoss = true;
        }

        enemy.group.position.set(enemy.x, enemy.y, enemy.z);
      };

      // Spawns varied tactical waves & asteroid clusters matching sector progression
      const spawnTacticalWave = () => {
        const g = gameRef.current;
        const currentSector = g.shooterSector || 1;

        const waveTypes =
          currentSector === 1
            ? ['ASTEROID_CLUSTER', 'SCOUT_V_FORMATION', 'INTERCEPTOR_PAIR']
            : [
                'ASTEROID_CLUSTER',
                'SCOUT_V_FORMATION',
                'INTERCEPTOR_PAIR',
                'METEOR_STORM',
                'MIXED_RAID',
              ];

        const choice = waveTypes[Math.floor(Math.random() * waveTypes.length)];

        if (choice === 'ASTEROID_CLUSTER') {
          const count = currentSector === 1 ? 3 : 3 + Math.floor(Math.random() * 2);
          for (let i = 0; i < count; i++) {
            const laneX = -9 + i * (18 / (count - 1)) + (Math.random() - 0.5) * 2;
            const staggerZ = -30 - i * 4 - Math.random() * 6;
            spawnSingleEnemy('asteroid', laneX, staggerZ);
          }
        } else if (choice === 'SCOUT_V_FORMATION') {
          const centerX = (Math.random() - 0.5) * 10;
          spawnSingleEnemy('scout', centerX, -30);
          spawnSingleEnemy('scout', centerX - 3.2, -34);
          spawnSingleEnemy('scout', centerX + 3.2, -34);
        } else if (choice === 'INTERCEPTOR_PAIR') {
          spawnSingleEnemy('interceptor', -8, -32);
          spawnSingleEnemy('interceptor', 8, -32);
        } else if (choice === 'METEOR_STORM') {
          for (let i = 0; i < 4; i++) {
            const rx = (Math.random() - 0.5) * 18;
            spawnSingleEnemy('asteroid', rx, -28 - i * 5, 20);
          }
        } else if (choice === 'MIXED_RAID') {
          spawnSingleEnemy('scout', (Math.random() - 0.5) * 12, -30);
          spawnSingleEnemy('asteroid', (Math.random() - 0.5) * 16, -34);
          spawnSingleEnemy('interceptor', (Math.random() - 0.5) * 14, -38);
        }
      };

      // C. Powerup Drops
      const MAX_POWERUPS = 6;
      const powerupGeom = new THREE.OctahedronGeometry(0.65, 0);
      const powerupTypes = ['triple', 'rapid', 'shield', 'bomb'];
      const powerupColors = {
        triple: 0xccf200,
        rapid: 0x00f0ff,
        shield: 0x39ff14,
        bomb: 0xff0055,
      };

      const powerups = [];
      for (let i = 0; i < MAX_POWERUPS; i++) {
        const mesh = new THREE.Mesh(
          powerupGeom,
          new THREE.MeshBasicMaterial({ wireframe: true, color: 0xccf200 })
        );
        mesh.visible = false;
        scene.add(mesh);
        powerups.push({
          mesh,
          active: false,
          type: 'triple',
          x: 0,
          z: 0,
          radius: 1.2,
        });
      }

      const spawnPowerup = (x, z) => {
        const p = powerups.find((item) => !item.active);
        if (!p) return;
        const type = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
        p.active = true;
        p.type = type;
        p.x = x;
        p.z = z;
        p.mesh.visible = true;
        p.mesh.material.color.setHex(powerupColors[type]);
        p.mesh.position.set(x, 0, z);
      };

      // D. Spark & Explosion Particles System
      const MAX_PARTICLES = 160;
      const particleGeom = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(MAX_PARTICLES * 3);
      particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xccf200,
        size: 0.45,
        transparent: true,
        opacity: 0.9,
      });
      const particleSystem = new THREE.Points(particleGeom, particleMat);
      scene.add(particleSystem);

      const particles = [];
      for (let i = 0; i < MAX_PARTICLES; i++) {
        particles.push({
          active: false,
          x: 0,
          y: 0,
          z: 0,
          vx: 0,
          vy: 0,
          vz: 0,
          life: 0,
          maxLife: 0.5,
        });
      }

      const createExplosion = (ex, ey, ez, count = 20, colorHex = 0xccf200) => {
        particleMat.color.setHex(colorHex);
        let spawned = 0;
        for (let i = 0; i < MAX_PARTICLES && spawned < count; i++) {
          const p = particles[i];
          if (!p.active) {
            p.active = true;
            p.x = ex;
            p.y = ey;
            p.z = ez;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 18 + 4;
            p.vx = Math.cos(angle) * speed;
            p.vy = (Math.random() - 0.5) * speed;
            p.vz = Math.sin(angle) * speed;
            p.life = 0;
            p.maxLife = 0.35 + Math.random() * 0.35;
            spawned++;
          }
        }
      };

      const triggerEmpBomb = () => {
        if (soundRef.current) soundRef.current.playBomb();
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300);

        shooterEnemies.forEach((e) => {
          if (e.active) {
            createExplosion(e.x, e.y, e.z, 15, 0xff0055);
            e.active = false;
            e.group.visible = false;
            if (e.type === 'cruiser') gameRef.current.hasActiveBoss = false;
            const g = gameRef.current;
            g.shooterScore += e.scoreValue;
          }
        });
      };

      // ==========================================
      // 9. EVENT LISTENERS & INPUT HANDLING
      // ==========================================
      const handleKeyDown = (e) => {
        const g = gameRef.current;

        // Space spam detection for secret Easter Egg trigger
        if (e.code === 'Space') {
          const now = Date.now();
          g.spacePressTimes = (g.spacePressTimes || []).filter((t) => now - t < 2200);
          g.spacePressTimes.push(now);

          if (
            g.spacePressTimes.length >= 5 &&
            g.state !== 'easter_transition' &&
            g.state !== 'shooter_playing'
          ) {
            triggerEasterEgg();
            e.preventDefault();
            return;
          }
        }

        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          g.keys.left = true;
          g.hasInteracted = true;
        }
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          g.keys.right = true;
          g.hasInteracted = true;
        }
        if (e.code === 'ArrowUp' || e.code === 'KeyW') {
          g.keys.up = true;
          g.hasInteracted = true;
        }
        if (e.code === 'ArrowDown' || e.code === 'KeyS') {
          g.keys.down = true;
          g.hasInteracted = true;
        }

        if (e.code === 'Space') {
          g.keys.space = true;
          g.hasInteracted = true;

          if (g.state === 'ready' || g.state === 'gameover') {
            startGame();
          } else if (g.state === 'playing' && !g.isJumping) {
            g.isJumping = true;
            g.playerVelY = 14;
            if (soundRef.current) soundRef.current.playJump();
          } else if (g.state === 'shooter_gameover') {
            restartShooter();
          }
          e.preventDefault();
        }
      };

      const handleKeyUp = (e) => {
        const g = gameRef.current;
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') g.keys.left = false;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') g.keys.right = false;
        if (e.code === 'ArrowUp' || e.code === 'KeyW') g.keys.up = false;
        if (e.code === 'ArrowDown' || e.code === 'KeyS') g.keys.down = false;
        if (e.code === 'Space') g.keys.space = false;
      };

      const handleMouseMove = (e) => {
        if ('ontouchstart' in window) return;
        const rect = container.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        const normX = (clientX / rect.width) * 2 - 1;
        const normY = (clientY / rect.height) * 2 - 1;

        const g = gameRef.current;
        g.mouseNormalizedX = normX * 6.5;
        g.mouseNormalizedY = normY * 5.0;
        g.hasInteracted = true;
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
        } else if (g.state === 'shooter_gameover') {
          restartShooter();
        } else if (g.state === 'shooter_playing') {
          g.keys.space = true;
        }
      };

      const handleMouseUp = () => {
        const g = gameRef.current;
        if (g.state === 'shooter_playing') {
          g.keys.space = false;
        }
      };

      // Touch handlers (Mobile)
      let touchStartX = null;
      let touchStartY = null;

      const handleTouchStart = (e) => {
        e.preventDefault();
        const g = gameRef.current;
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const relX = (touch.clientX - rect.left) / rect.width;

        if (g.state === 'ready' || g.state === 'gameover') {
          return;
        }

        g.hasInteracted = true;

        if (g.state === 'shooter_playing') {
          g.keys.space = true;
          touchStartX = touch.clientX;
          touchStartY = touch.clientY;
        } else if (g.state === 'playing') {
          if (relX > 0.65) {
            if (!g.isJumping) {
              g.isJumping = true;
              g.playerVelY = 14;
              if (soundRef.current) soundRef.current.playJump();
            }
          } else {
            touchStartX = touch.clientX;
          }
        }
      };

      const handleTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const g = gameRef.current;

        if (g.state === 'shooter_playing' && touchStartX !== null) {
          const dx = (touch.clientX - touchStartX) / 60;
          const dz = (touch.clientY - touchStartY) / 60;
          g.touchSteerX = Math.max(-10, Math.min(10, dx * 7.5));
          g.touchSteerZ = Math.max(-1, Math.min(8, 4 + dz * 5));
        } else if (g.state === 'playing' && touchStartX !== null) {
          const dx = (touch.clientX - touchStartX) / 80;
          g.touchSteerX = Math.max(-6.2, Math.min(6.2, dx * 6.5));
        }
      };

      const handleTouchEnd = (e) => {
        e.preventDefault();
        touchStartX = null;
        touchStartY = null;
        const g = gameRef.current;
        g.touchSteerX = null;
        g.touchSteerZ = null;
        if (g.state === 'shooter_playing') {
          g.keys.space = false;
        }
      };

      container.style.touchAction = 'none';

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd, { passive: false });

      // Resize handling
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

      // ==========================================
      // 10. MAIN ANIMATION & GAME LOOP
      // ==========================================
      let lastTime = performance.now();
      let totalElapsedTime = 0;
      let lastHudUpdate = 0;

      const animate = (currentTime) => {
        animationFrameId = requestAnimationFrame(animate);

        const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
        lastTime = currentTime;
        totalElapsedTime += delta;

        const g = gameRef.current;

        // ----------------------------------------------------
        // MODE A: ORIGINAL GRID RUNNER
        // ----------------------------------------------------
        if (g.state === 'ready' || g.state === 'playing' || g.state === 'gameover') {
          camera.position.x += (0 - camera.position.x) * 0.1;
          camera.position.y += (3.2 - camera.position.y) * 0.1;
          camera.position.z += (7.5 - camera.position.z) * 0.1;
          camera.lookAt(0, 1.2, -18);

          terrainMesh.visible = true;
          terrainMesh.position.y = -0.4;
          terrainMaterial.opacity = 0.38;
          sunMesh.visible = true;
          thrusterCone.material.opacity = 0.0;

          if (g.state === 'playing') {
            g.speed = Math.min(
              g.maxSpeed,
              g.baseSpeed + Math.log2(1 + g.distance / 120) * 8.5
            );
            g.distance += g.speed * delta;
            g.score += Math.round(g.speed * delta * 1.5 * g.multiplier);

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

          // Player movement & jumping
          const steerSpeed = 22;
          if (g.touchSteerX !== null) {
            g.targetPlayerX = g.touchSteerX;
          } else if (g.keys.left) {
            g.targetPlayerX = Math.max(-6.2, g.targetPlayerX - steerSpeed * delta);
          } else if (g.keys.right) {
            g.targetPlayerX = Math.min(6.2, g.targetPlayerX + steerSpeed * delta);
          } else if (g.hasInteracted) {
            g.targetPlayerX += (g.mouseNormalizedX - g.targetPlayerX) * 0.14;
            g.targetPlayerX = Math.max(-6.2, Math.min(6.2, g.targetPlayerX));
          }

          const diffX = g.targetPlayerX - g.playerX;
          g.playerX += diffX * 0.18;

          shipGroup.rotation.set(0, diffX * 0.15, -diffX * 0.28);
          shipGroup.position.x = g.playerX;
          shipGroup.position.z = 0;

          if (g.isJumping) {
            g.playerVelY -= 36 * delta;
            g.playerY += g.playerVelY * delta;
            if (g.playerY <= 0.8) {
              g.playerY = 0.8;
              g.isJumping = false;
              g.playerVelY = 0;
            }
          } else {
            g.playerY = 0.8 + Math.sin(totalElapsedTime * 6) * 0.08;
          }
          shipGroup.position.y = g.playerY;
          engineMesh.scale.setScalar(0.8 + Math.random() * 0.4);

          // Update terrain
          const pos = terrainGeometry.attributes.position;
          const scrollZ = g.distance * 0.35 + totalElapsedTime * 10;
          for (let i = 0; i < vertexCount; i++) {
            const vx = originalVertices[i * 3];
            const vz = originalVertices[i * 3 + 2];
            const h = calculateHeight(vx, vz - scrollZ, totalElapsedTime);
            pos.array[i * 3 + 1] = h;
          }
          pos.needsUpdate = true;

          // Update & spawn grid entities
          const forwardSpeed = g.state === 'playing' ? g.speed : 18;
          entities.forEach((entity) => {
            if (!entity.active) return;
            entity.z += forwardSpeed * delta;
            entity.mesh.position.z = entity.z;

            if (entity.type === 'byte') {
              entity.byteMesh.rotation.y += delta * 3.5;
              entity.byteMesh.rotation.x += delta * 2.0;
            } else if (entity.type === 'glitch') {
              entity.hazardMesh.rotation.y += delta * 2.0;
              const pulse = 1.0 + Math.sin(totalElapsedTime * 8 + entity.x) * 0.15;
              entity.hazardMesh.scale.set(pulse, pulse, pulse);
            }

            // Collision check
            if (g.state === 'playing' && Math.abs(entity.z - shipGroup.position.z) < 1.1) {
              const distX = Math.abs(entity.x - g.playerX);
              const distY = Math.abs(entity.y - g.playerY);

              if (distX < entity.radius && distY < 1.4) {
                if (entity.type === 'byte') {
                  entity.active = false;
                  entity.byteMesh.visible = false;
                  g.consecutiveGems += 1;
                  g.multiplier = Math.min(4, 1 + Math.floor(g.consecutiveGems / 4));
                  g.score += 250 * g.multiplier;
                  if (soundRef.current) soundRef.current.playCollect();
                } else if (entity.type === 'glitch' && g.invincibleTimer <= 0) {
                  g.shields -= 1;
                  g.consecutiveGems = 0;
                  g.multiplier = 1;
                  g.invincibleTimer = 1.4;
                  g.glitchTimer = 0.35;
                  setShields(g.shields);
                  setIsGlitching(true);

                  if (soundRef.current) soundRef.current.playHit();
                  camera.position.x = (Math.random() - 0.5) * 0.8;
                  camera.position.y = 3.2 + (Math.random() - 0.5) * 0.5;

                  if (g.shields <= 0) {
                    g.state = 'gameover';
                    setGameState('gameover');
                    if (soundRef.current) soundRef.current.playGameOver();
                  }
                }
              }
            }

            if (entity.z > 8) {
              entity.active = false;
              entity.mesh.visible = false;
            }
          });

          spawnZ += forwardSpeed * delta;
          if (spawnZ >= -115) {
            spawnNextEntity(-125 - Math.random() * 8);
            spawnZ = -125;
          }

          const starPos = starGeom.attributes.position;
          for (let i = 0; i < starCount; i++) {
            starPos.array[i * 3 + 2] += forwardSpeed * 0.2 * delta;
            if (starPos.array[i * 3 + 2] > 5) starPos.array[i * 3 + 2] = -140;
          }
          starPos.needsUpdate = true;
        }

        // ----------------------------------------------------
        // MODE B: EASTER EGG TRANSITION (LIFT-OFF INTO SPACE)
        // ----------------------------------------------------
        else if (g.state === 'easter_transition') {
          g.transitionProgress += delta / g.transitionDuration;
          const p = Math.min(1.0, g.transitionProgress);
          const easeOut = Math.sin((p * Math.PI) / 2);
          const easeIn = p * p;

          shipGroup.rotation.x = -Math.PI * 0.45 * easeIn;
          shipGroup.rotation.y = 0;
          shipGroup.rotation.z = (Math.random() - 0.5) * 0.1 * easeIn;
          shipGroup.position.x += (0 - shipGroup.position.x) * 0.1;
          shipGroup.position.y = 0.8 + easeIn * 16.0;
          shipGroup.position.z = -easeIn * 8.0;

          thrusterCone.material.opacity = Math.min(0.9, easeIn * 1.5);
          thrusterCone.scale.set(1 + easeIn * 1.5, 1 + easeIn * 3.0, 1 + easeIn * 1.5);
          engineMesh.scale.setScalar(1.5 + Math.random() * 0.8);

          terrainMesh.position.y = -0.4 - easeIn * 35;
          terrainMaterial.opacity = 0.38 * (1 - easeIn);
          sunMesh.visible = false;

          entities.forEach((e) => {
            if (e.active) {
              e.active = false;
              if (e.mesh) e.mesh.visible = false;
            }
          });

          const starPos = starGeom.attributes.position;
          for (let i = 0; i < starCount; i++) {
            starPos.array[i * 3 + 2] += (120 + easeIn * 450) * delta;
            if (starPos.array[i * 3 + 2] > 20) starPos.array[i * 3 + 2] = -150;
          }
          starPos.needsUpdate = true;

          camera.position.x = 0;
          camera.position.y = defaultCamPos.y + (22.0 - defaultCamPos.y) * easeOut;
          camera.position.z = defaultCamPos.z + (6.0 - defaultCamPos.z) * easeOut;
          camera.lookAt(0, 0, -4);

          if (p >= 1.0) {
            g.state = 'shooter_playing';
            setGameState('shooter_playing');
            g.playerX = 0;
            g.playerY = 0;
            g.playerZ = 6;
            g.targetPlayerX = 0;
            g.targetPlayerZ = 6;
            shipGroup.position.set(0, 0, 6);
            shipGroup.rotation.set(0, 0, 0);
            thrusterCone.material.opacity = 0.4;
            terrainMesh.visible = false;
          }
        }

        // ----------------------------------------------------
        // MODE C: PROCEDURAL SPACE SHOOTER GAMEPLAY
        // ----------------------------------------------------
        else if (g.state === 'shooter_playing' || g.state === 'shooter_gameover') {
          terrainMesh.visible = false;
          sunMesh.visible = false;

          camera.position.set(0, 22.5, 6.5);
          camera.lookAt(0, 0, -3.5);

          const starPos = starGeom.attributes.position;
          for (let i = 0; i < starCount; i++) {
            starPos.array[i * 3 + 2] += 28 * delta;
            if (starPos.array[i * 3 + 2] > 20) starPos.array[i * 3 + 2] = -160;
          }
          starPos.needsUpdate = true;

          if (g.state === 'shooter_playing') {
            if (g.powerupTimer > 0) {
              g.powerupTimer -= delta;
              if (g.powerupTimer <= 0) {
                g.powerupType = null;
                setActivePowerup(null);
              } else {
                setActivePowerup({
                  name:
                    g.powerupType === 'triple'
                      ? 'TRIPLE SPREAD LASER'
                      : 'RAPID OVERDRIVE',
                  timeRemaining: Math.ceil(g.powerupTimer),
                });
              }
            }

            // Player Steering in Space Arena (Bounds: X: [-11, 11], Z: [-1.5, 8.5])
            const moveSpeed = 24;
            if (g.touchSteerX !== null) {
              g.targetPlayerX = g.touchSteerX;
              if (g.touchSteerZ !== null) g.targetPlayerZ = g.touchSteerZ;
            } else {
              if (g.keys.left) g.targetPlayerX -= moveSpeed * delta;
              if (g.keys.right) g.targetPlayerX += moveSpeed * delta;
              if (g.keys.up) g.targetPlayerZ -= moveSpeed * delta;
              if (g.keys.down) g.targetPlayerZ += moveSpeed * delta;

              if (!g.keys.left && !g.keys.right && !g.keys.up && !g.keys.down && g.hasInteracted) {
                g.targetPlayerX += (g.mouseNormalizedX * 1.6 - g.targetPlayerX) * 0.16;
                g.targetPlayerZ += (6.0 + g.mouseNormalizedY * 0.6 - g.targetPlayerZ) * 0.16;
              }
            }

            g.targetPlayerX = Math.max(-11, Math.min(11, g.targetPlayerX));
            g.targetPlayerZ = Math.max(-1.5, Math.min(8.5, g.targetPlayerZ));

            const diffX = g.targetPlayerX - g.playerX;
            const diffZ = g.targetPlayerZ - g.playerZ;
            g.playerX += diffX * 0.22;
            g.playerZ += diffZ * 0.22;
            g.playerY = 0;

            shipGroup.position.set(g.playerX, g.playerY, g.playerZ);
            shipGroup.rotation.set(0, 0, -diffX * 0.18);
            thrusterCone.material.opacity = 0.45;
            engineMesh.scale.setScalar(1.0 + Math.random() * 0.5);

            // Laser Weapons Firing
            g.laserCooldown -= delta;
            const fireInterval = g.powerupType === 'rapid' ? 0.08 : 0.14;

            if (g.keys.space && g.laserCooldown <= 0) {
              g.laserCooldown = fireInterval;
              if (soundRef.current) soundRef.current.playLaser();

              if (g.powerupType === 'triple') {
                fireLaser(g.playerX - 0.4, 0, g.playerZ - 0.8, -0.15, 0xccf200);
                fireLaser(g.playerX, 0, g.playerZ - 1.2, 0.0, 0x00f0ff);
                fireLaser(g.playerX + 0.4, 0, g.playerZ - 0.8, 0.15, 0xccf200);
              } else {
                fireLaser(g.playerX - 0.5, 0, g.playerZ - 0.8, 0.0, 0xccf200);
                fireLaser(g.playerX + 0.5, 0, g.playerZ - 0.8, 0.0, 0xccf200);
              }
            }

            // Time & Sector Survival Progression
            g.shooterTime += delta;
            const timeScaling = Math.log2(1 + g.shooterTime / 45) * 0.14;
            const sectorScaling = Math.min(0.2, (g.shooterSector - 1) * 0.05);
            const currentDiff = Math.min(1.4, 1.0 + timeScaling + sectorScaling);

            const newMultiplier = Math.min(4, 1 + Math.floor(g.shooterTime / 35));
            if (newMultiplier !== g.multiplier) {
              g.multiplier = newMultiplier;
              setMultiplier(newMultiplier);
            }

            // Procedural Wave Spawner with gradual logarithmic difficulty scaling
            g.waveSpawnTimer += delta;
            if (g.waveSpawnTimer >= g.nextWaveDelay) {
              g.waveSpawnTimer = 0;
              const baseDelay = 1.85 + Math.random() * 0.7; // ~1.85s to 2.55s at start
              g.nextWaveDelay = Math.max(1.05, baseDelay / currentDiff); // smoothly scales down to ~1.3s
              spawnTacticalWave();
            }

            // Boss Cruiser Spawning (Maximum ONE active boss at a time!)
            if (
              !g.hasActiveBoss &&
              g.shooterScore > 1200 &&
              Math.floor(g.shooterScore / 1500) >= g.shooterSector
            ) {
              g.shooterSector += 1;
              setSectorWave(g.shooterSector);
              spawnSingleEnemy('cruiser');
            }

            if (currentTime - lastHudUpdate > 180) {
              lastHudUpdate = currentTime;
              setShooterScore(g.shooterScore);
              if (g.shooterScore > g.shooterHighScore) {
                g.shooterHighScore = g.shooterScore;
                setShooterHighScore(g.shooterScore);
                try {
                  localStorage.setItem(
                    'hazem_404_shooter_high_score',
                    g.shooterScore.toString()
                  );
                } catch (_) {}
              }
            }
          }

          // Update Lasers
          lasers.forEach((l) => {
            if (!l.active) return;
            l.mesh.position.x += l.vx * delta;
            l.mesh.position.z += l.vz * delta;

            if (l.mesh.position.z < -42 || Math.abs(l.mesh.position.x) > 18) {
              l.active = false;
              l.mesh.visible = false;
            }
          });

          // Update Shooter Enemies with Organic Randomization
          shooterEnemies.forEach((enemy) => {
            if (!enemy.active) return;

            // Continuous forward movement (never gets stuck at a fixed Z coordinate!)
            enemy.z += enemy.speed * delta;
            enemy.x += (enemy.vx || 0) * delta;

            if (enemy.type === 'scout') {
              enemy.patternPhase += delta * 3.4;
              enemy.x = enemy.originX + Math.sin(enemy.patternPhase) * 3.8;
              enemy.scoutGroup.rotation.y += delta * 3.0;
            } else if (enemy.type === 'interceptor') {
              enemy.patternPhase += delta * 2.5;
              enemy.x = enemy.originX + Math.cos(enemy.patternPhase) * 5.0;
              enemy.interceptorGroup.rotation.z = Math.sin(enemy.patternPhase) * 0.4;
            } else if (enemy.type === 'asteroid') {
              // 3D irregular tumble
              enemy.asteroidMesh.rotation.x += enemy.rotSpeedX * delta;
              enemy.asteroidMesh.rotation.y += enemy.rotSpeedY * delta;
              enemy.asteroidMesh.rotation.z += enemy.rotSpeedZ * delta;
            } else if (enemy.type === 'cruiser') {
              enemy.x = enemy.originX + Math.sin(totalElapsedTime * 1.4) * 6.5;
              enemy.dreadnoughtGroup.rotation.y += delta * 0.8;
            }

            enemy.group.position.set(enemy.x, enemy.y, enemy.z);

            if (enemy.hitFlashTimer > 0) {
              enemy.hitFlashTimer -= delta;
            }

            // Laser Collision
            lasers.forEach((l) => {
              if (!l.active) return;
              const distX = Math.abs(l.mesh.position.x - enemy.x);
              const distZ = Math.abs(l.mesh.position.z - enemy.z);

              if (distX < enemy.radius && distZ < enemy.radius + 0.6) {
                l.active = false;
                l.mesh.visible = false;
                enemy.hp -= l.damage;
                enemy.hitFlashTimer = 0.08;

                createExplosion(l.mesh.position.x, 0, l.mesh.position.z, 6, 0xccf200);

                if (enemy.hp <= 0) {
                  enemy.active = false;
                  enemy.group.visible = false;
                  if (enemy.type === 'cruiser') g.hasActiveBoss = false;
                  g.shooterScore += enemy.scoreValue * (g.multiplier || 1);

                  if (soundRef.current) soundRef.current.playExplosion();

                  const burstColor =
                    enemy.type === 'cruiser'
                      ? 0xff1a14
                      : enemy.type === 'interceptor'
                      ? 0xd946ef
                      : enemy.type === 'asteroid'
                      ? 0xd97706
                      : 0x00f0ff;

                  createExplosion(
                    enemy.x,
                    0,
                    enemy.z,
                    enemy.type === 'cruiser' ? 45 : 18,
                    burstColor
                  );

                  // 25% - 32% chance to drop powerup scaling with survival
                  const dropChance = Math.min(0.32, 0.25 + (g.shooterSector - 1) * 0.02);
                  if (Math.random() < dropChance) {
                    spawnPowerup(enemy.x, enemy.z);
                  }
                }
              }
            });

            // Player Collision
            if (g.state === 'shooter_playing' && enemy.active) {
              const pDistX = Math.abs(g.playerX - enemy.x);
              const pDistZ = Math.abs(g.playerZ - enemy.z);

              if (pDistX < enemy.radius + 0.6 && pDistZ < 1.1) {
                if (g.invincibleTimer <= 0) {
                  g.shields -= 1;
                  setShields(g.shields);
                  g.invincibleTimer = 1.4;
                  setIsGlitching(true);
                  setTimeout(() => setIsGlitching(false), 200);

                  if (soundRef.current) soundRef.current.playHit();
                  createExplosion(g.playerX, 0, g.playerZ, 14, 0xff1a14);

                  if (enemy.type !== 'cruiser') {
                    enemy.active = false;
                    enemy.group.visible = false;
                  }

                  if (g.shields <= 0) {
                    g.state = 'shooter_gameover';
                    setGameState('shooter_gameover');
                    if (soundRef.current) soundRef.current.playGameOver();
                    createExplosion(g.playerX, 0, g.playerZ, 35, 0xff1a14);
                  }
                }
              }
            }

            // Despawn if passed behind player
            if (enemy.z > 14) {
              enemy.active = false;
              enemy.group.visible = false;
              if (enemy.type === 'cruiser') g.hasActiveBoss = false;
            }
          });

          // Update Powerups
          powerups.forEach((p) => {
            if (!p.active) return;
            p.z += 10 * delta;
            p.mesh.position.z = p.z;
            p.mesh.rotation.y += delta * 4.0;
            p.mesh.rotation.x += delta * 2.5;

            if (g.state === 'shooter_playing') {
              const dist = Math.hypot(g.playerX - p.x, g.playerZ - p.z);
              if (dist < 1.4) {
                p.active = false;
                p.mesh.visible = false;
                if (soundRef.current) soundRef.current.playPowerup();
                createExplosion(p.x, 0, p.z, 15, powerupColors[p.type]);

                if (p.type === 'triple') {
                  g.powerupType = 'triple';
                  g.powerupTimer = 12.0;
                  setActivePowerup({ name: 'TRIPLE SPREAD LASER', timeRemaining: 12 });
                } else if (p.type === 'rapid') {
                  g.powerupType = 'rapid';
                  g.powerupTimer = 10.0;
                  setActivePowerup({ name: 'RAPID OVERDRIVE', timeRemaining: 10 });
                } else if (p.type === 'shield') {
                  g.shields = Math.min(5, g.shields + 1);
                  setShields(g.shields);
                } else if (p.type === 'bomb') {
                  triggerEmpBomb();
                }
              }
            }

            if (p.z > 14) {
              p.active = false;
              p.mesh.visible = false;
            }
          });
        }

        // Update Particle Sparks
        const pArr = particleGeom.attributes.position.array;
        particles.forEach((p, idx) => {
          if (!p.active) {
            pArr[idx * 3 + 1] = -999;
            return;
          }
          p.life += delta;
          if (p.life >= p.maxLife) {
            p.active = false;
            pArr[idx * 3 + 1] = -999;
          } else {
            p.x += p.vx * delta;
            p.y += p.vy * delta;
            p.z += p.vz * delta;
            pArr[idx * 3] = p.x;
            pArr[idx * 3 + 1] = p.y;
            pArr[idx * 3 + 2] = p.z;
          }
        });
        particleGeom.attributes.position.needsUpdate = true;

        // Invulnerability Blink
        if (g.invincibleTimer > 0) {
          g.invincibleTimer -= delta;
          shipWireframe.material.opacity =
            Math.sin(totalElapsedTime * 35) > 0 ? 0.95 : 0.15;
        } else {
          shipWireframe.material.opacity = 0.95;
        }

        // Render Scene
        renderer.render(scene, camera);
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('mouseup', handleMouseUp);
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
  }, [startGame, triggerEasterEgg, restartShooter]);

  const isShooterMode =
    gameState === 'easter_transition' ||
    gameState === 'shooter_playing' ||
    gameState === 'shooter_gameover';

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

      {/* ========================================================= */}
      {/* EASTER EGG CELEBRATION OVERLAY BANNER */}
      {/* ========================================================= */}
      {easterEggBanner && (
        <div className="absolute top-16 md:top-20 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none animate-bounce">
          <div className="bg-[#050505]/95 border-2 border-primary-fixed p-4 md:px-8 md:py-5 shadow-[0_0_30px_rgba(204,242,0,0.45)] text-center backdrop-blur-md">
            <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-primary-fixed-dim mb-1 animate-pulse">
              ★ SECRET PROTOCOL OVERRIDE ★
            </div>
            <div className="text-xl md:text-3xl font-extrabold uppercase tracking-tight text-primary-fixed font-[family-name:var(--font-display)] drop-shadow-[0_0_15px_rgba(204,242,0,0.8)]">
              YOU DISCOVERED AN EASTER EGG!
            </div>
            <div className="text-[11px] md:text-xs text-white mt-1 tracking-wider uppercase">
              ARCADE SPACE DEFENDER PROTOCOL UNLOCKED • MASH SPACE TO FIRE LASERS
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TOP HUD BAR */}
      {/* ========================================================= */}
      <header className="absolute top-0 left-0 right-0 z-30 p-3 md:p-5 flex items-center justify-between border-b border-border-primary/60 bg-[#050505]/80 backdrop-blur-md">
        {/* Left: Mode & Status */}
        <div className="flex items-center gap-2 md:gap-3">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${
              isShooterMode
                ? 'bg-cyan-400 animate-ping'
                : 'bg-primary-fixed animate-ping'
            }`}
          />
          <span className="text-[11px] md:text-[12px] font-bold tracking-wider uppercase text-primary">
            {isShooterMode ? (
              <span className="text-cyan-400 font-bold">
                EASTER EGG // ARCADE SPACE DEFENDER [WAVE {sectorWave}]
              </span>
            ) : (
              <span className="text-primary-fixed">
                STATUS: 404 // VOID GRID REACHED
              </span>
            )}
          </span>
        </div>

        {/* Center: Live Telemetry */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[12px]">
          <div>
            <span className="text-text-muted mr-2">SCORE:</span>
            <span className="text-primary font-bold">
              {(isShooterMode ? shooterScore : score).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-text-muted mr-2">BEST:</span>
            <span className="text-primary-fixed-dim">
              {(isShooterMode ? shooterHighScore : highScore).toLocaleString()}
            </span>
          </div>
          {!isShooterMode ? (
            <div>
              <span className="text-text-muted mr-2">BANDWIDTH:</span>
              <span className="text-primary-fixed">{speedGhz} GHz</span>
            </div>
          ) : (
            <div>
              <span className="text-text-muted mr-2">MULTIPLIER:</span>
              <span className="text-cyan-400 font-bold">x{multiplier}</span>
            </div>
          )}
          {isShooterMode && activePowerup && (
            <div className="px-2 py-0.5 bg-primary-fixed text-black font-bold text-[10px] animate-pulse uppercase">
              ⚡ {activePowerup.name} ({activePowerup.timeRemaining}s)
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted mr-1">SHIELD:</span>
            {[1, 2, 3, 4, 5]
              .slice(0, isShooterMode ? 5 : 3)
              .map((s) => (
                <span
                  key={s}
                  className={`inline-block w-2.5 h-2.5 md:w-3 md:h-3 border ${
                    shields >= s
                      ? isShooterMode
                        ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_6px_#00f0ff]'
                        : 'bg-primary-fixed border-primary-fixed'
                      : 'bg-transparent border-border-primary'
                  }`}
                />
              ))}
          </div>
        </div>

        {/* Right: Mode Switchers, Leaderboard, Sound & Warp Home */}
        <div className="flex items-center gap-2 md:gap-3">
          {isShooterMode && (
            <button
              onClick={returnToGrid}
              className="text-[10px] md:text-[11px] uppercase tracking-wider text-primary-fixed hover:text-white transition-colors border border-primary-fixed/50 px-2 py-1 bg-surface"
            >
              [ ← GRID RUNNER ]
            </button>
          )}

          <button
            onClick={() => openLeaderboard(isShooterMode ? 'space_shooter' : 'grid_runner')}
            className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-primary-fixed hover:text-white hover:border-primary-fixed transition-colors border border-primary-fixed/60 px-2.5 py-1 bg-[#050505]/90 shadow-[0_0_10px_rgba(204,242,0,0.15)]"
          >
            [ 🏆 LEADERBOARD ]
          </button>

          <button
            onClick={toggleSound}
            className="text-[10px] md:text-[11px] uppercase tracking-wider text-text-muted hover:text-primary-fixed transition-colors border border-border-primary px-2.5 py-1 bg-surface"
          >
            [ {soundMuted ? 'MUTE' : 'AUDIO'} ]
          </button>

          <Link
            href="/"
            className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-black bg-primary-fixed hover:bg-white transition-colors px-2.5 md:px-3 py-1"
          >
            [ HOME ]
          </Link>
        </div>
      </header>

      {/* MOBILE COMPACT TELEMETRY */}
      <div className="md:hidden absolute top-12 left-2 right-2 z-30 flex justify-between items-center text-[10px] bg-surface/90 px-2.5 py-1.5 border border-border-primary">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-text-muted">SCORE </span>
            <span className="text-primary font-bold">
              {isShooterMode ? shooterScore : score}
            </span>
          </div>
          <button
            onClick={() => openLeaderboard(isShooterMode ? 'space_shooter' : 'grid_runner')}
            className="text-[9px] font-bold uppercase tracking-wider text-primary-fixed border border-primary-fixed/50 px-1.5 py-0.5"
          >
            🏆 RANKS
          </button>
        </div>
        {isShooterMode && activePowerup && (
          <div className="text-primary-fixed font-bold uppercase text-[9px] animate-pulse">
            ⚡ {activePowerup.name}
          </div>
        )}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5]
            .slice(0, isShooterMode ? 4 : 3)
            .map((s) => (
              <span
                key={s}
                className={`inline-block w-2 h-2 border ${
                  shields >= s
                    ? isShooterMode
                      ? 'bg-cyan-400 border-cyan-400'
                      : 'bg-primary-fixed border-primary-fixed'
                    : 'bg-transparent border-border-primary'
                }`}
              />
            ))}
        </div>
      </div>

      {/* MOBILE TOUCH CONTROLS FOR GRID RUNNER */}
      {gameState === 'playing' && (
        <div className="md:hidden absolute bottom-0 left-0 right-0 z-40 flex items-end justify-between p-3 pb-6 pointer-events-none">
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
              className="w-14 h-14 border-2 border-primary-fixed/50 bg-surface/60 backdrop-blur-sm flex items-center justify-center text-primary-fixed text-xl active:bg-primary-fixed/20 active:border-primary-fixed"
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
              className="w-14 h-14 border-2 border-primary-fixed/50 bg-surface/60 backdrop-blur-sm flex items-center justify-center text-primary-fixed text-xl active:bg-primary-fixed/20 active:border-primary-fixed"
              aria-label="Steer Right"
            >
              ▶
            </button>
          </div>

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
            className="w-20 h-14 border-2 border-primary-fixed/50 bg-surface/60 backdrop-blur-sm flex items-center justify-center text-primary-fixed text-xs font-bold uppercase tracking-wider active:bg-primary-fixed/20 active:border-primary-fixed pointer-events-auto"
            aria-label="Jump"
          >
            JUMP ▲
          </button>
        </div>
      )}

      {/* MOBILE TOUCH CONTROLS FOR SPACE SHOOTER */}
      {gameState === 'shooter_playing' && (
        <div className="md:hidden absolute bottom-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
          <div className="bg-[#050505]/80 border border-border-primary px-3 py-1.5 text-[10px] text-text-muted backdrop-blur-sm">
            <span>Drag anywhere to move ship</span>
          </div>

          <button
            onTouchStart={(e) => {
              e.stopPropagation();
              gameRef.current.keys.space = true;
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              gameRef.current.keys.space = false;
            }}
            className="w-24 h-16 border-2 border-cyan-400 bg-cyan-950/40 backdrop-blur-sm flex items-center justify-center text-cyan-400 font-bold text-xs uppercase tracking-wider active:bg-cyan-400 active:text-black pointer-events-auto shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            aria-label="Fire Lasers"
          >
            FIRE 💥
          </button>
        </div>
      )}

      {/* CENTER OVERLAY: READY / IDLE STATE (GRID RUNNER) */}
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

            {/* Action Buttons: Row 1 (Start & Projects on 1 line), Row 2 (Leaderboard underneath) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
              <button
                onClick={startGame}
                className="w-full sm:flex-1 font-bold uppercase tracking-wider text-black bg-primary-fixed hover:bg-white transition-colors px-6 py-3 text-[13px] whitespace-nowrap text-center"
              >
                <span className="hidden sm:inline">[ START GRID MISSION (SPACE) ]</span>
                <span className="sm:hidden">[ TAP TO START ]</span>
              </button>
              <Link
                href="/projects"
                className="w-full sm:w-auto font-medium uppercase tracking-wider text-text-muted hover:text-primary hover:border-primary transition-colors border border-border-primary bg-surface-container-high px-6 py-3 text-[13px] whitespace-nowrap text-center"
              >
                [ VIEW PROJECTS ]
              </Link>
            </div>

            <div className="mb-6">
              <button
                onClick={() => openLeaderboard('grid_runner')}
                className="w-full font-medium uppercase tracking-wider text-primary-fixed hover:text-white hover:border-primary-fixed transition-colors border border-primary-fixed/50 bg-surface hover:bg-primary-fixed/10 py-2.5 text-[12px] whitespace-nowrap text-center"
              >
                [ 🏆 VIEW GLOBAL LEADERBOARD ]
              </button>
            </div>

            {/* Controls Info Guide — Desktop */}
            <div className="hidden sm:grid pt-3 border-t border-border-primary/80 grid-cols-3 gap-3 text-[11px] text-text-dim text-left">
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
          </div>
        </div>
      )}

      {/* CENTER OVERLAY: GAME OVER STATE (GRID RUNNER) */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 pointer-events-none">
          <div className="max-w-md w-full bg-surface/95 border border-red-500/50 p-6 md:p-8 backdrop-blur-md text-center pointer-events-auto shadow-2xl">
            <div className="text-[11px] uppercase tracking-[0.2em] text-red-400 mb-2 font-bold animate-pulse">
              SIGNAL TERMINATED // SHIELD DEPLETED
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase text-primary mb-4 tracking-tight">
              GRID COLLISION
            </h2>

            <div className="bg-surface-container-high border border-border-primary p-4 mb-4 grid grid-cols-2 gap-4 text-left">
              <div>
                <div className="text-[10px] uppercase text-text-muted">FINAL RECOVERY:</div>
                <div className="text-2xl font-bold text-primary">{score.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-text-muted">ALL-TIME BEST:</div>
                <div className="text-2xl font-bold text-primary-fixed">{highScore.toLocaleString()}</div>
              </div>
            </div>

            {/* Global Leaderboard Submission Form */}
            {score > 0 && !scoreSubmitted && (
              <div className="bg-surface border border-primary-fixed/40 p-3 mb-4 text-left">
                <div className="text-[10px] font-bold uppercase tracking-wider text-primary-fixed mb-1.5">
                  ★ RECORD RUN IN GLOBAL ARCHIVES
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={16}
                    value={pilotCallsign}
                    onChange={(e) => setPilotCallsign(e.target.value.toUpperCase())}
                    placeholder="CALLSIGN (MAX 16)"
                    className="flex-1 bg-surface-container-highest border border-border-primary px-3 py-1.5 text-xs text-primary font-mono font-bold tracking-wider uppercase focus:outline-none focus:border-primary-fixed"
                  />
                  <button
                    disabled={isSubmittingScore}
                    onClick={() => submitScore('grid_runner', score, multiplier)}
                    className="bg-primary-fixed text-black font-bold text-xs uppercase px-4 py-1.5 hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {isSubmittingScore ? 'SAVING...' : '[ SUBMIT ]'}
                  </button>
                </div>
              </div>
            )}

            {scoreSubmitted && (
              <div className="bg-primary-fixed/15 border border-primary-fixed p-2.5 mb-4 text-xs font-bold text-primary-fixed flex items-center justify-between">
                <span>★ RECORD SAVED IN SUPABASE ARCHIVES!</span>
                {submissionRank && <span>RANK #{submissionRank}</span>}
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <button
                onClick={startGame}
                className="w-full font-bold uppercase tracking-wider text-black bg-primary-fixed hover:bg-white transition-colors py-3 text-[13px]"
              >
                [ REBOOT SYSTEM (SPACE) ]
              </button>
              <button
                onClick={() => openLeaderboard('grid_runner')}
                className="w-full font-bold uppercase tracking-wider text-primary-fixed hover:text-white border border-primary-fixed/50 hover:bg-primary-fixed/10 transition-colors py-2 text-[12px]"
              >
                [ 🏆 VIEW GLOBAL LEADERBOARD ]
              </button>
              <div className="grid grid-cols-3 gap-2 mt-1">
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

      {/* CENTER OVERLAY: GAME OVER STATE (SPACE SHOOTER) */}
      {gameState === 'shooter_gameover' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 pointer-events-none">
          <div className="max-w-md w-full bg-surface/95 border-2 border-cyan-400/60 p-6 md:p-8 backdrop-blur-md text-center pointer-events-auto shadow-[0_0_40px_rgba(0,240,255,0.3)]">
            <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-400 mb-2 font-bold animate-pulse">
              SECTOR OVERRUN // DEFENDER DOWN
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-extrabold uppercase text-primary mb-4 tracking-tight">
              MISSION DEFEAT
            </h2>

            <div className="bg-surface-container-high border border-border-primary p-4 mb-4 grid grid-cols-2 gap-4 text-left">
              <div>
                <div className="text-[10px] uppercase text-text-muted">SECTOR SCORE:</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {shooterScore.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-text-muted">BEST DEFENDER:</div>
                <div className="text-2xl font-bold text-primary-fixed">
                  {shooterHighScore.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Global Leaderboard Submission Form */}
            {shooterScore > 0 && !scoreSubmitted && (
              <div className="bg-cyan-950/40 border border-cyan-400/50 p-3 mb-4 text-left shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 mb-1.5">
                  ★ RECORD DEFENDER RUN IN ARCHIVES
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={16}
                    value={pilotCallsign}
                    onChange={(e) => setPilotCallsign(e.target.value.toUpperCase())}
                    placeholder="CALLSIGN (MAX 16)"
                    className="flex-1 bg-[#050505] border border-cyan-400/60 px-3 py-1.5 text-xs text-cyan-300 font-mono font-bold tracking-wider uppercase focus:outline-none focus:border-cyan-300"
                  />
                  <button
                    disabled={isSubmittingScore}
                    onClick={() => submitScore('space_shooter', shooterScore, sectorWave)}
                    className="bg-cyan-400 text-black font-bold text-xs uppercase px-4 py-1.5 hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {isSubmittingScore ? 'SAVING...' : '[ SUBMIT ]'}
                  </button>
                </div>
              </div>
            )}

            {scoreSubmitted && (
              <div className="bg-cyan-950/60 border border-cyan-400 p-2.5 mb-4 text-xs font-bold text-cyan-300 flex items-center justify-between shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                <span>★ RECORD SAVED IN SUPABASE ARCHIVES!</span>
                {submissionRank && <span>RANK #{submissionRank}</span>}
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <button
                onClick={restartShooter}
                className="w-full font-bold uppercase tracking-wider text-black bg-cyan-400 hover:bg-white transition-colors py-3 text-[13px] shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              >
                [ REDEPLOY FIGHTER (SPACE) ]
              </button>
              <button
                onClick={() => openLeaderboard('space_shooter')}
                className="w-full font-bold uppercase tracking-wider text-cyan-400 hover:text-white border border-cyan-400/50 hover:bg-cyan-400/10 transition-colors py-2 text-[12px]"
              >
                [ 🏆 VIEW GLOBAL LEADERBOARD ]
              </button>
              <button
                onClick={returnToGrid}
                className="w-full font-medium uppercase tracking-wider text-primary-fixed border border-primary-fixed/50 hover:bg-primary-fixed/10 transition-colors py-2 text-[12px]"
              >
                [ ← RETURN TO 404 GRID ]
              </button>
              <Link
                href="/"
                className="text-center text-[11px] uppercase text-text-muted hover:text-primary border border-border-primary py-2 bg-surface hover:bg-surface-hover transition-colors"
              >
                [ WARP HOME ]
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GLOBAL LEADERBOARD MODAL OVERLAY */}
      {/* ========================================================= */}
      {showLeaderboardModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-2xl w-full bg-[#080808] border-2 border-primary-fixed p-5 md:p-7 shadow-[0_0_50px_rgba(204,242,0,0.3)] text-primary">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-primary">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-lg md:text-xl font-extrabold uppercase tracking-tight text-primary-fixed">
                    GLOBAL PILOT ARCHIVES
                  </h2>
                  <div className="text-[10px] text-text-muted uppercase tracking-widest">
                    POWERED BY SUPABASE DATABASE
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowLeaderboardModal(false)}
                className="text-xs uppercase text-text-muted hover:text-primary-fixed border border-border-primary hover:border-primary-fixed px-2.5 py-1 transition-colors"
              >
                [ ESC / CLOSE ✕ ]
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => {
                  setLeaderboardTab('space_shooter');
                  fetchLeaderboard('space_shooter');
                }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                  leaderboardTab === 'space_shooter'
                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                    : 'bg-surface border-border-primary text-text-muted hover:text-primary'
                }`}
              >
                ★ SPACE DEFENDER ARCADE
              </button>
              <button
                onClick={() => {
                  setLeaderboardTab('grid_runner');
                  fetchLeaderboard('grid_runner');
                }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                  leaderboardTab === 'grid_runner'
                    ? 'bg-primary-fixed/15 border-primary-fixed text-primary-fixed shadow-[0_0_15px_rgba(204,242,0,0.25)]'
                    : 'bg-surface border-border-primary text-text-muted hover:text-primary'
                }`}
              >
                ✦ 404 GRID RUNNER
              </button>
            </div>

            {/* Notice / Setup Banner if table is empty or unconfigured */}
            {leaderboardNotice && (
              <div className="bg-amber-950/40 border border-amber-500/50 p-2.5 mb-3 text-[11px] text-amber-300 text-left">
                ℹ {leaderboardNotice}
              </div>
            )}

            {/* Table / List Container */}
            <div className="min-h-[220px] max-h-[360px] overflow-y-auto border border-border-primary bg-surface/50 font-mono text-xs">
              {isLoadingLeaderboard ? (
                <div className="py-16 text-center text-text-muted animate-pulse">
                  <div className="text-2xl mb-2">⚡</div>
                  SYNCING QUANTUM RECORDS FROM SUPABASE...
                </div>
              ) : leaderboardData.length === 0 ? (
                <div className="py-16 text-center text-text-muted">
                  <div className="text-2xl mb-2">🚀</div>
                  NO FLIGHT LOGS RECORDED YET. BE THE FIRST ACE PILOT!
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-primary bg-surface-container-high text-text-muted text-[10px] uppercase">
                      <th className="py-2.5 px-3">RANK</th>
                      <th className="py-2.5 px-3">CALLSIGN</th>
                      <th className="py-2.5 px-3 text-right">SCORE</th>
                      <th className="py-2.5 px-3 text-center">
                        {leaderboardTab === 'space_shooter' ? 'WAVE' : 'MULT'}
                      </th>
                      <th className="py-2.5 px-3 text-right hidden sm:table-cell">DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((item, idx) => {
                      const isTop1 = idx === 0;
                      const isTop2 = idx === 1;
                      const isTop3 = idx === 2;

                      return (
                        <tr
                          key={item.id || idx}
                          className={`border-b border-border-primary/50 transition-colors ${
                            isTop1
                              ? 'bg-yellow-500/10 text-yellow-300 font-bold'
                              : isTop2
                              ? 'bg-slate-300/10 text-slate-200 font-semibold'
                              : isTop3
                              ? 'bg-amber-600/10 text-amber-300 font-semibold'
                              : 'hover:bg-surface-hover text-text-primary'
                          }`}
                        >
                          <td className="py-2 px-3 font-bold">
                            {isTop1 ? '🥇 #1' : isTop2 ? '🥈 #2' : isTop3 ? '🥉 #3' : `#${idx + 1}`}
                          </td>
                          <td className="py-2 px-3 tracking-wider font-bold">
                            {item.player_name || 'ANONYMOUS'}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-primary-fixed">
                            {Number(item.score).toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-center text-text-muted">
                            {item.sector ? `${item.sector}` : '1'}
                          </td>
                          <td className="py-2 px-3 text-right text-text-dim text-[10px] hidden sm:table-cell">
                            {item.created_at
                              ? new Date(item.created_at).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'RECENT'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-primary text-xs">
              <button
                onClick={() => fetchLeaderboard(leaderboardTab)}
                className="text-text-muted hover:text-primary-fixed transition-colors uppercase flex items-center gap-1.5 text-[11px]"
              >
                <span>↻</span> REFRESH SCORES
              </button>

              <button
                onClick={() => setShowLeaderboardModal(false)}
                className="font-bold uppercase text-black bg-primary-fixed hover:bg-white px-5 py-2 transition-colors text-[12px]"
              >
                [ RESUME GAME ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CONTROLS HINT — DESKTOP ONLY */}
      {gameState === 'playing' && (
        <div className="hidden md:flex absolute bottom-4 left-0 right-0 z-20 pointer-events-none justify-center">
          <div className="bg-[#050505]/80 border border-border-primary px-4 py-1.5 text-[11px] text-text-muted backdrop-blur-sm">
            <span className="text-primary-fixed mr-2">✦ TIP:</span>
            <span>
              Use [A / D] or Mouse to steer • [SPACE] to jump hazards • Multiplier: <strong className="text-primary-fixed">x{multiplier}</strong>
            </span>
          </div>
        </div>
      )}

      {gameState === 'shooter_playing' && (
        <div className="hidden md:flex absolute bottom-4 left-0 right-0 z-20 pointer-events-none justify-center">
          <div className="bg-[#050505]/80 border border-cyan-400/50 px-4 py-1.5 text-[11px] text-cyan-300 backdrop-blur-sm shadow-[0_0_12px_rgba(0,240,255,0.2)]">
            <span className="text-primary-fixed mr-2">★ EASTER EGG:</span>
            <span>
              [A/D/W/S] or Mouse to Move • Hold [SPACE] or Click to Fire Blasters • Shoot orbs for Powerups!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
