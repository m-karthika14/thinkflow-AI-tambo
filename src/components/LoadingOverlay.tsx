import { useEffect, useRef, useState } from 'react';

type Props = {
  intervalMs?: number;
  statusMessage?: string | null;
};

const MESSAGES: string[] = [
  // Core
  'Thinking… please wait',
  'Making sense of the data…',

  // Fun + friendly
  '😊 Hang tight — good insights take a moment.',
  '⏳ Almost there… connecting the dots.',
  '🧠 Our brain cells are working overtime.',
  '☕ If this were a human analyst, they’d still be opening Excel.',
  '🔄 Turning numbers into meaning…',

  // Simple business facts
  '📊 Most companies have data. Few know what to do with it.',
  '💡 The right insight can save weeks of guessing.',
  '📈 Clear data = faster decisions.',
  '🧩 Data alone is noise. Patterns create value.',

  // Business + environment
  '🌱 Better decisions waste less — time, money, and resources.',
  '♻️ Efficiency is good for business and the planet.',

  // Thought-provoking
  '🧠 Insight isn’t about more data. It’s about better questions.',
  '🔍 Looking at numbers is easy. Understanding them is the real work.',
  '🧭 Good tools don’t decide for you. They help you decide better.',

  // Light humor
  '😄 Don’t worry — no spreadsheets were harmed.',
  '🤖 Teaching the AI what matters right now…',
];

export default function LoadingOverlay({ intervalMs = 2000, statusMessage }: Props) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Cycle with a fade-out, swap, fade-in rhythm
    const cycle = () => {
      // fade out
      setVisible(false);
      // after fade, switch text and fade in
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 320);
    };

    timerRef.current = window.setInterval(cycle, intervalMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [intervalMs]);

  // ensure index is in bounds
  const current = MESSAGES[index % MESSAGES.length];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-50 flex flex-col items-center space-y-3 pointer-events-none">
        {/* Swirling orb */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-md border border-blue-400/20 shadow-[0_0_50px_rgba(59,130,246,0.12)] animate-spin-slow" />

          {/* orbiting dot */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-md animate-orbit" />

          {/* subtle center accent */}
          <div className="absolute w-4 h-4 rounded-full bg-white/6" />
        </div>

        {/* Rotating short sentence (one at a time) */}
        <div className="relative h-6 w-[52ch] max-w-xs text-center">
          <div
            aria-live="polite"
            className={`absolute inset-0 text-sm text-gray-200 leading-6 mx-auto px-2 break-words fade-text ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
          >
            {current}
          </div>
        </div>

        {/* Always-visible small core line (soft) or status message when provided */}
        <div className="text-xs text-gray-300 text-center opacity-90">
          {statusMessage || 'Thinking… please wait'}
        </div>
      </div>
    </div>
  );
}
