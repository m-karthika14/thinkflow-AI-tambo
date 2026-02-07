import { useState } from 'react';
import * as analytics from '../tools/analytics';
import TrendView from './tambo/TrendView';
import BreakdownView from './tambo/BreakdownView';
import RankingView from './tambo/RankingView';
import ActionsView from './tambo/ActionsView';

type Intent = 'EXPLORE' | 'UNDERSTAND' | 'DECIDE' | 'ACT';

export default function LocalThinkflowDummy() {
  const [query, setQuery] = useState('');
  const [intent, setIntent] = useState<Intent | null>(null);
  const [focusedCard, setFocusedCard] = useState<any | null>(null);
  const [focusedContext, setFocusedContext] = useState<any | null>(null);

  // Sample cards (use seller ranking for simple data-driven cards)
  const cards = analytics.getSellerRanking().slice(0, 6);

  const handleIntentClick = (i: Intent) => {
    // Intent must be explicitly clicked to change UI
    setIntent(i);
  };

  const handleThinkWithThis = (card: any) => {
    // Attach card as context and return to home
    setFocusedContext({ type: 'seller', id: card.sellerId ?? card.id ?? card.name, source: 'RankingView', card });
    setFocusedCard(null);
  };

  const renderResults = () => {
    if (!intent) return null;

    // Map intents to presentational components and feed them data (no logic inside components)
    switch (intent) {
      case 'EXPLORE':
        return <TrendView data={analytics.getRevenueTrend()} />;
      case 'UNDERSTAND':
        return <BreakdownView data={{ weekChange: analytics.getWeekChange(), categories: analytics.getCategoryBreakdown() }} />;
      case 'DECIDE':
        return <RankingView data={{ sellers: analytics.getSellerRanking(), priority: analytics.getPrioritySignals() }} />;
      case 'ACT':
        return <ActionsView data={analytics.getActionItems()} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type context (e.g. 'South India electronics')"
          className="flex-1 px-3 py-2 rounded-md bg-white/5 text-sm text-gray-100"
        />
        <div className="flex space-x-2">
          {(['EXPLORE', 'UNDERSTAND', 'DECIDE', 'ACT'] as Intent[]).map(i => (
            <button
              key={i}
              onClick={() => handleIntentClick(i)}
              className={`px-3 py-2 rounded-md text-xs font-medium ${intent === i ? 'bg-blue-600' : 'bg-white/5'}`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-300">{focusedContext ? `Thinking with 1 selected insight (id: ${focusedContext.id})` : 'No context attached'}</div>

      {/* Cards area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c: any) => (
          <div key={c.sellerId ?? c.id ?? c.name} className="p-3 bg-white/3 rounded-md border">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-semibold">{c.sellerId ?? c.name}</div>
                <div className="text-xs text-gray-300">Revenue: {c.revenue}</div>
              </div>
              <div className="flex flex-col space-y-2">
                <button onClick={() => setFocusedCard(c)} className="text-xs px-2 py-1 bg-white/5 rounded">Focus</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Focus modal */}
      {focusedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white/6 p-6 rounded-md w-11/12 max-w-lg">
            <div className="mb-4">
              <div className="text-lg font-semibold">{focusedCard.sellerId ?? focusedCard.name}</div>
              <div className="text-sm text-gray-300">Source: RankingView</div>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setFocusedCard(null)} className="px-3 py-2 bg-white/5 rounded">Close</button>
              <button onClick={() => handleThinkWithThis(focusedCard)} className="px-3 py-2 bg-blue-600 rounded text-white">Think with this</button>
            </div>
          </div>
        </div>
      )}

      {/* Results area (renders only after intent click) */}
      <div className="mt-4">
        {intent ? (
          <div className="space-y-3">
            <div className="text-xs text-gray-400">Results for intent: {intent}{query ? ` · query: ${query}` : ''}{focusedContext ? ' · context attached' : ''}</div>
            <div>{renderResults()}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-400">Type a query and click an intent to reorganize the UI.</div>
        )}
      </div>
    </div>
  );
}
