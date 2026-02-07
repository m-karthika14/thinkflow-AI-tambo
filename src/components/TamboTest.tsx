import { useTamboThread } from '@tambo-ai/react';
import { useState } from 'react';

export default function TamboTest() {
  const { sendThreadMessage, generationStage, generationStatusMessage } = useTamboThread();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testSimpleMessage = async () => {
    try {
      setError(null);
      setResult(null);
      console.log('[TEST] Starting simple test...');
      
      const msg = await sendThreadMessage('Show me revenue trends', {
        streamResponse: true,
      });
      
      console.log('[TEST] Success:', msg);
      setResult(msg);
    } catch (err) {
      console.error('[TEST] Error:', err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const isGenerating = String(generationStage).includes('GENERAT');

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-light text-gray-100">Tambo API Test</h1>
        
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
          <button
            onClick={testSimpleMessage}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white disabled:opacity-50"
            disabled={isGenerating}
          >
            Test Simple Message
          </button>

          <div className="text-sm text-gray-300">
            <div>Stage: {generationStage}</div>
            <div>Status: {generationStatusMessage || 'idle'}</div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-4">
              <div className="text-red-300 font-semibold">Error:</div>
              <div className="text-red-200 text-sm mt-2">{error}</div>
            </div>
          )}

          {result && (
            <div className="bg-green-500/10 border border-green-500/30 rounded p-4">
              <div className="text-green-300 font-semibold">Success:</div>
              <pre className="text-green-200 text-xs mt-2 overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-light text-gray-100 mb-4">Environment</h2>
          <div className="text-sm text-gray-300 space-y-2 font-mono">
            <div>API Key: {import.meta.env.VITE_TAMBO_API_KEY ? '✓ Present' : '✗ Missing'}</div>
            <div>
              API Key Prefix: {import.meta.env.VITE_TAMBO_API_KEY?.substring(0, 15)}...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
