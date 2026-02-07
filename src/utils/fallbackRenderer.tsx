import TrendView from '../components/tambo/TrendView';
import BreakdownView from '../components/tambo/BreakdownView';
import RankingView from '../components/tambo/RankingView';
import ActionsView from '../components/tambo/ActionsView';
import * as analytics from '../tools/analytics';

/**
 * Fallback renderer - renders components directly when Tambo fails
 * ✅ Now matches the updated component prop types
 */
export function renderFallbackComponent(intent: string) {
  console.log('[fallback] Rendering fallback component for intent:', intent);

  switch (intent.toUpperCase()) {
    case 'EXPLORE': {
      const data = analytics.getRevenueTrend();
      return <TrendView data={data} />;
    }
    case 'UNDERSTAND': {
      const data = analytics.getCategoryBreakdown();
      return <BreakdownView data={data} />;
    }
    case 'DECIDE': {
      const data = analytics.getSellerRanking();
      return <RankingView data={data} />;
    }
    case 'ACT': {
      const data = analytics.getActionItems();
      return <ActionsView data={data} />;
    }
    default: {
      const data = analytics.getRevenueTrend();
      return <TrendView data={data} />;
    }
  }
}
