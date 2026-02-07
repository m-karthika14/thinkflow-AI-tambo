// ✅ MUST match Zod schema exactly (data is required, not optional)
interface CategoryDataPoint {
  category: string;
  revenue: number;
  change: number;
  orders: number;
  returnRate: number;
  revenueShare: number;
}

interface Props {
  data?: CategoryDataPoint[]; // Make optional
}

export default function BreakdownView({ data = [] }: Props) {
  return (
    <div className="p-6 bg-gray-900/60 rounded-md border border-violet-400/10">
      <h3 className="text-lg font-medium text-gray-100 mb-4">Category Breakdown</h3>

      {/* Pie Chart (as horizontal bars showing revenue share) */}
      <div className="mb-6 space-y-2">
        {data.map((c, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300">{c.category}</span>
              <span className="text-gray-400">{(c.revenueShare * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-6 bg-gray-800/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-violet-400 transition-all"
                style={{ width: `${c.revenueShare * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="text-gray-400">
              <th className="pb-2">Category</th>
              <th className="pb-2">Revenue</th>
              <th className="pb-2">Change</th>
              <th className="pb-2">Orders</th>
              <th className="pb-2">Return Rate</th>
              <th className="pb-2">Share</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c, i) => (
              <tr key={i} className="border-t border-gray-800">
                <td className="py-2 text-gray-100">{c.category}</td>
                <td className="py-2 text-gray-200">${(c.revenue / 1000000).toFixed(2)}M</td>
                <td className={`py-2 ${c.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(c.change * 100).toFixed(1)}%
                </td>
                <td className="py-2 text-gray-200">{c.orders.toLocaleString()}</td>
                <td className="py-2 text-gray-200">{(c.returnRate * 100).toFixed(1)}%</td>
                <td className="py-2 text-gray-200">{(c.revenueShare * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
