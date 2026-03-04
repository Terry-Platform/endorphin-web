interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'rect';
}

const COLORS = ['#16a34a', '#059669', '#34d399', '#bbf7d0', '#ffffff', '#10b981'];

export function fireConfetti(container: HTMLElement): void {
  const canvas = document.createElement('canvas');
  const rect = container.getBoundingClientRect();

  canvas.width = rect.width;
  canvas.height = Math.min(rect.height + 200, 400);
  canvas.style.cssText = `
    position: absolute;
    top: -100px;
    left: 0;
    width: 100%;
    height: ${canvas.height}px;
    pointer-events: none;
    z-index: 10;
  `;

  container.style.position = 'relative';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const particles: Particle[] = [];
  const count = 40;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: canvas.width * (0.2 + Math.random() * 0.6),
      y: canvas.height * 0.4,
      vx: (Math.random() - 0.5) * 8,
      vy: -(Math.random() * 6 + 3),
      size: Math.random() * 6 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    });
  }

  let frame = 0;
  const maxFrames = 120;

  function animate() {
    if (!ctx) return;
    frame++;
    if (frame > maxFrames) {
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx;
      p.vy += 0.15;
      p.y += p.vy;
      p.alpha = Math.max(0, 1 - frame / maxFrames);
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }

      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
