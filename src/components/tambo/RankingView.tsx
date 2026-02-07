// ✅ MUST match Zod schema exactly (data is required, not optional)
interface SellerDataPoint {
  seller: string;
  category: string;
  region: string;
  revenue: number;
  fulfillmentRate: number;
  sellerRating: number;
  riskScore: number;
}

interface Props {
  data?: SellerDataPoint[]; // Make optional
}

export default function RankingView({ data = [] }: Props) {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  
  return (
    <div className="p-6 bg-gray-900/60 rounded-md border border-green-400/10">
      <h3 className="text-lg font-medium text-gray-100 mb-4">Seller Ranking</h3>
      
      {/* Chart - Horizontal bars */}
      <div className="mb-6 space-y-3">
        {data.slice(0, 10).map((seller, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300 flex items-center gap-2">
                <span className="text-gray-500">#{i + 1}</span>
                {seller.seller}
              </span>
              <span className="text-gray-400">${(seller.revenue / 1000000).toFixed(1)}M</span>
            </div>
            <div className="w-full h-4 bg-gray-800/50 rounded overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all"
                style={{ width: `${(seller.revenue / maxRevenue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Data Details */}
      <div className="text-xs bg-black/20 rounded p-3 space-y-2">
        {data.slice(0, 5).map((seller, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
            <div>
              <div className="text-gray-200 font-medium">{seller.seller}</div>
              <div className="text-gray-500 text-[10px]">{seller.category} • {seller.region}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-200">${(seller.revenue / 1000000).toFixed(2)}M</div>
              <div className="text-gray-500 text-[10px]">
                Rating: {seller.sellerRating.toFixed(1)} • 
                Risk: {(seller.riskScore * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
