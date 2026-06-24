import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const REELS_PER_PAGE = 3;

function ReelExpanded({ reel }) {
  const [slide, setSlide] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const imagenes = reel.imagenes ?? [];
  const total = imagenes.length;
  const current = total ? slide % total : 0;

  const goPrev = () => setSlide((s) => (total ? (s - 1 + total) % total : 0));
  const goNext = () => setSlide((s) => (total ? (s + 1) % total : 0));

  const assetLabel = `${reel.title.toLowerCase().replace(/\s+/g, '-')} // asset_${String(current + 1).padStart(2, '0')}.dat`;

  return (
    <>
      <div className="reel-expanded win95-border">
        <div className="reel-expanded-header">
          <span>{reel.title}</span>
        </div>

        <section className="carousel" aria-label={`Visor de ${reel.title}`}>
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
                  alt={`${reel.title} // ${current + 1} de ${total}`}
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

        <section className="project-story">
          <h2 className="project-story-title">Historia:</h2>
          <p className="project-desc">{reel.descripcionLarga}</p>
        </section>
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
              <img src={imagenes[current]} alt={reel.title} className="zoom-img" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ProjectDetail({ projects }) {
  const { id } = useParams();
  const project = projects.find((item) => item.id === Number.parseInt(id, 10));

  const [visibleCount, setVisibleCount] = useState(REELS_PER_PAGE);
  const [expandedReelId, setExpandedReelId] = useState(null);

  if (!project) {
    return <div className="project-not-found">Project not found</div>;
  }

  const reels = project.reels ?? [];
  const visibleReels = reels.slice(0, visibleCount);
  const hasMore = visibleCount < reels.length;

  const handleReelClick = (reelId) => {
    setExpandedReelId((prev) => (prev === reelId ? null : reelId));
  };

  return (
    <div className="project-page">
      <Link to="/" className="btn-95 project-back-link">
        &lt; BACK TO DESKTOP
      </Link>

      <div className="win95-border project-window">
        {/* ── Información del proyecto ── */}
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

        <div className="project-context">{project.contextoConcepto}</div>
        <p className="project-short">{project.descripcionCorta}</p>

        {/* ── Reels ── */}
        <section className="reels-section">
          <ul className="reels-list">
            {visibleReels.map((reel) => (
              <li key={reel.id}>
                <button
                  type="button"
                  className={`reel-thumb${expandedReelId === reel.id ? ' reel-thumb--active' : ''}`}
                  onClick={() => handleReelClick(reel.id)}
                  aria-expanded={expandedReelId === reel.id}
                >
                  <div className="reel-thumb-screen">
                    <img
                      src={reel.imagenPrincipal}
                      alt={reel.title}
                      className="reel-thumb-img"
                    />
                  </div>
                  <div className="reel-thumb-footer">
                    <span className="reel-thumb-title">{reel.title}</span>
                    <span className="reel-thumb-indicator">
                      {expandedReelId === reel.id ? '[ — ]' : '[ + ]'}
                    </span>
                  </div>
                </button>

                {expandedReelId === reel.id && <ReelExpanded reel={reel} />}
              </li>
            ))}
          </ul>

          {hasMore && (
            <button
              type="button"
              className="btn-95 reels-more-btn"
              onClick={() => setVisibleCount((c) => c + REELS_PER_PAGE)}
            >
              Ver más [{reels.length - visibleCount} restante{reels.length - visibleCount !== 1 ? 's' : ''}]
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
