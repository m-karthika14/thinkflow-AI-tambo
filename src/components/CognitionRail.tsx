import { useState, useEffect, useRef } from 'react';

interface Intent {
  label: string;
  description: string;
}

interface CognitionRailProps {
  onIntentChange: (index: number) => void;
  activeIntent: number;
}

const intents: Intent[] = [
  { label: 'EXPLORE', description: "Just show me what's happening." },
  { label: 'UNDERSTAND', description: 'Break it down for me' },
  { label: 'DECIDE', description: 'Decide what matters' },
  { label: 'ACT', description: 'What to do next.' },
];

export default function CognitionRail({ onIntentChange, activeIntent }: CognitionRailProps) {
  const [hoveredIntent, setHoveredIntent] = useState<number | null>(null);
  const [focusPosition, setFocusPosition] = useState(0);
  const [labelPositions, setLabelPositions] = useState<number[]>([]);
  const railRef = useRef<HTMLDivElement>(null);
  const focusNodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (railRef.current) {
      const railWidth = railRef.current.offsetWidth;
      const segmentWidth = railWidth / (intents.length - 1);
      const targetPosition = segmentWidth * activeIntent;

      setFocusPosition(targetPosition);
    }
  }, [activeIntent]);

  // compute label positions so labels sit directly under each node/ball
  useEffect(() => {
    const computePositions = () => {
      if (!railRef.current) return;
      const railWidth = railRef.current.offsetWidth;
      const segmentWidth = railWidth / (intents.length - 1);
      const positions = intents.map((_, i) => segmentWidth * i);
      setLabelPositions(positions);
    };

    computePositions();
    window.addEventListener('resize', computePositions);
    return () => window.removeEventListener('resize', computePositions);
  }, []);

  const handleRailClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!railRef.current) return;

    const rect = railRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const railWidth = rect.width;
    const segmentWidth = railWidth / (intents.length - 1);

    const closestIndex = Math.round(clickX / segmentWidth);
    const clampedIndex = Math.max(0, Math.min(intents.length - 1, closestIndex));

    onIntentChange(clampedIndex);
  };

  const handleLabelClick = (index: number) => {
    onIntentChange(index);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto">
      <div className="relative w-full" ref={railRef}>
        <div
          className="absolute h-0.5 bg-gradient-to-r from-blue-500/20 via-violet-500/30 to-blue-500/20 cursor-pointer"
          style={{ width: '100%', top: '50%', transform: 'translateY(-50%)' }}
          onClick={handleRailClick}
        />

        <div
          ref={focusNodeRef}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-all duration-700 ease-out"
          style={{ left: `${focusPosition}px` }}
        >
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 to-violet-500/30 backdrop-blur-sm border border-blue-400/50 animate-pulse" />

            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-300/40 to-violet-400/40 backdrop-blur-md" />

            <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.4)]" />

            <div className="absolute -inset-4 rounded-full bg-blue-400/10 blur-xl animate-pulse" />
          </div>
        </div>

        <div className="relative pt-20" style={{ height: '64px' }}>
          {intents.map((intent, index) => {
            const isActive = activeIntent === index;
            const isHovered = hoveredIntent === index;
            const left = labelPositions[index] ?? 0;

            return (
              <div
                key={intent.label}
                className="absolute flex flex-col items-center"
                onMouseEnter={() => setHoveredIntent(index)}
                onMouseLeave={() => setHoveredIntent(null)}
                style={{ left: `${left}px`, transform: 'translateX(-50%)' }}
              >
                <div className="absolute -top-20 w-3 h-3 rounded-full bg-blue-400/30 border border-blue-400/50" />

                <button
                  onClick={() => handleLabelClick(index)}
                  className={`
                    text-sm font-light tracking-wider transition-all duration-500 cursor-pointer
                    ${isActive
                      ? 'text-blue-100 tracking-widest drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                      : 'text-gray-500 hover:text-gray-300'
                    }
                  `}
                >
                  {intent.label}
                </button>

                {(isHovered || isActive) && (
                  <div
                    className="absolute -top-32 px-4 py-2 rounded-lg bg-gray-900/90 backdrop-blur-md border border-blue-400/20 shadow-lg animate-fadeInSlide pointer-events-none"
                    style={{
                      animation: 'fadeInSlide 0.3s ease-out forwards',
                    }}
                  >
                    <p className="text-xs text-gray-300 whitespace-nowrap italic">
                      {intent.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
