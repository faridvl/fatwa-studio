import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Billboard, Environment, Image, OrbitControls } from '@react-three/drei';
import ProjectObject from '../components/ProjectObject';

function getMuseumPosition(index, total) {
  const angleSpan = Math.PI * 0.6;
  const startAngle = (Math.PI - angleSpan) / 2;
  const angle = startAngle + (index / (total - 1)) * angleSpan;
  const radius = 7;

  return [Math.cos(angle) * -radius, Math.sin(angle) * 1.5 - 1, Math.sin(angle) * -radius + 2];
}

function LogoImage({ onToggle }) {
  return (
    <Image
      url="/images/logo_Kefir.png"
      transparent
      scale={[5, 5]}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    />
  );
}

export default function Home({ projects }) {
  const visibleProjects = projects.filter((p) => p.visibleInMenu);
  const [bioOpen, setBioOpen] = useState(true);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);

  return (
    <main className="home-root">
      {bioOpen && (
        <div className="win95-border bio-window">
          <div className="bio-titlebar">
            <span className="bio-titlebar-title">KEFIR_BIO.EXE</span>
            <div className="bio-titlebar-btns">
              <button className="bio-winbtn" onClick={() => setBioOpen(false)}>_</button>
              <button className="bio-winbtn" onClick={() => setBioOpen(false)}>X</button>
            </div>
          </div>

          <div className="bio-menubar">
            <div className="bio-menu-item-wrap">
              <span
                className={'bio-menu-item' + (fileMenuOpen ? ' active' : '')}
                onClick={() => setFileMenuOpen((o) => !o)}
              >
                File
              </span>
              {fileMenuOpen && (
                <>
                  <div className="bio-menu-overlay" onClick={() => setFileMenuOpen(false)} />
                  <div className="win95-border bio-dropdown">
                    <div className="bio-dropdown-item">Writings</div>
                    <div className="bio-dropdown-sep" />
                    <div className="bio-dropdown-item" onClick={() => { setBioOpen(false); setFileMenuOpen(false); }}>
                      Exit
                    </div>
                  </div>
                </>
              )}
            </div>
            <span className="bio-menu-item">Edit</span>
            <span className="bio-menu-item">View</span>
          </div>

          <div className="bio-body">
            <div className="bio-identity">
              <div className="bio-name">KEFIR FATWA</div>
              <div className="bio-realname">Jose Fallas</div>
              <div className="bio-role">3D Artist &amp; Writer</div>
            </div>

            <div className="bio-divider" />

            <p className="bio-text">
              I am a writer and 3D artist. I don&#39;t just model objects — I build worlds. My practice exists at the
              intersection of narrative and form.
            </p>

            <div className="bio-divider" />

            <div className="bio-contact-section">
              <div className="bio-contact-label">CONTACT</div>
              <a href="mailto:soylalupus@gmail.com" className="bio-contact-field">
                soylalupus@gmail.com
              </a>
            </div>
          </div>

          <div className="bio-statusbar">
            <span>Ready</span>
            <span className="bio-status-chip">ONLINE</span>
          </div>
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <Suspense fallback={null}>
          <Environment files="/textures/qwantani_moon_noon_puresky_4k.hdr" background blur={0.05} />
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={2} />

          <Billboard position={[0, 3, 0]}>
            <LogoImage onToggle={() => setBioOpen((o) => !o)} />
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
