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
    
    // Color Palette (RGB for interpolation)
    // Emerald: #10B981 -> (16, 185, 129)
    // Dark Blue: #3b82f6 -> (59, 130, 246) - roughly based on the text gradient
    const c1 = { r: 16, g: 185, b: 129 };
    const c2 = { r: 59, g: 130, b: 246 };

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
            // Phase allows each particle to pulse independently
            phase: Math.random() * Math.PI * 2,
            vx: 0,
            vy: 0,
            col: i,
            row: j
          });
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Physics Constants
      const mouseRadius = 300; // How far the "light" reaches
      const returnForce = 0.08;
      const damping = 0.9;

      particles.forEach(p => {
        // 1. Calculate Distance & Intensity
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Intensity: 1.0 at center (mouse), 0.0 at edge of radius
        let intensity = 0;
        if (distance < mouseRadius) {
            intensity = 1 - (distance / mouseRadius);
            // Non-linear falloff for a glowing look
            intensity = intensity * intensity; 
        }

        // 2. Mouse Interaction (Subtle Repulsion)
        if (distance < mouseRadius) {
            const force = (mouseRadius - distance) / mouseRadius;
            const angle = Math.atan2(dy, dx);
            // Push away slightly
            p.vx -= Math.cos(angle) * force * 0.5;
            p.vy -= Math.sin(angle) * force * 0.5;
        }

        // 3. Physics Update (Return to Grid)
        const homeDx = p.baseX - p.x;
        const homeDy = p.baseY - p.y;
        p.vx += homeDx * returnForce;
        p.vy += homeDy * returnForce;
        p.vx *= damping;
        p.vy *= damping;
        p.x += p.vx;
        p.y += p.vy;

        // 4. Color & Gradient Logic
        // The closer the mouse, the faster the phase advances
        // Base speed: 0.02, Max added speed: 0.2
        const speed = 0.02 + (intensity * 0.25);
        p.phase += speed;

        // Oscillate between 0 and 1 based on phase
        const mix = (Math.sin(p.phase) + 1) / 2;

        ctx.beginPath();

        if (intensity > 0.01) {
            // Active State: Interpolate Color
            const r = c1.r + (c2.r - c1.r) * mix;
            const g = c1.g + (c2.g - c1.g) * mix;
            const b = c1.b + (c2.b - c1.b) * mix;
            
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.5 + intensity * 0.5})`;
            
            // Size swells with intensity
            const dynamicSize = p.size + (intensity * 2.5);
            ctx.arc(p.x, p.y, dynamicSize, 0, Math.PI * 2);
        } else {
            // Idle State: Dark Dot
            ctx.fillStyle = '#222';
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
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