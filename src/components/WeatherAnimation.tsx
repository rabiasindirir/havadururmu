import { useEffect, useRef } from 'react';
import type { WeatherCondition } from '@/types';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export function WeatherAnimation({ condition }: { condition: WeatherCondition }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let lightningAlpha = 0;
    let lightningTimer = 0;
    let cloudOffsets: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    let sunAngle = 0;
    let fogOffset = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const W = () => canvas.width;
    const H = () => canvas.height;

    function initParticles() {
      particles = [];
      cloudOffsets = [];

      if (condition === 'rainy' || condition === 'stormy') {
        const count = condition === 'stormy' ? 250 : 150;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * W(),
            y: Math.random() * H(),
            size: Math.random() * 2 + 1,
            speedX: condition === 'stormy' ? -2 : -0.5,
            speedY: Math.random() * 6 + 8,
            opacity: Math.random() * 0.4 + 0.3,
          });
        }
        const cloudCount = condition === 'stormy' ? 6 : 4;
        for (let i = 0; i < cloudCount; i++) {
          cloudOffsets.push({
            x: Math.random() * W(),
            y: Math.random() * (H() * 0.4) + 20,
            size: Math.random() * 80 + 100,
            speed: Math.random() * 0.3 + 0.1,
            opacity: condition === 'stormy' ? 0.7 : 0.5,
          });
        }
      } else if (condition === 'snowy') {
        for (let i = 0; i < 120; i++) {
          particles.push({
            x: Math.random() * W(),
            y: Math.random() * H(),
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.6 + 0.3,
          });
        }
      } else if (condition === 'cloudy' || condition === 'partly-cloudy') {
        const count = condition === 'partly-cloudy' ? 3 : 5;
        for (let i = 0; i < count; i++) {
          cloudOffsets.push({
            x: Math.random() * W(),
            y: Math.random() * (H() * 0.5) + 30,
            size: Math.random() * 60 + 80,
            speed: Math.random() * 0.2 + 0.05,
            opacity: condition === 'partly-cloudy' ? 0.4 : 0.55,
          });
        }
      } else if (condition === 'foggy') {
        for (let i = 0; i < 8; i++) {
          cloudOffsets.push({
            x: Math.random() * W(),
            y: Math.random() * H(),
            size: Math.random() * 120 + 100,
            speed: Math.random() * 0.15 + 0.03,
            opacity: Math.random() * 0.15 + 0.08,
          });
        }
      }
    }

    function drawCloud(x: number, y: number, size: number, opacity: number) {
      if (!ctx) return;
      ctx.save();
      ctx.globalAlpha = opacity;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
      gradient.addColorStop(0.5, 'rgba(220,220,230,0.6)');
      gradient.addColorStop(1, 'rgba(200,200,210,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y - size * 0.2, size * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x - size * 0.4, y + size * 0.1, size * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawSun(x: number, y: number, radius: number) {
      if (!ctx) return;
      ctx.save();
      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
      glow.addColorStop(0, 'rgba(255,220,130,0.4)');
      glow.addColorStop(0.3, 'rgba(255,200,100,0.15)');
      glow.addColorStop(1, 'rgba(255,200,100,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
      ctx.fill();

      const core = ctx.createRadialGradient(x, y, 0, x, y, radius);
      core.addColorStop(0, 'rgba(255,245,200,1)');
      core.addColorStop(0.7, 'rgba(255,210,100,0.9)');
      core.addColorStop(1, 'rgba(255,180,60,0.5)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,220,130,0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = sunAngle + (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * (radius + 5), y + Math.sin(angle) * (radius + 5));
        ctx.lineTo(x + Math.cos(angle) * (radius + 20), y + Math.sin(angle) * (radius + 20));
        ctx.stroke();
      }
      ctx.restore();
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W(), H());

      // Background gradient based on condition
      const bg = ctx.createLinearGradient(0, 0, 0, H());
      if (condition === 'sunny') {
        bg.addColorStop(0, '#1e90ff');
        bg.addColorStop(0.5, '#4dabf7');
        bg.addColorStop(1, '#74c0fc');
      } else if (condition === 'partly-cloudy') {
        bg.addColorStop(0, '#3b82c4');
        bg.addColorStop(0.5, '#6ba8d8');
        bg.addColorStop(1, '#9bc5e0');
      } else if (condition === 'cloudy') {
        bg.addColorStop(0, '#5a6c7d');
        bg.addColorStop(0.5, '#768899');
        bg.addColorStop(1, '#94a3b0');
      } else if (condition === 'rainy') {
        bg.addColorStop(0, '#3d4a57');
        bg.addColorStop(0.5, '#5a6b7a');
        bg.addColorStop(1, '#7a8a99');
      } else if (condition === 'stormy') {
        bg.addColorStop(0, '#1a1a2e');
        bg.addColorStop(0.5, '#2d2d4a');
        bg.addColorStop(1, '#3d3d5a');
      } else if (condition === 'snowy') {
        bg.addColorStop(0, '#8eacc1');
        bg.addColorStop(0.5, '#b0c4d8');
        bg.addColorStop(1, '#d0dde8');
      } else if (condition === 'foggy') {
        bg.addColorStop(0, '#9ca3af');
        bg.addColorStop(0.5, '#b0b7c0');
        bg.addColorStop(1, '#c8cdd4');
      }
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W(), H());

      // Sun for sunny and partly-cloudy
      if (condition === 'sunny' || condition === 'partly-cloudy') {
        sunAngle += 0.005;
        drawSun(W() * 0.8, H() * 0.25, 35);
      }

      // Fog overlay
      if (condition === 'foggy') {
        fogOffset += 0.5;
        cloudOffsets.forEach((c) => {
          drawCloud(c.x + Math.sin(fogOffset * 0.01 + c.y) * 20, c.y, c.size, c.opacity);
        });
      }

      // Clouds
      if (cloudOffsets.length > 0 && condition !== 'foggy') {
        cloudOffsets.forEach((c) => {
          c.x += c.speed;
          if (c.x - c.size > W()) c.x = -c.size;
          drawCloud(c.x, c.y, c.size, c.opacity);
        });
      }

      // Rain / storm
      if (condition === 'rainy' || condition === 'stormy') {
        ctx.strokeStyle = condition === 'stormy' ? 'rgba(180,200,255,0.6)' : 'rgba(160,190,230,0.5)';
        ctx.lineWidth = 1.5;
        particles.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.y > H()) {
            p.y = -10;
            p.x = Math.random() * W();
          }
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.speedY * 2);
          ctx.stroke();
        });
        ctx.globalAlpha = 1;

        // Lightning for stormy
        if (condition === 'stormy') {
          lightningTimer++;
          if (lightningTimer > 80 + Math.random() * 120) {
            lightningAlpha = 0.7;
            lightningTimer = 0;
          }
          if (lightningAlpha > 0) {
            ctx.fillStyle = `rgba(255,255,255,${lightningAlpha})`;
            ctx.fillRect(0, 0, W(), H());
            lightningAlpha -= 0.05;
          }
        }
      }

      // Snow
      if (condition === 'snowy') {
        particles.forEach((p) => {
          p.x += p.speedX + Math.sin(p.y * 0.01) * 0.3;
          p.y += p.speedY;
          if (p.y > H()) {
            p.y = -10;
            p.x = Math.random() * W();
          }
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      animationId = requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, [condition]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
}
