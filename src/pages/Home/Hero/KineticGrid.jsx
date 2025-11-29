import React, { useRef, useEffect } from 'react';

const KineticGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    const spacing = 35; 
    let mouse = { x: -1000, y: -1000 };
    let time = 0;

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];
      
      const cols = Math.floor(width / spacing);
      const rows = Math.floor(height / spacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          particles.push({
            x: i * spacing + spacing / 2,
            y: j * spacing + spacing / 2,
            baseX: i * spacing + spacing / 2,
            baseY: j * spacing + spacing / 2,
            size: 1.5,
            vx: 0,
            vy: 0,
            col: i, // Store column index for wave math
            row: j
          });
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02; // Global time for waves
      
      const mouseRadius = 150;
      const returnForce = 0.08;
      const cursorForce = 0.5;
      const damping = 0.9;

      ctx.fillStyle = '#333';

      particles.forEach(p => {
        // 1. Mouse Interaction (Repulsion)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouseRadius - distance) / mouseRadius;
          p.vx -= forceDirectionX * force * cursorForce;
          p.vy -= forceDirectionY * force * cursorForce;
        }

        // 2. Automatic Wave (The "Breathing" Effect)
        // A sine wave traveling diagonally
        const wave = Math.sin(p.col * 0.1 + p.row * 0.1 + time) * 0.5;
        // Apply subtle offset based on wave
        p.vx += Math.cos(time + p.row * 0.1) * 0.02;

        // 3. Physics (Return to home)
        const homeDx = p.baseX - p.x;
        const homeDy = p.baseY - p.y;
        p.vx += homeDx * returnForce;
        p.vy += homeDy * returnForce;

        p.vx *= damping;
        p.vy *= damping;

        p.x += p.vx;
        p.y += p.vy;

        // Drawing
        ctx.beginPath();
        const speed = Math.abs(p.vx) + Math.abs(p.vy);
        // Size grows with speed OR with the automatic wave
        const dynamicSize = Math.max(1, Math.min(p.size + speed * 0.5 + wave, 5));
        
        ctx.arc(p.x, p.y, dynamicSize, 0, Math.PI * 2);
        
        // Color Logic: Speed triggers Green, Wave triggers slight Grey shift
        if (speed > 1.5) {
            ctx.fillStyle = '#10B981'; // Active Emerald
        } else if (wave > 0.4) {
            ctx.fillStyle = '#555'; // Wave Highlight
        } else {
            ctx.fillStyle = '#222'; // Base Dark
        }
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => init();
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 bg-[#020202]" />;
};

export default KineticGrid;