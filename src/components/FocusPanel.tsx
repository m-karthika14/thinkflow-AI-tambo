interface FocusPanelProps {
  title: string;
  data: any;
  onClose: () => void;
  onBackToHome?: () => void;
  onThinkWithThis: (ctx: any) => void;
}

export default function FocusPanel({ title, data, onClose, onBackToHome, onThinkWithThis }: FocusPanelProps) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-70 w-full h-full flex items-center justify-center">
        <div className="absolute left-4 top-4">
          <button
            onClick={() => {
              if (onBackToHome) onBackToHome(); else onClose();
            }}
            className="px-3 py-2 bg-white/5 rounded text-sm"
          >
            ← Back
          </button>
        </div>

        <div className="w-11/12 h-5/6 bg-gray-900/80 p-6 rounded-md overflow-auto">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-semibold">{title}</div>
            </div>
            <div className="flex items-start space-x-2">
              <button onClick={onClose} className="px-3 py-2 bg-white/5 rounded text-sm">Close</button>
            </div>
          </div>

          <div className="mt-6">
            <pre className="text-xs text-gray-200 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                const ctx = { type: title.toLowerCase(), id: data?.id ?? data?.sellerId ?? title, source: title };
                onThinkWithThis(ctx);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Think with this
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
