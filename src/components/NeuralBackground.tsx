import { useEffect, useRef } from 'react';

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
  targetX?: number;
  targetY?: number;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface NeuralBackgroundProps {
  activeIntent: number;
}

export default function NeuralBackground({ activeIntent }: NeuralBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firefliesRef = useRef<Firefly[]>([]);
  const nodesRef = useRef<Node[][]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      // reset transforms for crisp drawing at DPR
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initializeNodes();
    };

    // Tunable visualization parameters
    const NETWORKS = [
      { count: 40, connectionDistance: 220, color: '120,170,255' },
      { count: 30, connectionDistance: 200, color: '180,130,255' },
      { count: 24, connectionDistance: 180, color: '100,200,180' },
    ];

    // Initialize multiple node groups (networks)
    const initializeNodes = () => {
      nodesRef.current = [] as Node[][];
      for (let g = 0; g < NETWORKS.length; g++) {
        const group: Node[] = [];
        const nodeCount = NETWORKS[g].count;
        for (let i = 0; i < nodeCount; i++) {
          group.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
          });
        }
        nodesRef.current.push(group);
      }
    };

    const updateNodes = () => {
      // Small random movement with friction and wrapping for each network group
      nodesRef.current.forEach((group) => {
        group.forEach((node) => {
          node.vx += (Math.random() - 0.5) * 0.02;
          node.vy += (Math.random() - 0.5) * 0.02;

          node.vx *= 0.995;
          node.vy *= 0.995;

          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0) node.x = canvas.width;
          if (node.x > canvas.width) node.x = 0;
          if (node.y < 0) node.y = canvas.height;
          if (node.y > canvas.height) node.y = 0;
        });
      });
    };

    const initializeFireflies = () => {
      firefliesRef.current = [];
      const fireflyCount = 36; // more particles to complement denser network
      for (let i = 0; i < fireflyCount; i++) {
        firefliesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          opacity: Math.random() * 0.6 + 0.4,
          size: Math.random() * 3 + 1.5,
        });
      }
    };

    resizeCanvas();
    initializeFireflies();
    window.addEventListener('resize', resizeCanvas);

    const drawNeuralNetwork = () => {
      ctx.lineWidth = 0.8;

      // draw each network group separately so they feel like overlapping networks
      for (let g = 0; g < nodesRef.current.length; g++) {
        const nodes = nodesRef.current[g];
        const cfg = NETWORKS[g] || NETWORKS[0];
        const baseColor = cfg.color;
        const connDist = cfg.connectionDistance;

        // draw connections inside this group
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connDist) {
              const opacity = (1 - distance / connDist) * 0.18;
              ctx.strokeStyle = `rgba(${baseColor}, ${opacity})`;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }

        // draw glow and node for this group
        nodes.forEach((node) => {
          const glowRadius = 8;
          const g = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius);
          g.addColorStop(0, `rgba(${baseColor},0.08)`);
          g.addColorStop(1, `rgba(${baseColor},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(${baseColor},0.28)`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 3.2, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    };

    const updateFireflies = () => {
      const intentX = window.innerWidth * (0.3 + activeIntent * 0.15);
      const intentY = window.innerHeight * 0.3;

      firefliesRef.current.forEach((firefly) => {
        const dx = intentX - firefly.x;
        const dy = intentY - firefly.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const attraction = 0.0003;
        firefly.vx += (dx / distance) * attraction;
        firefly.vy += (dy / distance) * attraction;

        firefly.vx += (Math.random() - 0.5) * 0.05;
        firefly.vy += (Math.random() - 0.5) * 0.05;

        firefly.vx *= 0.98;
        firefly.vy *= 0.98;

        firefly.x += firefly.vx;
        firefly.y += firefly.vy;

        if (firefly.x < 0) firefly.x = canvas.width;
        if (firefly.x > canvas.width) firefly.x = 0;
        if (firefly.y < 0) firefly.y = canvas.height;
        if (firefly.y > canvas.height) firefly.y = 0;

        firefly.opacity = 0.3 + Math.sin(Date.now() * 0.001 + firefly.x) * 0.2;
      });
    };

    const drawFireflies = () => {
      firefliesRef.current.forEach((firefly) => {
        const gradient = ctx.createRadialGradient(
          firefly.x,
          firefly.y,
          0,
          firefly.x,
          firefly.y,
          firefly.size * 4
        );
        gradient.addColorStop(0, `rgba(220, 240, 255, ${Math.min(1, firefly.opacity + 0.1)})`);
        gradient.addColorStop(0.5, `rgba(170, 210, 255, ${Math.min(1, firefly.opacity * 0.5)})`);
        gradient.addColorStop(1, 'rgba(150, 200, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.size * 4, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateNodes();
      drawNeuralNetwork();
      updateFireflies();
      drawFireflies();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeIntent]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
