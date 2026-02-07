// Dataset and utility tools for a front-end demo of Flipkart-like sales
// Keeps realism, complexity, and supports many UI questions without external APIs.

export const revenueByWeek = [
  { week: "2024-W01", revenue: 12500000, orders: 42000, growth: 0.06 },
  { week: "2024-W02", revenue: 11800000, orders: 39500, growth: -0.056 },
  { week: "2024-W03", revenue: 11450000, orders: 38200, growth: -0.03 },
  { week: "2024-W04", revenue: 12100000, orders: 41000, growth: 0.057 },
];

export const categoryPerformance = [
  { category: "Electronics", revenue: 5200000, change: -0.09, orders: 9200, returnRate: 0.12 },
  { category: "Fashion", revenue: 3800000, change: 0.04, orders: 16200, returnRate: 0.18 },
  { category: "Home & Kitchen", revenue: 2100000, change: 0.02, orders: 9800, returnRate: 0.08 },
  { category: "Grocery", revenue: 1100000, change: 0.05, orders: 16800, returnRate: 0.04 },
];

export const regionalSales = [
  { region: "South India", revenue: 4200000, change: -0.07, orders: 14800 },
  { region: "North India", revenue: 3900000, change: 0.03, orders: 13200 },
  { region: "West India", revenue: 3100000, change: 0.01, orders: 9800 },
  { region: "East India", revenue: 800000, change: -0.02, orders: 3200 },
];

export const sellerPerformance = [
  { seller: "CloudRetail Pvt Ltd", category: "Electronics", region: "South India", revenue: 1800000, fulfillmentRate: 0.91, sellerRating: 3.8, riskScore: 0.75 },
  { seller: "StyleHub", category: "Fashion", region: "North India", revenue: 1450000, fulfillmentRate: 0.96, sellerRating: 4.4, riskScore: 0.2 },
  { seller: "HomeEssentials", category: "Home & Kitchen", region: "West India", revenue: 950000, fulfillmentRate: 0.89, sellerRating: 3.6, riskScore: 0.8 },
  { seller: "MobileKart", category: "Electronics", region: "North India", revenue: 2100000, fulfillmentRate: 0.93, sellerRating: 4.1, riskScore: 0.35 },
  { seller: "UrbanTrends", category: "Fashion", region: "South India", revenue: 1250000, fulfillmentRate: 0.88, sellerRating: 3.5, riskScore: 0.7 },
  { seller: "DailyNeeds Store", category: "Grocery", region: "East India", revenue: 620000, fulfillmentRate: 0.97, sellerRating: 4.6, riskScore: 0.1 },
  { seller: "TechZone", category: "Electronics", region: "West India", revenue: 1320000, fulfillmentRate: 0.87, sellerRating: 3.7, riskScore: 0.78 },
  { seller: "KitchenCraft", category: "Home & Kitchen", region: "South India", revenue: 880000, fulfillmentRate: 0.92, sellerRating: 4.0, riskScore: 0.3 },
  { seller: "KidsWorld", category: "Toys", region: "North India", revenue: 540000, fulfillmentRate: 0.9, sellerRating: 3.9, riskScore: 0.4 },
  { seller: "MegaMart Sellers", category: "Grocery", region: "West India", revenue: 1150000, fulfillmentRate: 0.95, sellerRating: 4.3, riskScore: 0.25 },
];

export const orderFunnel = {
  visits: 520000,
  addToCart: 132000,
  checkout: 72000,
  ordersPlaced: 41000,
  conversionRate: 0.078,
};

export const logisticsHealth = [
  { hub: "Bangalore", onTimeDeliveryRate: 0.94, avgDelayDays: 0.6, risk: "low" },
  { hub: "Delhi NCR", onTimeDeliveryRate: 0.86, avgDelayDays: 1.9, risk: "high" },
  { hub: "Mumbai", onTimeDeliveryRate: 0.9, avgDelayDays: 1.2, risk: "medium" },
];

export const signals = {
  revenueDropDetected: true,
  weakestCategory: "Electronics",
  weakestRegion: "South India",
  highestRiskSeller: "HomeEssentials",
  logisticsRiskHub: "Delhi NCR",
  overallBusinessHealthScore: 0.64,
};

// ---- Types
export type Seller = typeof sellerPerformance[number];
export type Category = typeof categoryPerformance[number];
export type Region = typeof regionalSales[number];

// ---- Utility helpers (frontend-friendly, deterministic)

/**
 * Return sellers ranked by revenue (desc) along with revenue share.
 */
export function getSellerRanking(sellers: Seller[] = sellerPerformance) {
  const total = sellers.reduce((s, x) => s + x.revenue, 0) || 1;
  return sellers
    .map(s => ({ ...s, revenueShare: +(s.revenue / total).toFixed(4) }))
    .sort((a, b) => b.revenue - a.revenue);
}

/**
 * Return high-risk sellers. Uses a combination of explicit riskScore and signals
 * such as low fulfillment or low seller rating. Defaults are conservative.
 */
export function getHighRiskSellers(
  sellers: Seller[] = sellerPerformance,
  options: { riskThreshold?: number; fulfillmentThreshold?: number; ratingThreshold?: number } = {}
) {
  const { riskThreshold = 0.6, fulfillmentThreshold = 0.9, ratingThreshold = 3.8 } = options;

  return sellers
    .filter(s => s.riskScore >= riskThreshold || s.fulfillmentRate < fulfillmentThreshold || s.sellerRating < ratingThreshold)
    .sort((a, b) => b.riskScore - a.riskScore || a.fulfillmentRate - b.fulfillmentRate);
}

/**
 * Aggregate category breakdown and percent of total revenue.
 */
export function getCategoryBreakdown(categories: Category[] = categoryPerformance) {
  const total = categories.reduce((s, c) => s + c.revenue, 0) || 1;
  return categories.map(c => ({
    ...c,
    revenueShare: +(c.revenue / total).toFixed(4),
  }));
}

/**
 * Return regional issues: regions with negative change and cross-check with signals.
 */
export function getRegionalIssues(regions: Region[] = regionalSales) {
  const issues = regions
    .filter(r => r.change < 0)
    .map(r => ({
      ...r,
      note: r.change < 0 ? 'declining' : 'stable',
    }));

  // include the weakest region from derived signals as a highlighted issue
  if (signals.weakestRegion) {
    const found = regions.find(r => r.region === signals.weakestRegion);
    if (found && !issues.find(i => i.region === found.region)) {
      issues.push({ ...found, note: 'identified-by-signal' as const });
    }
  }

  return issues;
}

export const flipkartSalesDataset = {
  revenueByWeek,
  categoryPerformance,
  regionalSales,
  sellerPerformance,
  orderFunnel,
  logisticsHealth,
  signals,
};

// Small convenience exports for UIs
export const tools = {
  getSellerRanking,
  getHighRiskSellers,
  getCategoryBreakdown,
  getRegionalIssues,
};
