# Component Props Validation Fix

## The Problem

**Error:** "Component props validation failed: Invalid input: expected array, received undefined"

**Root Cause:** Components were typed as accepting **optional** props (`data?: any`), but Zod schemas defined `data` as **required**. This mismatch caused Tambo's validation to fail when trying to render components.

## The Fix

### Before (WRONG):
```typescript
// Component typed with optional data
interface Props {
  data?: any;  // ❌ Optional, no type safety
}

export default function TrendView({ data }: Props) {
  // ...
}
```

### After (CORRECT):
```typescript
// Component typed with required, strongly-typed data
interface TrendDataPoint {
  week: string;
  revenue: number;
  orders: number;
  growth: number;
}

interface Props {
  data: TrendDataPoint[];  // ✅ Required array with exact structure
}

export default function TrendView({ data }: Props) {
  // ...
}
```

## Files Updated

1. **TrendView.tsx** - Now expects `TrendDataPoint[]` (required)
2. **BreakdownView.tsx** - Now expects `CategoryDataPoint[]` (required)
3. **RankingView.tsx** - Now expects `SellerDataPoint[]` (required)
4. **ActionsView.tsx** - Now expects `ActionData` object (required)
5. **fallbackRenderer.tsx** - Updated to pass correct data structure

## Why This Matters

Tambo validates component props using the Zod schemas you defined in `manifest.ts`. The component TypeScript types **MUST** match the Zod schemas exactly, or validation will fail:

```typescript
// Zod schema in manifest.ts
propsSchema: z.object({
  data: z.array(z.object({  // Required array
    week: z.string(),
    revenue: z.number(),
    orders: z.number(),
    growth: z.number(),
  })),
})

// Component TypeScript type MUST match
interface Props {
  data: Array<{  // Same structure
    week: string;
    revenue: number;
    orders: number;
    growth: number;
  }>;
}
```

## Test Now

Refresh `http://localhost:5174` and click "UNDERSTAND" again. The validation error should be gone and the component should render properly!
