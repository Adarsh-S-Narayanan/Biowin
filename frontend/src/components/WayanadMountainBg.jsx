import { useEffect, useRef } from 'react';

/**
 * WayanadMountainBg — animated SVG mountain landscape for the hero section.
 * Depicts layered hills, mist, floating spice particles, a river, and cultural
 * elements inspired by Wayanad's Western Ghats.
 *
 * Drop this as a full-width absolute background inside any relative container.
 */
export function WayanadMountainBg({ className = '', style = {} }) {
  const canvasRef = useRef(null);

  // Floating spice particles animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 1.5 + Math.random() * 2.5,
      speed: 0.15 + Math.random() * 0.3,
      drift: (Math.random() - 0.5) * 0.2,
      opacity: 0.15 + Math.random() * 0.3,
      color: Math.random() > 0.5 ? '#639922' : '#C0DD97',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
      });
      raf = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* ── SVG Mountains ── */}
      <svg
        viewBox="0 0 1440 560"
        preserveAspectRatio="xMidYMax meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '75%',
          minHeight: 260,
        }}
      >
        <defs>
          {/* Sky gradient */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EAF4E8" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#C0DD97" stopOpacity="0.18" />
          </linearGradient>

          {/* Mountain layers */}
          <linearGradient id="mtnFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A8C97A" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#639922" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="mtnMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#639922" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3B6D11" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="mtnNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#27500A" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#27500A" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="mtnFore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a3d07" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#1a3d07" stopOpacity="0.35" />
          </linearGradient>

          {/* Mist */}
          <filter id="mistBlur">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Background haze */}
        <rect x="0" y="0" width="1440" height="560" fill="url(#skyGrad)" />

        {/* Far mountains (lightest, most misty) */}
        <path
          d="M0 400 Q120 200 240 280 Q360 160 480 260 Q600 140 720 220 Q840 150 960 240 Q1080 170 1200 250 Q1320 200 1440 270 L1440 560 L0 560 Z"
          fill="url(#mtnFar)"
          style={{ animation: 'mtnSway1 18s ease-in-out infinite' }}
        />

        {/* Mid mountains */}
        <path
          d="M0 440 Q100 280 200 350 Q300 240 400 320 Q520 210 640 300 Q760 230 880 310 Q1000 250 1120 320 Q1280 260 1440 320 L1440 560 L0 560 Z"
          fill="url(#mtnMid)"
          style={{ animation: 'mtnSway2 22s ease-in-out infinite' }}
        />

        {/* Near ridge (steeper peaks — Wayanad character) */}
        <path
          d="M0 490 Q60 370 140 430 Q200 310 300 390 Q380 280 460 360 Q560 260 660 360 Q740 300 820 380 Q920 290 1020 370 Q1120 310 1200 390 Q1300 340 1380 400 L1440 420 L1440 560 L0 560 Z"
          fill="url(#mtnNear)"
          style={{ animation: 'mtnSway3 26s ease-in-out infinite' }}
        />

        {/* Foreground hills + tree silhouettes */}
        <path
          d="M0 510 Q80 430 160 480 Q240 420 320 470 Q400 400 480 450 Q560 410 640 460 Q720 420 800 470 Q880 430 960 480 Q1040 440 1120 490 Q1200 450 1280 490 Q1360 460 1440 480 L1440 560 L0 560 Z"
          fill="url(#mtnFore)"
        />

        {/* Mist layer over mid ridges */}
        <ellipse cx="360" cy="350" rx="280" ry="50" fill="white" opacity="0.07" filter="url(#mistBlur)" />
        <ellipse cx="900" cy="320" rx="220" ry="40" fill="white" opacity="0.06" filter="url(#mistBlur)" />
        <ellipse cx="1200" cy="360" rx="200" ry="38" fill="white" opacity="0.05" filter="url(#mistBlur)" />

        {/* Tree silhouettes on foreground */}
        {/* Left cluster */}
        <g opacity="0.55">
          <rect x="28" y="450" width="7" height="60" fill="#1a3d07" />
          <ellipse cx="31" cy="432" rx="22" ry="28" fill="#1a3d07" />
          <ellipse cx="31" cy="412" rx="16" ry="20" fill="#1a3d07" />
          <rect x="60" y="465" width="5" height="50" fill="#1a3d07" />
          <ellipse cx="62" cy="450" rx="16" ry="20" fill="#1a3d07" />
          <ellipse cx="62" cy="434" rx="11" ry="15" fill="#1a3d07" />
        </g>
        {/* Right cluster */}
        <g opacity="0.5">
          <rect x="1390" y="455" width="7" height="60" fill="#1a3d07" />
          <ellipse cx="1393" cy="437" rx="22" ry="28" fill="#1a3d07" />
          <ellipse cx="1393" cy="418" rx="16" ry="20" fill="#1a3d07" />
          <rect x="1360" y="468" width="5" height="52" fill="#1a3d07" />
          <ellipse cx="1362" cy="453" rx="16" ry="20" fill="#1a3d07" />
        </g>

        {/* Subtle river shimmer at base of mountains */}
        <path
          d="M100 530 Q300 520 500 528 Q700 535 900 525 Q1100 520 1340 530"
          stroke="#C0DD97"
          strokeWidth="1.5"
          fill="none"
          opacity="0.4"
          style={{ animation: 'riverShimmer 4s ease-in-out infinite' }}
        />

        {/* Spice plant silhouettes (cardamom / pepper vine shape) */}
        <g opacity="0.18" fill="#27500A">
          <ellipse cx="720" cy="510" rx="18" ry="26" />
          <rect x="717" y="510" width="6" height="40" />
          <path d="M720 510 Q730 495 740 500 Q730 508 720 510Z" />
          <path d="M720 500 Q710 485 700 490 Q710 498 720 500Z" />
        </g>

        {/* Keyframe animations injected as inline style */}
        <style>{`
          @keyframes mtnSway1 {
            0%,100% { transform: translateX(0px) scaleY(1); }
            33% { transform: translateX(-6px) scaleY(1.005); }
            66% { transform: translateX(4px) scaleY(0.998); }
          }
          @keyframes mtnSway2 {
            0%,100% { transform: translateX(0px); }
            40% { transform: translateX(8px); }
            70% { transform: translateX(-5px); }
          }
          @keyframes mtnSway3 {
            0%,100% { transform: translateX(0px); }
            30% { transform: translateX(-4px); }
            70% { transform: translateX(6px); }
          }
          @keyframes riverShimmer {
            0%,100% { opacity: 0.4; stroke-dashoffset: 0; }
            50% { opacity: 0.65; stroke-dashoffset: -40; }
          }
        `}</style>
      </svg>

      {/* ── Canvas: floating spice particles ── */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default WayanadMountainBg;
