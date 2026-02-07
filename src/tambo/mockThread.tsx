import type { ReactNode } from 'react';
import React from 'react';

type GenerationStageLike = 'IDLE' | 'GENERATING' | 'COMPLETE' | 'ERROR';

type ThreadMessage = {
  renderedComponent?: ReactNode;
  raw?: unknown;
};

export function useMockTamboThread() {
  const [generationStage, setGenerationStage] = React.useState<GenerationStageLike>('IDLE');
  const [generationStatusMessage, setGenerationStatusMessage] = React.useState<string>('');

  async function sendThreadMessage(content: string): Promise<ThreadMessage> {
    setGenerationStage('GENERATING');
    setGenerationStatusMessage('Local demo mode (no API key).');

    // Simulate network/stream delay.
    await new Promise((r) => setTimeout(r, 600));

    let payload: any = null;
    try {
      payload = JSON.parse(content);
    } catch {
      payload = { intent: 'EXPLORE' };
    }

    const intent = String(payload?.intent ?? 'EXPLORE');

    const renderedComponent = (
      <div className="h-full w-full">
        <div className="text-xs uppercase tracking-[0.28em] text-gray-200/80">Demo result</div>
        <div className="mt-3 text-lg text-gray-100">{intent}</div>
        <div className="mt-2 text-sm text-gray-300 max-w-[70ch]">
          No <code className="text-gray-200">VITE_TAMBO_API_KEY</code> found, so Thinkflow is running in local mock mode.
          Add an API key to enable real streaming generations.
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-gray-100">TrendView (stub)</div>
            <div className="mt-2 text-xs text-gray-400">Wire to Tambo tools once API key is set.</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-gray-100">BreakdownView (stub)</div>
            <div className="mt-2 text-xs text-gray-400">This is a safe placeholder that won’t error.</div>
          </div>
        </div>
      </div>
    );

    setGenerationStage('COMPLETE');
    setGenerationStatusMessage('');
    return { renderedComponent, raw: payload };
  }

  async function cancel() {
    // No-op for mock.
    setGenerationStage('IDLE');
    setGenerationStatusMessage('');
  }

  return {
    sendThreadMessage,
    generationStage,
    generationStatusMessage,
    cancel,
  };
}
