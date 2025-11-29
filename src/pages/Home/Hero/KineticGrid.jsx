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
    
    // Color Palette
    const c1 = { r: 16, g: 185, b: 129 }; // Emerald
    const c2 = { r: 59, g: 130, b: 246 }; // Blue

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
      time += 0.02; 
      
      const mouseRadius = 350; 
      const returnForce = 0.08;
      const damping = 0.9;

      particles.forEach(p => {
        // 1. PHYSICAL SINE WAVE (The "Breathing")
        const wave = Math.sin(p.col * 0.1 + p.row * 0.1 + time) * 0.5;
        p.vx += Math.cos(time + p.row * 0.1) * 0.02;

        // 2. SLANTED HIGHLIGHT (The "Scanline")
        // Calculate a diagonal value based on position
        const diagonal = (p.x + p.y) * 0.002;
        // Create a moving wave based on time
        const scan = Math.sin(diagonal - time * 0.8);
        // Sharpen the wave to make it a distinct band
        const highlightIntensity = Math.pow(Math.max(0, scan), 20); 

        // 3. MOUSE INTERACTION
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let mouseIntensity = 0;
        if (distance < mouseRadius) {
            mouseIntensity = 1 - (distance / mouseRadius);
            mouseIntensity = mouseIntensity * mouseIntensity;
            
            const force = (mouseRadius - distance) / mouseRadius;
            const angle = Math.atan2(dy, dx);
            p.vx -= Math.cos(angle) * force * 0.6;
            p.vy -= Math.sin(angle) * force * 0.6;
        }

        // 4. PHYSICS UPDATE
        const homeDx = p.baseX - p.x;
        const homeDy = p.baseY - p.y;
        p.vx += homeDx * returnForce;
        p.vy += homeDy * returnForce;
        p.vx *= damping;
        p.vy *= damping;
        p.x += p.vx;
        p.y += p.vy;

        // 5. COLOR & DRAWING
        // Speed up cycling near mouse
        p.phase += 0.02 + (mouseIntensity * 0.2);
        const mix = (Math.sin(p.phase) + 1) / 2;

        ctx.beginPath();

        // Combined Intensity: Mouse Proximity OR Slanted Highlight
        // The highlight is white/bright grey, the mouse is Emerald/Blue
        
        if (mouseIntensity > 0.01) {
            // -- MOUSE ZONE (Gradient) --
            const r = c1.r + (c2.r - c1.r) * mix;
            const g = c1.g + (c2.g - c1.g) * mix;
            const b = c1.b + (c2.b - c1.b) * mix;
            
            // Add white highlight from the scan to the gradient
            const scanBoost = highlightIntensity * 100; 
            
            ctx.fillStyle = `rgba(${Math.min(255, r + scanBoost)}, ${Math.min(255, g + scanBoost)}, ${Math.min(255, b + scanBoost)}, ${0.4 + mouseIntensity * 0.6})`;
            
            const dynamicSize = p.size + wave + (mouseIntensity * 3);
            ctx.arc(p.x, p.y, Math.max(0.5, dynamicSize), 0, Math.PI * 2);
            
        } else if (highlightIntensity > 0.1) {
            // -- SCANLINE ZONE (No Mouse) --
            // Make dots brighter grey/white as the scan passes
            const brightness = 34 + (highlightIntensity * 100); 
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
            
            // Slight size bump for the scan
            const dynamicSize = Math.max(1, p.size + wave + (highlightIntensity * 1.5));
            ctx.arc(p.x, p.y, dynamicSize, 0, Math.PI * 2);
            
        } else {
            // -- IDLE ZONE --
            ctx.fillStyle = '#222';
            const dynamicSize = Math.max(1, p.size + wave); 
            ctx.arc(p.x, p.y, dynamicSize, 0, Math.PI * 2);
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