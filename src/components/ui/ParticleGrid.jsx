import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const ParticleGrid = () => {
  const gridRef = useRef(null);

  useEffect(() => {
    const wrapper = gridRef.current;
    if (!wrapper) return;

    // Configuration
    const spacing = 40; 
    let columns = Math.ceil(window.innerWidth / spacing);
    let rows = Math.ceil(window.innerHeight / spacing);

    wrapper.innerHTML = '';
    const total = columns * rows;
    const dots = [];
    
    wrapper.style.setProperty('--cols', columns);
    wrapper.style.setProperty('--rows', rows);

    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      // Subtle opacity for the "tech" look
      dot.style.opacity = 0.15 + Math.random() * 0.15; 
      wrapper.appendChild(dot);
      dots.push(dot);
    }

    const handleInteraction = (e) => {
      const x = e.clientX || (e.touches ? e.touches[0].clientX : 0);
      const y = e.clientY || (e.touches ? e.touches[0].clientY : 0);
      
      const colIndex = Math.floor(x / spacing);
      const rowIndex = Math.floor(y / spacing);
      const index = rowIndex * columns + colIndex;

      // The signature Anime.js Ripple
      anime({
        targets: dots,
        scale: [
          { value: 3, easing: 'easeOutSine', duration: 250 },
          { value: 1, easing: 'easeInOutQuad', duration: 500 }
        ],
        opacity: [
          { value: 0.8, easing: 'easeOutSine', duration: 250 },
          { value: 0.2, easing: 'easeInOutQuad', duration: 500 }
        ],
        backgroundColor: [
            { value: '#10B981', duration: 250 }, // Green Flash
            { value: '#333333', duration: 500 }
        ],
        delay: anime.stagger(50, { grid: [columns, rows], from: index }),
      });
    };

    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  return (
    <div 
      ref={gridRef} 
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(var(--cols), 1fr)',
        gridTemplateRows: 'repeat(var(--rows), 1fr)',
      }}
    >
      <style>{`
        .dot {
          width: 3px;
          height: 3px;
          background-color: #444;
          border-radius: 50%;
          margin: auto;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
};

export default ParticleGrid;