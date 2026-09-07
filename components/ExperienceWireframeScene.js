'use client';

import { memo, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { animate } from 'animejs';
import * as THREE from 'three';

const LIME = '#ccf200';
const WHITE = '#f4f4f0';
const MUTED = '#59604b';

function WireMaterial({ color = LIME, opacity = 0.68 }) {
  return (
    <meshBasicMaterial
      color={color}
      wireframe
      transparent
      opacity={opacity}
      blending={THREE.AdditiveBlending}
    />
  );
}

function ConnectionLines({ points, color = LIME, opacity = 0.24 }) {
  const geometry = useMemo(() => {
    const buffer = new THREE.BufferGeometry();
    buffer.setFromPoints(points.map((point) => new THREE.Vector3(...point)));
    return buffer;
  }, [points]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

function Inspectable({
  children,
  position = [0, 0, 0],
  bounds = [1, 1, 1],
  label,
  description,
  onInspect,
  objectRef,
}) {
  const groupRef = useRef(null);
  const highlightRef = useRef(null);

  const setRef = (node) => {
    groupRef.current = node;
    if (objectRef) objectRef.current = node;
  };

  return (
    <group
      ref={setRef}
      position={position}
      onPointerOver={(event) => {
        event.stopPropagation();
        groupRef.current?.scale.setScalar(1.1);
        if (highlightRef.current) highlightRef.current.visible = true;
        onInspect?.({ label, description });
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        groupRef.current?.scale.setScalar(1);
        if (highlightRef.current) highlightRef.current.visible = false;
        onInspect?.(null);
      }}
    >
      <mesh scale={bounds}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
      {children}
      <mesh ref={highlightRef} scale={bounds} visible={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={WHITE} wireframe transparent opacity={0.34} />
      </mesh>
    </group>
  );
}

function MovingPacket({
  start,
  end,
  offset = 0,
  speed = 0.24,
  reverse = false,
  color = LIME,
  reducedMotion,
  label = 'MOVING SIGNAL',
  description = 'A processed signal moving between parts of the system.',
  onInspect,
}) {
  const packetRef = useRef(null);
  const packetMaterialRef = useRef(null);
  const hoveredRef = useRef(false);
  const startPoint = useMemo(() => new THREE.Vector3(...start), [start]);
  const endPoint = useMemo(() => new THREE.Vector3(...end), [end]);
  const pathTransform = useMemo(() => {
    const direction = endPoint.clone().sub(startPoint);
    const midpoint = startPoint.clone().add(endPoint).multiplyScalar(0.5);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize()
    );

    return { midpoint, quaternion, length: direction.length() };
  }, [endPoint, startPoint]);

  const handlePointerOver = (event) => {
    event.stopPropagation();
    hoveredRef.current = true;
    packetMaterialRef.current?.color.set(WHITE);
    onInspect?.({ label, description });
  };

  const handlePointerOut = (event) => {
    event.stopPropagation();
    hoveredRef.current = false;
    packetMaterialRef.current?.color.set(color);
    onInspect?.(null);
  };

  useFrame((state) => {
    if (!packetRef.current) return;

    const rawProgress = reducedMotion ? 0.5 : (state.clock.elapsedTime * speed + offset) % 1;
    const progress = reverse ? 1 - rawProgress : rawProgress;
    packetRef.current.position.lerpVectors(startPoint, endPoint, progress);

    if (!reducedMotion) {
      const pulse = (0.85 + Math.sin(progress * Math.PI) * 0.45) * (hoveredRef.current ? 1.7 : 1);
      packetRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <mesh
        position={pathTransform.midpoint}
        quaternion={pathTransform.quaternion}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[0.14, 0.14, pathTransform.length, 8, 1, true]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
      <mesh ref={packetRef}>
        <octahedronGeometry args={[0.09, 0]} />
        <meshBasicMaterial ref={packetMaterialRef} color={color} />
      </mesh>
    </group>
  );
}

function PrivateDataset({ values }) {
  return (
    <group>
      {values.map((height, index) => (
        <mesh key={index} position={[(index - 1.5) * 0.095, height * 0.045, 0]}>
          <boxGeometry args={[0.06, height * 0.09, 0.06]} />
          <meshBasicMaterial color={MUTED} transparent opacity={0.9} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.012, 4, 28]} />
        <meshBasicMaterial color={MUTED} transparent opacity={0.48} />
      </mesh>
    </group>
  );
}

function FederatedScene({ motionRef, reducedMotion, onInspect }) {
  const clients = [
    { position: [-2.05, 1.22, 0], data: [2, 4, 1, 3] },
    { position: [2.05, 1.22, 0], data: [4, 1, 3, 2] },
    { position: [-2.05, -1.22, 0], data: [1, 3, 4, 2] },
    { position: [2.05, -1.22, 0], data: [3, 2, 1, 4] },
  ];
  const center = [0, 0, 0];
  const connections = clients.flatMap(({ position }) => [position, center]);

  return (
    <group>
      <ConnectionLines points={connections} opacity={0.3} />

      <Inspectable
        objectRef={motionRef}
        bounds={[1.9, 1.9, 1.9]}
        label="AGGREGATION SERVER"
        description="Combines client model updates into one improved global model; it never receives the clients' raw data."
        onInspect={onInspect}
      >
        <mesh>
          <dodecahedronGeometry args={[0.72, 0]} />
          <WireMaterial color={WHITE} opacity={0.72} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.95, 0.018, 5, 52]} />
          <meshBasicMaterial color={LIME} transparent opacity={0.55} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.95, 0.012, 5, 52]} />
          <meshBasicMaterial color={LIME} transparent opacity={0.28} />
        </mesh>
      </Inspectable>

      {clients.map(({ position, data }, index) => (
        <group key={index} position={position}>
          <Inspectable
            bounds={[0.95, 0.95, 0.65]}
            label={`CLIENT MODEL ${index + 1}`}
            description="A local model trains against this client's own data before producing a shareable parameter update."
            onInspect={onInspect}
          >
            <mesh>
              <icosahedronGeometry args={[0.43, 1]} />
              <WireMaterial opacity={0.78} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.57, 0.012, 4, 34]} />
              <meshBasicMaterial color={MUTED} transparent opacity={0.72} />
            </mesh>
          </Inspectable>
          <Inspectable
            position={[0, -0.62, 0]}
            bounds={[0.72, 0.55, 0.5]}
            label="PRIVATE LOCAL DATA"
            description="The bars represent a non-identical local data distribution. These records remain inside the client."
            onInspect={onInspect}
          >
            <PrivateDataset values={data} />
          </Inspectable>
        </group>
      ))}

      {clients.map(({ position }, index) => (
        <MovingPacket
          key={`snapshot-${index}`}
          start={position}
          end={center}
          offset={index * 0.19}
          speed={0.2}
          color={LIME}
          reducedMotion={reducedMotion}
          label="MODEL SNAPSHOT"
          description="A client sends learned parameters or weight changes to the aggregator—not its private examples."
          onInspect={onInspect}
        />
      ))}
      {clients.map(({ position }, index) => (
        <MovingPacket
          key={`global-${index}`}
          start={position}
          end={center}
          offset={0.45 + index * 0.17}
          speed={0.16}
          reverse
          color={WHITE}
          reducedMotion={reducedMotion}
          label="UPDATED GLOBAL MODEL"
          description="After aggregation, the shared model returns to each client to begin the next local training round."
          onInspect={onInspect}
        />
      ))}
    </group>
  );
}

function AnalyticsScene({ motionRef, reducedMotion, onInspect }) {
  const events = [
    [-2.55, 1.15, 0], [-2.68, 0.48, 0], [-2.5, -0.18, 0], [-2.65, -0.85, 0],
  ];
  const journey = [[-1.72, 0.75, 0], [-1.2, 0.25, 0], [-0.72, -0.25, 0], [-0.25, 0.18, 0]];
  const clusters = [[0.75, 0.82, 0], [0.78, -0.72, 0], [1.25, 0.08, 0]];
  const insight = [2.45, 0.08, 0];
  const lines = [
    ...events.flatMap((event, index) => [event, journey[index]]),
    ...journey.slice(0, -1).flatMap((point, index) => [point, journey[index + 1]]),
    ...clusters.flatMap((cluster) => [journey[3], cluster, cluster, insight]),
  ];

  return (
    <group>
      <ConnectionLines points={lines} opacity={0.26} />
      {events.map((position, index) => (
        <Inspectable
          key={index}
          position={position}
          bounds={[0.46, 0.46, 0.46]}
          label="SESSION EVENT"
          description="A raw interaction signal from the product analytics stream—such as a view, action, or transition."
          onInspect={onInspect}
        >
          <mesh>
            <boxGeometry args={[0.18, 0.18, 0.18]} />
            <meshBasicMaterial color={index % 2 ? MUTED : LIME} />
          </mesh>
        </Inspectable>
      ))}
      {journey.map((position, index) => (
        <Inspectable
          key={index}
          position={position}
          bounds={[0.55, 0.55, 0.55]}
          label="RECONSTRUCTED JOURNEY"
          description="Ordered events are connected into a readable path through the product instead of isolated clicks."
          onInspect={onInspect}
        >
          <mesh>
            <octahedronGeometry args={[0.18 + index * 0.025, 0]} />
            <WireMaterial opacity={0.72} />
          </mesh>
        </Inspectable>
      ))}
      <group ref={motionRef}>
        {clusters.map((position, index) => (
          <Inspectable
            key={index}
            position={position}
            bounds={[0.72, 0.72, 0.72]}
            label="BEHAVIOR CLUSTER"
            description="Journeys with similar patterns are grouped so recurring usage modes and friction points become visible."
            onInspect={onInspect}
          >
            <mesh rotation={[index * 0.4, index * 0.25, 0]}>
              <torusKnotGeometry args={[0.23, 0.055, 42, 5]} />
              <WireMaterial color={index === 2 ? WHITE : LIME} opacity={0.68} />
            </mesh>
          </Inspectable>
        ))}
      </group>
      <Inspectable
        position={insight}
        bounds={[0.9, 1.1, 0.42]}
        label="PRODUCT INSIGHT"
        description="The final analytical output summarizes behavior into evidence that can guide product and UX decisions."
        onInspect={onInspect}
      >
        <mesh scale={[0.62, 0.85, 0.12]}>
          <boxGeometry args={[1, 1, 1]} />
          <WireMaterial color={WHITE} opacity={0.62} />
        </mesh>
        {[0.2, 0.38, 0.64, 0.48].map((height, index) => (
          <mesh key={index} position={[-0.35 + index * 0.23, -0.28 + height / 2, 0.09]}>
            <boxGeometry args={[0.1, height, 0.05]} />
            <meshBasicMaterial color={LIME} transparent opacity={0.8} />
          </mesh>
        ))}
      </Inspectable>
      <MovingPacket start={events[0]} end={journey[0]} offset={0.1} reducedMotion={reducedMotion} label="EVENT STREAM" description="A raw session signal entering the journey reconstruction pipeline." onInspect={onInspect} />
      <MovingPacket start={journey[0]} end={journey[3]} offset={0.3} reducedMotion={reducedMotion} label="JOURNEY SIGNAL" description="A reconstructed path moving toward pattern analysis." onInspect={onInspect} />
      <MovingPacket start={clusters[1]} end={insight} offset={0.6} color={WHITE} reducedMotion={reducedMotion} label="ANALYTICAL OUTPUT" description="A cluster-derived finding moving into the insight view." onInspect={onInspect} />
    </group>
  );
}

function OperationsScene({ motionRef, reducedMotion, onInspect }) {
  const endpoints = [[-2.45, 1.12, 0], [-2.55, 0.15, 0], [-2.38, -0.9, 0]];
  const server = [-0.55, 0.1, 0];
  const inventory = [[1.32, -0.92, 0], [1.82, -0.92, 0], [2.32, -0.92, 0]];
  const monitor = [2.0, 0.75, 0];
  const lines = [
    ...endpoints.flatMap((point) => [point, server]),
    server, monitor,
    ...inventory.flatMap((point) => [server, point]),
  ];

  return (
    <group>
      <ConnectionLines points={lines} opacity={0.28} />
      {endpoints.map((position, index) => (
        <Inspectable
          key={index}
          position={position}
          bounds={[1.15, 0.9, 0.45]}
          label="MANAGED ENDPOINT"
          description="A staff workstation connected to maintained internal software and supported through daily IT operations."
          onInspect={onInspect}
        >
          <mesh scale={[0.48, 0.33, 0.08]}>
            <boxGeometry args={[1, 1, 1]} />
            <WireMaterial opacity={0.72} />
          </mesh>
          <mesh position={[0, -0.25, 0]} scale={[0.18, 0.04, 0.06]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={MUTED} />
          </mesh>
        </Inspectable>
      ))}

      <Inspectable
        position={server}
        objectRef={motionRef}
        bounds={[1.85, 2.3, 1.3]}
        label="SECURED SERVER CORE"
        description="The maintained server stack keeps operational software available while the surrounding ring represents its security boundary."
        onInspect={onInspect}
      >
        {[-0.48, 0, 0.48].map((y, index) => (
          <group key={y} position={[0, y, 0]}>
            <mesh scale={[0.72, 0.18, 0.38]}>
              <boxGeometry args={[1, 1, 1]} />
              <WireMaterial color={index === 1 ? WHITE : LIME} opacity={0.78} />
            </mesh>
            <mesh position={[0.52, 0, 0.4]}>
              <sphereGeometry args={[0.045, 6, 6]} />
              <meshBasicMaterial color={LIME} />
            </mesh>
          </group>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.05, 0.025, 5, 52]} />
          <meshBasicMaterial color={LIME} transparent opacity={0.58} />
        </mesh>
      </Inspectable>

      <Inspectable
        position={monitor}
        bounds={[1.05, 0.85, 0.4]}
        label="OPERATIONS MONITOR"
        description="System health and service continuity are observed so issues can be caught before they disrupt election operations."
        onInspect={onInspect}
      >
        <mesh scale={[0.72, 0.52, 0.08]}>
          <boxGeometry args={[1, 1, 1]} />
          <WireMaterial color={WHITE} opacity={0.62} />
        </mesh>
        <ConnectionLines
          points={[[[-0.3, -0.05, 0.09], [-0.12, 0.12, 0.09]], [[-0.12, 0.12, 0.09], [0.06, 0.02, 0.09]], [[0.06, 0.02, 0.09], [0.32, 0.25, 0.09]]].flat()}
          opacity={0.8}
        />
      </Inspectable>

      {inventory.map((position, index) => (
        <Inspectable
          key={index}
          position={position}
          bounds={[0.58, 0.58, 0.58]}
          label="IT INVENTORY ASSET"
          description="Tracked hardware and infrastructure inventory supports maintenance, accountability, and operational readiness."
          onInspect={onInspect}
        >
          <mesh>
            <boxGeometry args={[0.32, 0.32, 0.32]} />
            <WireMaterial color={index === 1 ? WHITE : MUTED} opacity={0.68} />
          </mesh>
        </Inspectable>
      ))}
      <MovingPacket start={endpoints[1]} end={server} offset={0.1} reducedMotion={reducedMotion} label="SUPPORTED REQUEST" description="A workstation request moving toward the maintained internal system." onInspect={onInspect} />
      <MovingPacket start={server} end={monitor} offset={0.45} color={WHITE} reducedMotion={reducedMotion} label="HEALTH SIGNAL" description="Operational telemetry used to verify that services remain healthy and available." onInspect={onInspect} />
      <MovingPacket start={server} end={inventory[1]} offset={0.7} reducedMotion={reducedMotion} label="ASSET UPDATE" description="A maintenance event being reflected in the infrastructure inventory." onInspect={onInspect} />
    </group>
  );
}

function CommerceScene({ motionRef, reducedMotion, onInspect }) {
  const storefront = [-2.4, 0.15, 0];
  const catalog = [-0.8, 0.15, 0];
  const cart = [0.85, 0.15, 0];
  const order = [2.35, 0.15, 0];
  const route = [storefront, catalog, catalog, cart, cart, order];

  return (
    <group>
      <ConnectionLines points={route} opacity={0.38} />
      <Inspectable
        position={storefront}
        bounds={[1.15, 1, 0.42]}
        label="STOREFRONT"
        description="The customer-facing interface translates the client's requirements into a browsable shopping experience."
        onInspect={onInspect}
      >
        <mesh scale={[0.78, 0.62, 0.08]}>
          <boxGeometry args={[1, 1, 1]} />
          <WireMaterial opacity={0.78} />
        </mesh>
        <mesh position={[0, 0.42, 0]} scale={[0.82, 0.06, 0.1]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={LIME} />
        </mesh>
      </Inspectable>

      <Inspectable
        position={catalog}
        bounds={[0.95, 0.95, 0.52]}
        label="PRODUCT CATALOG"
        description="Reusable product views organize inventory into a consistent, maintainable interface layer."
        onInspect={onInspect}
      >
        {[-0.24, 0.24].flatMap((x) => [-0.24, 0.24].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0]}>
            <boxGeometry args={[0.34, 0.34, 0.16]} />
            <WireMaterial color={WHITE} opacity={0.54} />
          </mesh>
        )))}
      </Inspectable>

      <Inspectable
        position={cart}
        objectRef={motionRef}
        bounds={[1.1, 1.1, 1.1]}
        label="CART STATE"
        description="Selected products are collected into a persistent transaction state before checkout."
        onInspect={onInspect}
      >
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.72, 0.72, 0.72]} />
          <WireMaterial opacity={0.82} />
        </mesh>
        <mesh scale={0.44}>
          <octahedronGeometry args={[0.72, 0]} />
          <WireMaterial color={WHITE} opacity={0.36} />
        </mesh>
      </Inspectable>

      <Inspectable
        position={order}
        bounds={[1, 1.15, 0.48]}
        label="COMPLETED ORDER"
        description="The final state confirms that the customer's interaction has become a complete order."
        onInspect={onInspect}
      >
        <mesh scale={[0.64, 0.78, 0.12]}>
          <boxGeometry args={[1, 1, 1]} />
          <WireMaterial color={WHITE} opacity={0.66} />
        </mesh>
        <ConnectionLines points={[[[-0.24, 0.08, 0.14], [-0.06, -0.1, 0.14]], [[-0.06, -0.1, 0.14], [0.28, 0.25, 0.14]]].flat()} opacity={0.9} />
      </Inspectable>

      <MovingPacket start={storefront} end={catalog} offset={0.05} reducedMotion={reducedMotion} label="BROWSE REQUEST" description="A customer request moving from the interface into the product catalog." onInspect={onInspect} />
      <MovingPacket start={catalog} end={cart} offset={0.38} reducedMotion={reducedMotion} label="PRODUCT SELECTION" description="A selected catalog item being added to the cart state." onInspect={onInspect} />
      <MovingPacket start={cart} end={order} offset={0.72} color={WHITE} reducedMotion={reducedMotion} label="ORDER SUBMISSION" description="Validated cart state moving toward a completed order." onInspect={onInspect} />
    </group>
  );
}

function Artifact({ mode, reducedMotion, onInspect }) {
  const rootRef = useRef(null);
  const motionRef = useRef(null);

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return undefined;

    const entry = animate(rootRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 720,
      ease: 'outExpo',
    });

    return () => entry.revert();
  }, [mode, reducedMotion]);

  useFrame((state, delta) => {
    if (!rootRef.current) return;

    if (reducedMotion) {
      rootRef.current.rotation.set(0.04, -0.04, 0);
      return;
    }

    rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, state.pointer.y * -0.08, 0.035);
    rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, state.pointer.x * 0.1, 0.035);
    rootRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.72) * 0.045;

    if (motionRef.current) {
      motionRef.current.rotation.y += delta * 0.28;
      motionRef.current.rotation.z += delta * 0.035;
    }
  });

  return (
    <group ref={rootRef} scale={reducedMotion ? 1 : 0.15}>
      {mode === 'federated' && <FederatedScene motionRef={motionRef} reducedMotion={reducedMotion} onInspect={onInspect} />}
      {mode === 'operations' && <OperationsScene motionRef={motionRef} reducedMotion={reducedMotion} onInspect={onInspect} />}
      {mode === 'commerce' && <CommerceScene motionRef={motionRef} reducedMotion={reducedMotion} onInspect={onInspect} />}
      {mode === 'analytics' && <AnalyticsScene motionRef={motionRef} reducedMotion={reducedMotion} onInspect={onInspect} />}
    </group>
  );
}

function ExperienceWireframeScene({ mode = 'analytics', reducedMotion = false, onInspect }) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 6.7], fov: 48 }}
      frameloop={reducedMotion ? 'demand' : 'always'}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance', precision: 'mediump', stencil: false }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <fog attach="fog" args={['#080808', 5.5, 10]} />
      <Artifact key={mode} mode={mode} reducedMotion={reducedMotion} onInspect={onInspect} />
    </Canvas>
  );
}

export default memo(ExperienceWireframeScene);
