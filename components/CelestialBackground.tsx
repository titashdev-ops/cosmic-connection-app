
import React, { useEffect, useRef } from 'react';

const CelestialBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: -1000, y: -1000 };
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulse: number;
      hue: number;
      z: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.z = Math.random() * 2; // Depth
        this.size = (Math.random() * 1.5 + 0.1) * (this.z + 0.5);
        this.speedX = (Math.random() - 0.5) * 0.1 * (this.z + 0.1);
        this.speedY = (Math.random() - 0.5) * 0.1 * (this.z + 0.1);
        this.opacity = Math.random() * 0.5 + 0.1;
        this.pulse = Math.random() * 0.015;
        this.hue = Math.random() > 0.95 ? 330 : 220; 
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 150) {
          const force = (150 - distance) / 150;
          this.x -= dx * force * 0.04;
          this.y -= dy * force * 0.04;
        }

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        this.opacity += this.pulse;
        if (this.opacity > 0.8 || this.opacity < 0.1) this.pulse = -this.pulse;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `hsla(${this.hue}, 80%, 95%, ${this.opacity})`;
        ctx.shadowBlur = this.size * 5;
        ctx.shadowColor = `hsla(${this.hue}, 80%, 70%, ${this.opacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const init = () => {
      particles = [];
      const density = window.innerWidth < 768 ? 60 : 180;
      for (let i = 0; i < density; i++) {
        particles.push(new Particle());
      }
    };

    const drawShootingStar = () => {
      if (frame % 300 === 0) {
        // Occasional cinematic shooting star logic could be added here
      }
    };

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background gradient pulse
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      gradient.addColorStop(0, '#040b1e');
      gradient.addColorStop(1, '#020617');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mouse.x = x;
      mouse.y = y;
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchstart', handleMove);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchstart', handleMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: '#020617' }}
    />
  );
};

export default CelestialBackground;
