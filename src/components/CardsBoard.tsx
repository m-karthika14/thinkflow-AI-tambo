import { useState, useEffect } from 'react';

interface CardsBoardProps {
  cards: any[];
  onThinkWithThis: (ctx: any) => void;
  onBackToHome?: () => void;
}

export default function CardsBoard({ cards, onThinkWithThis, onBackToHome }: CardsBoardProps) {
  const [focusedCard, setFocusedCard] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.slice(0, 6).map((c: any, i: number) => {
          const isOtherFocused = !!focusedCard && focusedCard !== c;
          // subtle scattered transform per index
          const dx = ((i % 3) - 1) * 6; // -6,0,6
          const dy = Math.floor(i / 3) * 6; // 0 or 6
          const rot = i % 2 === 0 ? -2 : 2;

          return (
            <div
              key={c.sellerId ?? c.id ?? c.name}
              onClick={() => setFocusedCard(c)}
              className={
                `p-4 bg-white/3 rounded-md border cursor-pointer transform transition-all duration-500 ease-out ` +
                `${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}` +
                `${isOtherFocused ? ' opacity-30 blur-sm scale-95 pointer-events-none' : ''}`}
              style={{
                transitionDelay: `${i * 80}ms`,
                transform: `${isOtherFocused ? 'none' : `translate(${dx}px, ${dy}px) rotate(${rot}deg)`}`,
              }}
            >
              <div className="text-sm font-semibold">{c.name ?? c.sellerId ?? 'Seller'}</div>
              <div className="text-xs text-gray-300">Revenue: {c.revenue}</div>
              <div className="text-xs text-gray-400">Risk: {c.riskScore ?? 'n/a'}</div>
            </div>
          );
        })}
      </div>

      {/* Focus overlay (full-screen focused card) */}
      {focusedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* overlay hides other UI but keeps background visible */}
          <div className="absolute inset-0 bg-black/30" />

          <div className="relative z-50 w-full h-full flex items-center justify-center">
            <div className="absolute left-4 top-4">
              <button
                onClick={() => {
                  if (typeof onBackToHome === 'function') {
                    onBackToHome();
                  } else {
                    setFocusedCard(null);
                  }
                }}
                className="px-3 py-2 bg-white/5 rounded text-sm"
              >
                ← Back
              </button>
            </div>

            <div className="w-11/12 h-5/6 bg-gray-900/80 p-6 rounded-md overflow-auto">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-semibold">{focusedCard.name ?? focusedCard.sellerId}</div>
                  <div className="text-sm text-gray-300">Revenue: {focusedCard.revenue}</div>
                  <div className="text-sm text-gray-300">Risk score: {focusedCard.riskScore ?? 'N/A'}</div>
                </div>
                <div className="flex items-start space-x-2">
                  <button
                    onClick={() => setFocusedCard(null)}
                    className="px-3 py-2 bg-white/5 rounded text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <pre className="text-xs text-gray-200 whitespace-pre-wrap">{JSON.stringify(focusedCard, null, 2)}</pre>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    const ctx = { type: 'seller', id: focusedCard.sellerId ?? focusedCard.id ?? focusedCard.name, source: 'CardsBoard', card: focusedCard };
                    setFocusedCard(null);
                    onThinkWithThis(ctx);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Think with this
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
