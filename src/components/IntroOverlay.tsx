import { useEffect, useState } from 'react';
import NeuralBackground from './NeuralBackground';

type Props = {
  open: boolean;
  onClose: () => void;
  activeIntent?: number;
};

// Full-screen intro overlay that contains only the neural background + centered intro card.
// When dismissed it slides left like a PPT slide. This component intentionally renders
// nothing else so the intro page contains only the shown contents.
export default function IntroOverlay({ open, onClose, activeIntent = 0 }: Props) {
  const [closing, setClosing] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (!open) return;
    setClosing(false);
  }, [open]);

  const handleClick = () => {
    if (clicked) return; // prevent double-clicks while animating
    setClicked(true);

    // Run a short button animation, then start the slide, and finally close.
    // Timeline: 600ms button animation -> 700ms slide -> unmount
    window.setTimeout(() => setClosing(true), 600);

    window.setTimeout(() => {
      onClose();
      setClosing(false);
      setClicked(false);
    }, 600 + 700);
  };

  if (!open && !closing) return null;

  return (
    <div className="fixed inset-0 z-50">

      {/* Sliding wrapper: moves the whole overlay (including backdrop) left when closing */}
      <div
        className={
          'absolute inset-0 transform transition-transform duration-700 ease-in-out overflow-hidden p-6 ' +
          (closing ? '-translate-x-full' : 'translate-x-0')
        }
      >
        {/* Backdrop: solid gradient so the intro fully hides the home page beneath it. */}
        <div className={`absolute inset-0 ${
          'bg-gradient-to-br from-[#0B0F14] via-[#0F1419] to-[#111827]'
        }`} />

        {/* Neural visuals cover the full overlay (on top of the moving backdrop) */}
        <div className="absolute inset-0 pointer-events-none">
          <NeuralBackground activeIntent={activeIntent} />
        </div>

        {/* Intro content: Hero, Problem, Explanation Cards, Core Principle */}
        <div className="relative w-full px-6 lg:px-12 text-center pointer-events-auto">
          <div className="mx-auto max-w-6xl py-16 flex flex-col items-center gap-8">
            {/* Hero */}
            <header className="pt-16 pb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white" style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial", letterSpacing: '0.06em' }}>
                thinkflow AI
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Tired of reading massive datasets, endless tabs, and confusing dashboards?
                <br />
                ThinkFlow turns business data chaos into something visual, focused, and easy to understand.
              </p>

              <div className="mt-8">
                {/* Sci‑fi CTA: layered glow, scan line, and subtle motion */}
                <div className="relative inline-block">
                  <style>{`
                    @keyframes scanX { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
                    @keyframes neonPulse { 0% { box-shadow: 0 6px 20px rgba(59,130,246,0.18), 0 0 30px rgba(59,130,246,0.06); } 50% { box-shadow: 0 10px 30px rgba(91,60,255,0.20), 0 0 48px rgba(0,210,255,0.07); } 100% { box-shadow: 0 6px 20px rgba(59,130,246,0.18), 0 0 30px rgba(59,130,246,0.06); } }
                    @keyframes burstUp {
                      0% { transform: translateY(0) scale(1); opacity: 1; }
                      100% { transform: translateY(-36px) scale(0.6); opacity: 0; }
                    }
                    @keyframes btnJiggle { 0% { transform: translateY(0); } 30% { transform: translateY(-3px) scale(1.02); } 100% { transform: translateY(0); } }
                    .scifi-cta.clicked { animation: btnJiggle 600ms ease-out forwards; }
                    .scifi-burst { position: absolute; inset: 0; pointer-events: none; }
                    .scifi-burst span { position: absolute; bottom: 14px; width: 8px; height: 8px; border-radius: 999px; opacity: 0; }
                    .scifi-burst span:nth-child(1) { left: 14%; background: rgba(255,255,255,0.9); animation: burstUp 700ms ease-out forwards; }
                    .scifi-burst span:nth-child(2) { left: 28%; background: rgba(0,210,255,0.9); animation: burstUp 760ms ease-out forwards; }
                    .scifi-burst span:nth-child(3) { left: 42%; background: rgba(91,60,255,0.9); animation: burstUp 720ms ease-out forwards; }
                    .scifi-burst span:nth-child(4) { left: 58%; background: rgba(255,255,255,0.85); animation: burstUp 700ms ease-out forwards; }
                    .scifi-burst span:nth-child(5) { left: 72%; background: rgba(0,210,255,0.8); animation: burstUp 780ms ease-out forwards; }
                    .scifi-burst span:nth-child(6) { left: 86%; background: rgba(91,60,255,0.85); animation: burstUp 740ms ease-out forwards; }
                  `}</style>

                  <button
                    onClick={handleClick}
                    className={`relative z-20 inline-flex items-center px-7 py-3 rounded-xl text-sm font-semibold text-white select-none focus:outline-none scifi-cta ${clicked ? 'clicked' : ''}`}
                    style={{
                      background: 'linear-gradient(90deg,#2b6ef6 0%,#5b3cff 50%,#00d2ff 100%)',
                      boxShadow: '0 8px 30px rgba(59,130,246,0.18)',
                    }}
                  >
                    <span className="relative z-20">{clicked ? 'Launching...' : 'Start Analyzing Smarter'}</span>
                  </button>

                  {/* burst particles (rendered when clicked) */}
                  {clicked && (
                    <div className="scifi-burst" aria-hidden>
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  )}

                  {/* animated neon glow layer underneath */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-xl -z-10"
                    style={{
                      background: 'linear-gradient(90deg,#2b6ef6 0%,#5b3cff 50%,#00d2ff 100%)',
                      filter: 'blur(18px)',
                      opacity: 0.7,
                      animation: 'neonPulse 2.4s ease-in-out infinite',
                    }}
                  />

                  {/* scanning highlight */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-0.5 w-48 rounded-sm -z-5"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
                      opacity: 0.6,
                      transform: 'translateX(-120%)',
                      animation: 'scanX 2s linear infinite',
                    }}
                  />
                </div>

              </div>
            </header>

           

            {/* Explanation Cards (glassmorphic, elevated, icons above title, moved slightly up) */}
            <section className="mt-6 -translate-y-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="relative rounded-3xl p-6 bg-white/6 backdrop-blur-md border border-white/8 shadow-[0_30px_60px_rgba(2,6,23,0.6)] transition transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  {/* Professional icon (lightbulb) */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17h4.5M12 3v1.5M7.5 6l.75 1.299A6 6 0 0012 12v0a6 6 0 003.75-4.701L16.5 6" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold">Think in Intent, Not Tabs</h4>
                  <p className="mt-3 text-sm text-gray-300">Business users explore, understand, decide, and act — not click menus.</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="relative rounded-3xl p-6 bg-white/6 backdrop-blur-md border border-white/8 shadow-[0_30px_60px_rgba(2,6,23,0.6)] transition transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 17a2 2 0 104 0v-5a2 2 0 00-2-2h-1V6H9v4H8a2 2 0 00-2 2v5a2 2 0 002 2h3z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold">Dashboards Create Confusion</h4>
                  <p className="mt-3 text-sm text-gray-300">Large datasets and static layouts overwhelm users.</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="relative rounded-3xl p-6 bg-white/6 backdrop-blur-md border border-white/8 shadow-[0_30px_60px_rgba(2,6,23,0.6)] transition transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold">The UI Adapts to You</h4>
                  <p className="mt-3 text-sm text-gray-300">Change your intent, and the interface reorganizes itself.</p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="relative rounded-3xl p-6 bg-white/6 backdrop-blur-md border border-white/8 shadow-[0_30px_60px_rgba(2,6,23,0.6)] transition transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold">Built for Real Business Data</h4>
                  <p className="mt-3 text-sm text-gray-300">Demo uses Flipkart-style synthetic data; production connects to live databases.</p>
                </div>
              </div>
            </section>

            {/* Core principle removed as requested */}
          </div>
        </div>
      </div>
    </div>
  );
}
