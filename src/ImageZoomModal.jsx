import React, { useEffect, useRef, useState } from 'react';
import './assets/styles/ImageZoomModal.css';

const MIN_SCALE = 1;
const MAX_SCALE = 4;

const ImageZoomModal = ({ images, startIndex = 0, alt = '', onClose }) => {
  const [index, setIndex] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragState = useRef(null);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const showImage = (delta) => {
    setIndex((current) => (current + delta + images.length) % images.length);
    resetZoom();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') showImage(1);
      if (e.key === 'ArrowLeft') showImage(-1);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const zoomBy = (delta) => {
    setScale((current) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, current + delta)));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    zoomBy(e.deltaY < 0 ? 0.3 : -0.3);
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2.5);
    }
  };

  const handlePointerDown = (e) => {
    if (scale <= 1) return;
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
    };
  };

  const handlePointerMove = (e) => {
    if (!dragState.current) return;
    const { startX, startY, originX, originY } = dragState.current;
    setPosition({
      x: originX + (e.clientX - startX),
      y: originY + (e.clientY - startY),
    });
  };

  const stopDrag = () => {
    dragState.current = null;
  };

  return (
    <div className="zoom-modal-overlay" onClick={onClose}>
      <div className="zoom-modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="zoom-modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <div className="zoom-modal-controls">
          <button type="button" onClick={() => zoomBy(-0.5)} disabled={scale <= MIN_SCALE} aria-label="Zoom out">
            &minus;
          </button>
          <button type="button" onClick={resetZoom} disabled={scale === 1 && position.x === 0 && position.y === 0}>
            Reset
          </button>
          <button type="button" onClick={() => zoomBy(0.5)} disabled={scale >= MAX_SCALE} aria-label="Zoom in">
            +
          </button>
        </div>

        {images.length > 1 && (
          <button type="button" className="zoom-modal-nav zoom-modal-prev" onClick={() => showImage(-1)} aria-label="Previous image">
            &#8249;
          </button>
        )}

        <div
          className={`zoom-modal-image-wrap ${scale > 1 ? 'zoomed' : ''}`}
          onWheel={handleWheel}
          onDoubleClick={handleDoubleClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrag}
          onPointerLeave={stopDrag}
        >
          <img
            src={images[index]}
            alt={alt}
            draggable={false}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            }}
          />
        </div>

        {images.length > 1 && (
          <button type="button" className="zoom-modal-nav zoom-modal-next" onClick={() => showImage(1)} aria-label="Next image">
            &#8250;
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageZoomModal;
