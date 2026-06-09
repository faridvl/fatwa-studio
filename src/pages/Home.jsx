import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Billboard, ContactShadows, Environment, Image, OrbitControls } from '@react-three/drei';
import ProjectObject from '../components/ProjectObject';

function getMuseumPosition(index, total) {
  const angleSpan = Math.PI * 0.6;
  const startAngle = (Math.PI - angleSpan) / 2;
  const angle = startAngle + (index / (total - 1)) * angleSpan;
  const radius = 7;

  return [Math.cos(angle) * -radius, Math.sin(angle) * 1.5 - 1, Math.sin(angle) * -radius + 2];
}

export default function Home({ projects }) {
  const visibleProjects = projects.filter((p) => p.visibleInMenu);

  return (
    <main className="home-root">
      <div className="win95-border bio-box">
        <div className="bio-header">KEFIR_BIO.EXE</div>
        <p className="bio-content">
          <strong>Kefir Fatwa</strong> (jose fallas)
          <br />
          <br />I am a writer and 3D artist... I don’t just model objects — I build worlds. My practice exists at the
          intersection of narrative and form.
        </p>
        <div className="bio-footer">Contact: soylalupus@gmail.com</div>
      </div>

      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <Suspense fallback={null}>
          <Environment files="/textures/qwantani_moon_noon_puresky_4k.hdr" background blur={0.05} />
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={2} />

          <Billboard position={[0, 3, 0]}>
            <Image url="/images/logo_Kefir.png" transparent scale={[5, 5]} />
          </Billboard>

          {visibleProjects.map((proj, index) => (
            <ProjectObject
              key={proj.id}
              id={proj.id}
              modelPath={proj.model}
              descripcionCorta={proj.descripcionCorta}
              position={getMuseumPosition(index, visibleProjects.length)}
            />
          ))}

          <ContactShadows opacity={0.4} scale={20} blur={2.4} />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          minDistance={5}
          maxDistance={15}
          enablePan={false}
          minPolarAngle={Math.PI / 2.2}
          maxPolarAngle={Math.PI / 1.9}
          autoRotate
          autoRotateSpeed={0.2}
        />
      </Canvas>
    </main>
  );
}
