import {
  revenueByWeek,
  categoryPerformance,
  regionalSales,
  sellerPerformance,
  orderFunnel,
  logisticsHealth,
  signals,
} from "../data/flipkartSales";

/* =========================================================
  1️⃣ OVERVIEW / STATUS (EXPLORE)
  ========================================================= */

/** Overall revenue + order trend */
export function getRevenueTrend() {
  return revenueByWeek;
}

/** Funnel health */
export function getOrderFunnel() {
  return orderFunnel;
}

/* =========================================================
  2️⃣ CHANGE / DELTA (UNDERSTAND)
  ========================================================= */

/** Week-over-week change summary */
export function getWeekChange() {
  if (revenueByWeek.length < 2) return null;
  const last = revenueByWeek[revenueByWeek.length - 1];
  const prev = revenueByWeek[revenueByWeek.length - 2];

  return {
    currentWeek: last.week,
    revenueChange: last.revenue - prev.revenue,
    orderChange: last.orders - prev.orders,
    growth: last.growth,
  };
}

/* =========================================================
  3️⃣ BREAKDOWNS (UNDERSTAND)
  ========================================================= */

/** Revenue breakdown by category */
export function getCategoryBreakdown() {
  const total = categoryPerformance.reduce((s, c) => s + c.revenue, 0) || 1;
  return categoryPerformance.map(c => ({
    ...c,
    revenueShare: +(c.revenue / total).toFixed(4),
  }));
}

/** Revenue breakdown by region */
export function getRegionalBreakdown() {
  const total = regionalSales.reduce((s, r) => s + r.revenue, 0) || 1;
  return regionalSales.map(r => ({
    ...r,
    revenueShare: +(r.revenue / total).toFixed(4),
  }));
}

/* =========================================================
  4️⃣ COMPARISON / RANKING (DECIDE)
  ========================================================= */

/** Rank sellers by revenue */
export function getSellerRanking() {
  return [...sellerPerformance].sort((a, b) => b.revenue - a.revenue);
}

/** Rank categories by revenue impact */
export function getCategoryRanking() {
  return [...categoryPerformance].sort((a, b) => b.revenue - a.revenue);
}

/* =========================================================
  5️⃣ RISK / OUTLIERS (DECIDE)
  ========================================================= */

/** High-risk sellers */
export function getHighRiskSellers(
  riskThreshold = 0.6,
  fulfillmentThreshold = 0.9,
  ratingThreshold = 3.8
) {
  return sellerPerformance.filter(
    s =>
      s.riskScore >= riskThreshold ||
      s.fulfillmentRate < fulfillmentThreshold ||
      s.sellerRating < ratingThreshold
  );
}

/** Regions with declining performance */
export function getRegionalIssues() {
  return regionalSales.filter(r => r.change < 0);
}

/** Logistics risk hubs */
export function getLogisticsRisks() {
  return logisticsHealth.filter(h => h.risk !== "low");
}

/* =========================================================
  6️⃣ PRIORITIZATION (DECIDE)
  ========================================================= */

/**
 * Combine risk + impact to decide focus areas
 * This is what DECIDE mode uses
 */
export function getPrioritySignals() {
  return {
    weakestCategory: signals.weakestCategory,
    weakestRegion: signals.weakestRegion,
    highestRiskSeller: signals.highestRiskSeller,
    logisticsRiskHub: signals.logisticsRiskHub,
  };
}

/* =========================================================
  7️⃣ ACTION / ACT
  ========================================================= */

/**
 * Final action recommendations (STRUCTURAL, NOT TEXTUAL)
 */
export function getActionItems() {
  return {
    revenueDropDetected: signals.revenueDropDetected,
    focusCategory: signals.weakestCategory,
    focusRegion: signals.weakestRegion,
    fixSeller: signals.highestRiskSeller,
    checkLogisticsHub: signals.logisticsRiskHub,
    businessHealthScore: signals.overallBusinessHealthScore,
  };
}

/* =========================================================
   8️⃣ UNIVERSAL EXPORT (IMPORTANT)
   ========================================================= */

export const tools = {
  // EXPLORE
  getRevenueTrend,
  getOrderFunnel,

  // UNDERSTAND
  getWeekChange,
  getCategoryBreakdown,
  getRegionalBreakdown,

  // DECIDE / COMPARE
  getSellerRanking,
  getCategoryRanking,

  // DECIDE / RISK
  getHighRiskSellers,
  getRegionalIssues,
  getLogisticsRisks,

  // DECIDE
  getPrioritySignals,

  // ACT
  getActionItems,
};
