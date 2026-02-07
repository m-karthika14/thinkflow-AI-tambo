// ✅ MUST match Zod schema exactly (data is required, not optional)
interface TrendDataPoint {
  week: string;
  revenue: number;
  orders: number;
  growth: number;
}

interface Props {
  data?: TrendDataPoint[]; // Make optional
}

export default function TrendView({ data = [] }: Props) {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  
  return (
    <div className="p-6 bg-gray-900/60 rounded-md border border-blue-400/10">
      <h3 className="text-lg font-medium text-gray-100 mb-4">Revenue Trend</h3>
      
      {/* Chart */}
      <div className="mb-6 h-48 flex items-end gap-2">
        {data.map((point, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all hover:from-blue-400 hover:to-blue-300"
                 style={{ height: `${(point.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                 title={`$${(point.revenue / 1000000).toFixed(1)}M`}
            />
            <span className="text-[10px] text-gray-400 rotate-45 origin-left mt-2">{point.week}</span>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="text-xs text-gray-400 bg-black/20 rounded p-3">
        <div className="grid grid-cols-4 gap-2 font-medium mb-2 text-gray-300">
          <div>Week</div>
          <div>Revenue</div>
          <div>Orders</div>
          <div>Growth</div>
        </div>
        {data.map((point, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 py-1 border-t border-gray-800">
            <div>{point.week}</div>
            <div>${(point.revenue / 1000000).toFixed(2)}M</div>
            <div>{point.orders.toLocaleString()}</div>
            <div className={point.growth >= 0 ? 'text-green-400' : 'text-red-400'}>
              {(point.growth * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
