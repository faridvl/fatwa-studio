import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function ProjectDetail({ projects }) {
  const { id } = useParams();
  const project = projects.find((item) => item.id === Number.parseInt(id, 10));

  const [slide, setSlide] = useState(0);
  const [showRelated, setShowRelated] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Otros proyectos de la misma categoría (excluyendo el actual).
  const related = useMemo(() => {
    if (!project) return [];
    return projects.filter((p) => p.categoria === project.categoria && p.id !== project.id);
  }, [projects, project]);

  if (!project) {
    return <div className="project-not-found">Project not found</div>;
  }

  const imagenes = project.imagenes ?? [];
  const total = imagenes.length;
  // Avance circular del carrusel; el módulo evita índices fuera de rango.
  const goPrev = () => setSlide((s) => (total ? (s - 1 + total) % total : 0));
  const goNext = () => setSlide((s) => (total ? (s + 1) % total : 0));
  const current = total ? slide % total : 0;

  // Nombre de archivo simulado: "ciber-humanoides // asset_01.dat"
  const fileSlug = project.title.toLowerCase().replace(/\s+/g, '-');
  const assetLabel = `${fileSlug} // asset_${String(current + 1).padStart(2, '0')}.dat`;

  return (
    <div className="project-page">
      <Link to="/" className="btn-95 project-back-link">
        &lt; BACK TO DESKTOP
      </Link>

      <div className="win95-border project-window">
        {/* ── ARRIBA: información fija ───────────────────────────── */}
        <header className="project-info">
          <h1 className="project-title">{project.title}</h1>
          <hr className="project-divider" />

          <div className="project-meta-grid">
            <div>
              <strong>Sección:</strong> {project.section}
            </div>
            <div>
              <strong>Año:</strong> {project.year}
            </div>
            <div>
              <strong>Medio:</strong> {project.medium}
            </div>
          </div>
        </header>

        {/* ── CENTRO: carrusel horizontal ───────────────────────── */}
        <div className="project-context">{project.contextoConcepto}</div>

        <section className="carousel" aria-label="Visor de imágenes del proyecto">
          <div className="carousel-viewport">
            <button
              type="button"
              className="win95-btn carousel-arrow"
              onClick={goPrev}
              disabled={total <= 1}
              aria-label="Imagen anterior"
            >
              &#9664;
            </button>

            <div className="carousel-screen">
              {total ? (
                <img
                  src={imagenes[current]}
                  alt={`${project.title} // ${current + 1} de ${total}`}
                  className="carousel-img"
                  onClick={() => setIsZoomed(true)}
                />
              ) : (
                <div className="carousel-empty">Sin imágenes</div>
              )}
            </div>

            <button
              type="button"
              className="win95-btn carousel-arrow"
              onClick={goNext}
              disabled={total <= 1}
              aria-label="Imagen siguiente"
            >
              &#9654;
            </button>
          </div>

          <div className="carousel-indicator">
            Imagen [{total ? current + 1 : 0}/{total}]
          </div>
        </section>

        {/* ── Descripción breve ─────────────────────────────────── */}
        <p className="project-short">{project.descripcionCorta}</p>

        {/* ── Historia (descripción larga) ──────────────────────── */}
        <section className="project-story">
          <h2 className="project-story-title">Historia:</h2>
          <p className="project-desc">{project.descripcionLarga}</p>
        </section>

        {/* ── ABAJO: proyectos relacionados ─────────────────────── */}
        <footer className="project-related">
          <button
            type="button"
            className="btn-95"
            onClick={() => setShowRelated((v) => !v)}
            aria-expanded={showRelated}
          >
            {showRelated ? 'Ver menos' : 'Ver más'}
          </button>

          {showRelated && (
            <ul className="related-list">
              {related.length ? (
                related.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/project/${p.id}`}
                      className="win95-border related-row"
                      onClick={() => {
                        setSlide(0);
                        setShowRelated(false);
                      }}
                    >
                      <img className="related-row-thumb" src={p.imagenes?.[0]} alt={p.title} />
                      <strong className="related-row-title">{p.title}</strong>
                      <span className="related-row-desc">{p.descripcionCorta}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="related-empty">No hay otros proyectos en esta categoría.</li>
              )}
            </ul>
          )}
        </footer>
      </div>

      {isZoomed && total > 0 && (
        <div className="zoom-overlay" onClick={() => setIsZoomed(false)}>
          <div className="win95-border zoom-window" onClick={(e) => e.stopPropagation()}>
            <div className="zoom-header">
              <span className="zoom-header-title">{assetLabel}</span>
              <button
                type="button"
                className="win95-btn zoom-close"
                onClick={() => setIsZoomed(false)}
                aria-label="Cerrar zoom"
              >
                [ X ]
              </button>
            </div>
            <div className="zoom-body">
              <img src={imagenes[current]} alt={project.title} className="zoom-img" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
