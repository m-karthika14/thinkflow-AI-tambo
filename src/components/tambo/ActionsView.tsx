// ✅ MUST match Zod schema exactly (data is required, not optional)
interface ActionData {
  revenueDropDetected: boolean;
  focusCategory: string;
  focusRegion: string;
  fixSeller: string;
  checkLogisticsHub: string;
  businessHealthScore: number;
}

interface Props {
  data?: ActionData; // Make optional
}

const defaultData: ActionData = {
  revenueDropDetected: false,
  focusCategory: "",
  focusRegion: "",
  fixSeller: "",
  checkLogisticsHub: "",
  businessHealthScore: 0,
};

export default function ActionsView({ data = defaultData }: Props) {
  const healthColor = data.businessHealthScore >= 0.7 ? 'green' : data.businessHealthScore >= 0.5 ? 'yellow' : 'red';
  
  return (
    <div className="p-6 bg-gray-900/60 rounded-md border border-yellow-400/10">
      <h3 className="text-lg font-medium text-gray-100 mb-4">Recommended Actions</h3>
      
      {/* Health Score Chart */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Business Health Score</span>
          <span className={`text-2xl font-bold text-${healthColor}-400`}>
            {(data.businessHealthScore * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-8 bg-gray-800/50 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r from-${healthColor}-500 to-${healthColor}-400 transition-all`}
            style={{ width: `${data.businessHealthScore * 100}%` }}
          />
        </div>
      </div>

      {/* Action Cards */}
      <div className="space-y-3">
        {data.revenueDropDetected && (
          <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
            <div className="text-red-400 font-medium text-sm mb-1">⚠️ Revenue Drop Detected</div>
            <div className="text-gray-400 text-xs">Immediate attention required</div>
          </div>
        )}
        
        {data.focusCategory && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
            <div className="text-blue-400 font-medium text-sm mb-1">Focus Category</div>
            <div className="text-gray-300 text-xs">{data.focusCategory}</div>
          </div>
        )}
        
        {data.focusRegion && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded p-3">
            <div className="text-purple-400 font-medium text-sm mb-1">Priority Region</div>
            <div className="text-gray-300 text-xs">{data.focusRegion}</div>
          </div>
        )}
        
        {data.fixSeller && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded p-3">
            <div className="text-orange-400 font-medium text-sm mb-1">Seller Issue</div>
            <div className="text-gray-300 text-xs">{data.fixSeller}</div>
          </div>
        )}
        
        {data.checkLogisticsHub && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
            <div className="text-yellow-400 font-medium text-sm mb-1">Logistics Check</div>
            <div className="text-gray-300 text-xs">{data.checkLogisticsHub}</div>
          </div>
        )}
      </div>
    </div>
  );
}
