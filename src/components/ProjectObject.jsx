import React, { Suspense, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { Box3, Vector3 } from 'three';

// Tamaño uniforme (dimensión máxima, en unidades de la escena) al que se
// normaliza cada modelo, sin importar su tamaño original en el archivo .glb.
const TARGET_SIZE = 2;

function Model({ path }) {
  const { scene } = useGLTF(path);

  // Clona el modelo, lo centra en su propio origen y lo escala para que su
  // lado mayor mida TARGET_SIZE. Así todos los modelos se ven del mismo tamaño
  // y giran sobre su propio eje.
  const { object, fit } = useMemo(() => {
    const clone = scene.clone();
    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    clone.position.sub(center);
    return { object: clone, fit: TARGET_SIZE / maxDim };
  }, [scene]);

  return (
    <group scale={fit}>
      <primitive object={object} />
    </group>
  );
}

export default function ProjectObject({ modelPath, id, position, descripcionCorta }) {
  const [hovered, setHover] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef();
  const pivotRef = useRef();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (containerRef.current) {
      containerRef.current.position.y = position[1] + Math.sin(t + id) * 0.15;
    }

    if (pivotRef.current) {
      pivotRef.current.rotation.y += delta * 0.7;
      pivotRef.current.rotation.x = Math.sin(t * 0.5 + id) * 0.02;
    }
  });

  return (
    <group
      ref={containerRef}
      position={position}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        setHover(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHover(false);
      }}
      onClick={() => navigate(`/project/${id}`)}
    >
      <group ref={pivotRef}>
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial color="grey" />
            </mesh>
          }
        >
          <Model path={modelPath} />
        </Suspense>
      </group>

      {hovered && descripcionCorta && (
        <Html position={[0, 1.7, 0]} center pointerEvents="none" distanceFactor={8}>
          <div className="win95-border scene-tooltip">{descripcionCorta}</div>
        </Html>
      )}
    </group>
  );
}
