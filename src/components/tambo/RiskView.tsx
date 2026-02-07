interface Props {
  data?: any;
}

export default function RiskView({ data }: Props) {
  return (
    <div className="p-4 bg-gray-900/60 rounded-md border border-red-400/10">
      <h3 className="text-sm text-gray-200 mb-2">Risk</h3>
      <pre className="text-xs text-gray-300 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
