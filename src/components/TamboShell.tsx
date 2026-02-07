import { useEffect, useState } from 'react';
import { registerWithTambo } from '../tambo/register';

// Simple orchestrator: lets the user select an intent and type free-form
// thinking. On intent change we send an event to the external ThinkFlow runtime
// containing the selected intent, raw thinking text and current UI state.

const INTENTS = ['EXPLORE', 'UNDERSTAND', 'DECIDE', 'ACT'] as const;

export default function TamboShell() {
  const [intent, setIntent] = useState<typeof INTENTS[number]>('EXPLORE');
  const [thinking, setThinking] = useState('');
  const [uiState] = useState<any>({});
  const [renderInstructions, setRenderInstructions] = useState<any>(null);

  useEffect(() => {
  // Register available tools/components with ThinkFlow on mount.
  registerWithTambo();

  // Listen for render instructions from ThinkFlow runtime. The runtime
  // should post a message with type: 'thinkflow:render' and a payload describing
  // which components to render and the data to pass.
    function onMessage(e: MessageEvent) {
      if (!e?.data) return;
      const msg = e.data;
      if (msg?.type === 'thinkflow:render') {
        setRenderInstructions(msg.payload ?? null);
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    // On intent change, send the intent, raw thinking and current uiState to ThinkFlow.
    // We do NOT parse the text or make decisions here.
    const payload = { intent, thinking, uiState };
    const anyWindow = window as any;
    if (anyWindow.ThinkFlow && typeof anyWindow.ThinkFlow.requestRender === 'function') {
      anyWindow.ThinkFlow.requestRender(payload);
    } else {
      // Post window message so an external runtime can pick it up
      window.postMessage({ type: 'thinkflow:request', payload }, '*');
    }
  }, [intent]);

  function handleSendClick() {
    const payload = { intent, thinking, uiState };
    const anyWindow = window as any;
    if (anyWindow.ThinkFlow && typeof anyWindow.ThinkFlow.requestRender === 'function') {
      anyWindow.ThinkFlow.requestRender(payload);
    } else {
      window.postMessage({ type: 'thinkflow:request', payload }, '*');
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        {INTENTS.map(i => (
          <button
            key={i}
            onClick={() => setIntent(i)}
            className={`px-3 py-1 rounded-md text-sm ${intent === i ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
          >
            {i}
          </button>
        ))}
      </div>

      <textarea
        value={thinking}
        onChange={e => setThinking(e.target.value)}
        placeholder="Type your thinking / observations here (free-form)..."
        className="w-full p-3 rounded-md bg-gray-900 text-gray-200 mb-3"
        rows={3}
      />

      <div className="flex gap-3 mb-6">
        <button onClick={handleSendClick} className="px-4 py-2 bg-violet-600 rounded-md text-white text-sm">
          Send to ThinkFlow
        </button>
        <div className="text-xs text-gray-400">On intent change the system sends the intent + thinking + uiState to ThinkFlow automatically.</div>
      </div>

      <div id="thinkflow-render-area" className="space-y-4">
        {/* The external ThinkFlow runtime should post render instructions here. */}
        {renderInstructions ? (
          <pre className="text-xs text-gray-300 whitespace-pre-wrap">{JSON.stringify(renderInstructions, null, 2)}</pre>
        ) : (
          <div className="text-sm text-gray-400">No render instructions received from ThinkFlow.</div>
        )}
      </div>
    </div>
  );
}
