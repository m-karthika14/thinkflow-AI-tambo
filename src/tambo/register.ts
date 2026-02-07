import * as analytics from '../tools/analytics';

import TrendView from '../components/tambo/TrendView';
import BreakdownView from '../components/tambo/BreakdownView';
import RankingView from '../components/tambo/RankingView';
import RiskView from '../components/tambo/RiskView';
import ActionsView from '../components/tambo/ActionsView';

export type ToolDescriptor = {
  name: string;
  description: string;
  fn: (...args: any[]) => any;
};

export type ComponentDescriptor = {
  name: string;
  component: any;
  description: string;
};

export const tools: ToolDescriptor[] = [
  { name: 'getRevenueTrend', description: 'Returns revenue and order trend over time.', fn: analytics.getRevenueTrend },
  { name: 'getOrderFunnel', description: 'Returns funnel metrics for visits, cart, checkout, orders.', fn: analytics.getOrderFunnel },
  { name: 'getWeekChange', description: 'Returns week-over-week change summary.', fn: analytics.getWeekChange },
  { name: 'getCategoryBreakdown', description: 'Returns revenue breakdown by category.', fn: analytics.getCategoryBreakdown },
  { name: 'getRegionalBreakdown', description: 'Returns revenue breakdown by region.', fn: analytics.getRegionalBreakdown },
  { name: 'getSellerRanking', description: 'Returns seller ranking by revenue.', fn: analytics.getSellerRanking },
  { name: 'getCategoryRanking', description: 'Returns category ranking by revenue impact.', fn: analytics.getCategoryRanking },
  { name: 'getHighRiskSellers', description: 'Returns sellers filtered by risk and quality thresholds.', fn: analytics.getHighRiskSellers },
  { name: 'getRegionalIssues', description: 'Returns regions with declining performance.', fn: analytics.getRegionalIssues },
  { name: 'getLogisticsRisks', description: 'Returns logistics hubs with elevated delivery risk.', fn: analytics.getLogisticsRisks },
  { name: 'getPrioritySignals', description: 'Returns priority signal bundle for downstream reasoning.', fn: analytics.getPrioritySignals },
  { name: 'getActionItems', description: 'Returns structured action items (non-textual).', fn: analytics.getActionItems },
];

export const components: ComponentDescriptor[] = [
  { name: 'TrendView', component: TrendView, description: 'Visualizes revenue trends.' },
  { name: 'BreakdownView', component: BreakdownView, description: 'Visualizes category and regional breakdowns.' },
  { name: 'RankingView', component: RankingView, description: 'Visualizes ranked entities.' },
  { name: 'RiskView', component: RiskView, description: 'Visualizes risk and outlier signals.' },
  { name: 'ActionsView', component: ActionsView, description: 'Visualizes structured next actions.' },
];

export const manifest = {
  tools,
  components,
};

export function registerWithTambo() {
  try {
    const w = window as any;
    if (w?.Tambo && typeof w.Tambo.registerManifest === 'function') {
      w.Tambo.registerManifest(manifest);
      return;
    }

    window.postMessage({ type: 'tambo:register', manifest }, '*');
  } catch {
    // silent fallback
  }
}
