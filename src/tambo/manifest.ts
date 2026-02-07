import type { TamboComponent, TamboTool } from "@tambo-ai/react";
import { defineTool } from "@tambo-ai/react";
import { z } from "zod";
import * as analytics from "../tools/analytics";
import TrendView from "../components/tambo/TrendView";
import BreakdownView from "../components/tambo/BreakdownView";
import RankingView from "../components/tambo/RankingView";
import ActionsView from "../components/tambo/ActionsView";

// ✅ CORRECT: Use Zod schemas (not JSON Schema)
export const tamboTools: TamboTool[] = [
  defineTool({
    name: "getRevenueTrend",
    description: "Returns revenue and order trend over time for analytics.",
    tool: () => analytics.getRevenueTrend(),
    inputSchema: z.object({}),
    outputSchema: z.array(z.object({
      week: z.string(),
      revenue: z.number(),
      orders: z.number(),
      growth: z.number(),
    })),
  }),
  defineTool({
    name: "getCategoryBreakdown",
    description: "Returns revenue breakdown by product category with revenue share percentages.",
    tool: () => analytics.getCategoryBreakdown(),
    inputSchema: z.object({}),
    outputSchema: z.array(z.object({
      category: z.string(),
      revenue: z.number(),
      change: z.number(),
      orders: z.number(),
      returnRate: z.number(),
      revenueShare: z.number(),
    })),
  }),
  defineTool({
    name: "getSellerRanking",
    description: "Returns seller ranking sorted by revenue performance with risk metrics.",
    tool: () => analytics.getSellerRanking(),
    inputSchema: z.object({}),
    outputSchema: z.array(z.object({
      seller: z.string(),
      category: z.string(),
      region: z.string(),
      revenue: z.number(),
      fulfillmentRate: z.number(),
      sellerRating: z.number(),
      riskScore: z.number(),
    })),
  }),
  defineTool({
    name: "getActionItems",
    description: "Returns recommended action items and business health score.",
    tool: () => analytics.getActionItems(),
    inputSchema: z.object({}),
    outputSchema: z.object({
      revenueDropDetected: z.boolean(),
      focusCategory: z.string(),
      focusRegion: z.string(),
      fixSeller: z.string(),
      checkLogisticsHub: z.string(),
      businessHealthScore: z.number(),
    }),
  }),
];

// ✅ Components with explicit usage descriptions
export const tamboComponents: TamboComponent[] = [
  {
    name: "TrendView",
    description: "Use this to visualize revenue trends when the user wants to EXPLORE. Call getRevenueTrend() first, then render this component with the data.",
    component: TrendView,
    propsSchema: z.object({
      data: z.array(z.object({
        week: z.string().optional().default(""),
        revenue: z.number().optional().default(0),
        orders: z.number().optional().default(0),
        growth: z.number().optional().default(0),
      })).optional().default([]),
    }),
  },
  {
    name: "BreakdownView",
    description: "Use this to show category breakdown when the user wants to UNDERSTAND. Call getCategoryBreakdown() first, then render this component with the data.",
    component: BreakdownView,
    propsSchema: z.object({
      data: z.array(z.object({
        category: z.string().optional().default(""),
        revenue: z.number().optional().default(0),
        change: z.number().optional().default(0),
        orders: z.number().optional().default(0),
        returnRate: z.number().optional().default(0),
        revenueShare: z.number().optional().default(0),
      })).optional().default([]),
    }),
  },
  {
    name: "RankingView",
    description: "Use this to display seller rankings when the user wants to DECIDE. Call getSellerRanking() first, then render this component with the data.",
    component: RankingView,
    propsSchema: z.object({
      data: z.array(z.object({
        seller: z.string().optional().default(""),
        category: z.string().optional().default(""),
        region: z.string().optional().default(""),
        revenue: z.number().optional().default(0),
        fulfillmentRate: z.number().optional().default(0),
        sellerRating: z.number().optional().default(0),
        riskScore: z.number().optional().default(0),
      })).optional().default([]),
    }),
  },
  {
    name: "ActionsView",
    description: "Use this to show action recommendations when the user wants to ACT. Call getActionItems() first, then render this component with the data.",
    component: ActionsView,
    propsSchema: z.object({
      data: z.object({
        revenueDropDetected: z.boolean().optional().default(false),
        focusCategory: z.string().optional().default(""),
        focusRegion: z.string().optional().default(""),
        fixSeller: z.string().optional().default(""),
        checkLogisticsHub: z.string().optional().default(""),
        businessHealthScore: z.number().optional().default(0),
      }).optional().default({
        revenueDropDetected: false,
        focusCategory: "",
        focusRegion: "",
        fixSeller: "",
        checkLogisticsHub: "",
        businessHealthScore: 0,
      }),
    }),
  },
];
