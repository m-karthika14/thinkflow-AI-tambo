import { useEffect, useRef, useState } from 'react';
import NeuralBackground from './components/NeuralBackground';
import CognitionRail from './components/CognitionRail';
import ContextInput from './components/ContextInput';
import FocusPanel from './components/FocusPanel';
import { GenerationStage, useTamboThread } from '@tambo-ai/react';
import TamboErrorBoundary from './components/TamboErrorBoundary';
import { toTamboDiag } from './tambo/diagnostics';
import * as analytics from './tools/analytics';
import TrendView from './components/tambo/TrendView';
import BreakdownView from './components/tambo/BreakdownView';
import RankingView from './components/tambo/RankingView';
import ActionsView from './components/tambo/ActionsView';
import LoadingOverlay from './components/LoadingOverlay';
// GenerativeCanvas intentionally not used while ThinkFlow is integrating

function App() {
  const [activeIntent, setActiveIntent] = useState(0);
  const [thinkingText, setThinkingText] = useState('');
  const [focusedInsight, setFocusedInsight] = useState<any | null>(null);

  type Screen = 'HOME' | 'THINKING' | 'RESULTS' | 'FOCUS';
  const [screen, setScreen] = useState<Screen>('HOME');
  const thinkingTimerRef = useRef<number | null>(null);

  // Focus Mode is visual only. It must not trigger tools or Tambo.
  const [isFocusOpen, setIsFocusOpen] = useState(false);

  // Keeping these for compatibility: the app already has a FocusPanel used by breakdown click.
  const [focusedPanel, setFocusedPanel] = useState<any | null>(null);

  const tamboThread = useTamboThread();
  const { sendThreadMessage, generationStage, generationStatusMessage, cancel, thread } = tamboThread;
  
  // Debug: log all available properties
  useEffect(() => {
    console.log('[tambo] Available thread properties:', Object.keys(tamboThread));
    console.log('[tambo] Thread object:', thread);
    console.log('[tambo] Thread messages:', thread?.messages);
  }, [tamboThread, thread]);

  const [lastTamboMessage, setLastTamboMessage] = useState<any | null>(null);

  const [tamboError, setTamboError] = useState<string | null>(null);
  const [tamboDiag, setTamboDiag] = useState<any | null>(null);



  const getMoodGradient = () => {
    switch (activeIntent) {
      case 0:
        return 'bg-gradient-to-br from-[#0B0F14] via-[#0F1419] to-[#111827]';
      case 1:
        return 'bg-gradient-to-br from-[#0B0F14] via-[#111320] to-[#111827]';
      case 2:
        return 'bg-gradient-to-br from-[#0D0B14] via-[#130F1F] to-[#111827]';
      case 3:
        return 'bg-gradient-to-br from-[#0B0F14] via-[#0E1218] to-[#0F1419]';
      default:
        return 'bg-gradient-to-br from-[#0B0F14] via-[#0F1419] to-[#111827]';
    }
  };

  useEffect(() => {
    if (!thread?.messages) return;
    
    console.log('[tambo] Generation stage changed:', generationStage);
    console.log('[tambo] Thread messages:', thread.messages);
    
    // When Tambo completes component hydration, we show RESULTS.
    if (generationStage === GenerationStage.COMPLETE) {
      console.log('[tambo] Generation COMPLETE - switching to RESULTS screen');
      
      // Find the most recent message with a component
      const messagesWithComponents = thread.messages.filter(
        (msg: any) => msg?.component?.componentName && msg?.component?.props
      );
      
      console.log('[tambo] Messages with components:', messagesWithComponents);
      
      if (messagesWithComponents.length > 0) {
        const latestComponentMessage = messagesWithComponents[messagesWithComponents.length - 1];
        console.log('[tambo] ✅ Found component message:', latestComponentMessage);
        
        if (latestComponentMessage?.component?.componentName) {
          // Map component names to actual React components
          const componentMap: Record<string, any> = {
            'TrendView': TrendView,
            'BreakdownView': BreakdownView,
            'RankingView': RankingView,
            'ActionsView': ActionsView,
          };
          
          const ComponentToRender = componentMap[latestComponentMessage.component.componentName];
          
          if (ComponentToRender) {
            console.log('[tambo] ✅ Hydrating component:', latestComponentMessage.component.componentName);
            const renderedComponent = <ComponentToRender {...latestComponentMessage.component.props} />;
            
            setLastTamboMessage({
              ...latestComponentMessage,
              renderedComponent,
              _tamboHydrated: true,
            });
            setTamboError(null);
          }
        }
      }
      
      setScreen('RESULTS');
    }
  }, [generationStage, thread]);

  const startThinkingThenResults = (idx: number) => {
    setTamboError(null);
    setTamboDiag(null);
    setActiveIntent(idx);
    setFocusedPanel(null);
    setIsFocusOpen(false);

    // Immediately fade HOME out, keep background.
    setScreen('THINKING');

    if (thinkingTimerRef.current) {
      window.clearTimeout(thinkingTimerRef.current);
    }

    // Keep the cinematic minimum delay, but RESULTS will only appear once Tambo is done.
    const delay = 800 + Math.floor(Math.random() * 400);
    thinkingTimerRef.current = window.setTimeout(() => {
      // only used to keep rhythm; actual transition happens on GenerationStage.COMPLETE
    }, delay);

    const intentLabel = ['EXPLORE', 'UNDERSTAND', 'DECIDE', 'ACT'][idx] ?? 'EXPLORE';

    // Quick guard: if the key isn't actually present in the browser bundle, fail fast with a clear message.
    if (!import.meta.env.VITE_TAMBO_API_KEY) {
      const diag = {
        reason: 'Missing VITE_TAMBO_API_KEY in import.meta.env',
        apiKeyPresent: false,
      };
      setTamboDiag(diag);
      setTamboError('Missing VITE_TAMBO_API_KEY. Restart Vite after adding .env.');
      setScreen('RESULTS');
      return;
    }

    // Map intent to specific component and tool
    const intentMap: Record<string, { component: string; tool: string }> = {
      'EXPLORE': { component: 'TrendView', tool: 'getRevenueTrend' },
      'UNDERSTAND': { component: 'BreakdownView', tool: 'getCategoryBreakdown' },
      'DECIDE': { component: 'RankingView', tool: 'getSellerRanking' },
      'ACT': { component: 'ActionsView', tool: 'getActionItems' },
    };

    const { component: componentName, tool: toolName } = intentMap[intentLabel] || intentMap['EXPLORE'];

    // ✅ Super explicit: Tell Tambo EXACTLY which component to render
    const message = `Call the ${toolName}() tool and render the ${componentName} component with the returned data.${thinkingText ? ` User context: ${thinkingText}` : ''}`;

    // Debug: log what we're sending
    console.log('[tambo] ======================');
    console.log('[tambo] Sending message to Tambo');
    console.log('[tambo] Intent:', intentLabel);
    console.log('[tambo] Message:', message);
    console.log('[tambo] ======================');

    void sendThreadMessage(message, {
      streamResponse: true,
    })
      .then((msg) => {
        console.log('[tambo] Message received:', msg);
        console.log('[tambo] Full message object:', JSON.stringify(msg, null, 2));
        console.log('[tambo] Has rendered component:', !!msg?.renderedComponent);
        console.log('[tambo] Component:', msg?.component);
        console.log('[tambo] Component name:', msg?.component?.componentName);
        console.log('[tambo] Component props:', msg?.component?.props);
        
        // CRITICAL DEBUG: Let's see ALL properties of msg
        console.log('[tambo] ALL msg keys:', Object.keys(msg || {}));
        console.log('[tambo] msg.content:', msg?.content);
        
        // Tambo stores the component info in msg.component
        // We need to manually hydrate it using our registered components
        if (msg?.component?.componentName && msg?.component?.props) {
          console.log('[tambo] ✅ Tambo returned component data:', msg.component.componentName);
          
          // Map component names to actual React components
          const componentMap: Record<string, any> = {
            'TrendView': TrendView,
            'BreakdownView': BreakdownView,
            'RankingView': RankingView,
            'ActionsView': ActionsView,
          };
          
          const ComponentToRender = componentMap[msg.component.componentName];
          
          if (ComponentToRender) {
            console.log('[tambo] ✅ Hydrating component with props:', msg.component.props);
            const renderedComponent = <ComponentToRender {...msg.component.props} />;
            
            setLastTamboMessage({
              ...msg,
              renderedComponent,
              _tamboHydrated: true,
            });
            setTamboError(null);
          } else {
            console.error('[tambo] ❌ Unknown component name:', msg.component.componentName);
            setTamboError(`Unknown component: ${msg.component.componentName}`);
            setScreen('RESULTS');
          }
        } else if (msg?.renderedComponent) {
          console.log('[tambo] ✅ Using pre-rendered component from msg.renderedComponent');
          setLastTamboMessage(msg);
          setTamboError(null);
        } else {
          console.error('[tambo] ❌ No component data in response');
          console.log('[tambo] Response structure:', {
            hasComponent: !!msg?.component,
            componentName: msg?.component?.componentName,
            hasProps: !!msg?.component?.props,
            hasRenderedComponent: !!msg?.renderedComponent,
          });
          
          // Let's check if the component data might be somewhere else in the message
          if (msg?.content && Array.isArray(msg.content)) {
            console.log('[tambo] Checking msg.content for component data...');
            msg.content.forEach((item: any, idx: number) => {
              console.log(`[tambo] content[${idx}]:`, item);
            });
          }
          
          setTamboError('Tambo did not return component data');
          setScreen('RESULTS');
        }
      })
      .catch((err) => {
        const diag = toTamboDiag(err);
        setTamboDiag(diag);
        
        console.error('[tambo] Generation failed:', diag);
        
        // Show error calmly
        setTamboError(diag.message || 'Generation failed');
        setScreen('RESULTS');
      });
  };

  const backToHome = () => {
    if (thinkingTimerRef.current) {
      window.clearTimeout(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
    }
    setFocusedPanel(null);
    setIsFocusOpen(false);
    setScreen('HOME');

  setTamboError(null);

    // Cancel any in-flight generation, if present.
    void cancel();
  };

  return (
    <div className={`h-screen ${getMoodGradient()} transition-all duration-1000 relative overflow-hidden`}>
      {/* Background stays the same across every screen */}
      <NeuralBackground activeIntent={activeIntent} />

      <div className="relative z-10 h-screen px-6 py-6 overflow-hidden">

        {/* HOME */}
        <div
          className={
            `w-full transition-all duration-500 ease-out ` +
            `${screen === 'HOME' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`
          }
        >
          <div className="absolute inset-x-0 top-[36vh] flex flex-col items-center space-y-6">
            <div className="text-center space-y-2 mb-2 -translate-y-[3cm]">
              <h1 className="text-5xl font-bold text-gray-100 tracking-widest">thinkflow AI</h1>
              <div className="text-sm text-gray-300/90">We read the data so you don’t have to.</div>
            </div>

            {/* Search bar above */}
            <div className="w-full max-w-3xl px-6 mt-[2cm] mb-[4cm]">
              {/* Deliberate silence: typing does nothing; no loading, no results */}
              <ContextInput onContextChange={setThinkingText} />
              {focusedInsight && (
                <div className="mt-2 text-center text-xs text-gray-400">
                  Thinking with 1 selected insight
                </div>
              )}
            </div>

            {/* Intent buttons below */}
            <div className="mt-6 w-full">
              <CognitionRail onIntentChange={startThinkingThenResults} activeIntent={activeIntent} />
            </div>
          </div>
        </div>

        {/* THINKING / LOADING (neural state) */}
        {screen === 'THINKING' && (
          <LoadingOverlay statusMessage={generationStatusMessage} />
        )}

        {/* RESULTS (Tambo-rendered component) */}
        <div
          className={
            `w-full max-w-5xl mx-auto mt-8 transition-all duration-500 ease-out ` +
            `${screen === 'RESULTS' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`
          }
        >
          <div className="sr-only">Results</div>

          {/* Back button on RESULTS (requested) */}
          <div className="fixed left-0 top-0 z-[999]">
            <button
              onClick={backToHome}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-100 transition"
            >
              ← Back
            </button>
          </div>

          <div className="relative w-full pt-10">
            {/* Render results directly without the rounded 'bg card' wrapper so the
                generated component isn't clipped. This container is intentionally
                lightweight (no fixed height, no overflow:hidden) so Tambo-rendered
                UIs can expand naturally. */}
            <div className="mx-auto w-full max-w-5xl p-4 rounded-2xl overflow-auto max-h-[80vh]">
                {tamboError ? (
                  <div className="h-full w-full flex flex-col items-center justify-center text-sm text-gray-300 px-6 text-center gap-3">
                    <div className="text-base text-red-200">Tambo failed to generate UI.</div>
                    <div className="text-xs text-gray-400 break-words max-w-[60ch]">{tamboError}</div>
                    {tamboDiag && (
                      <details className="mt-2 w-full max-w-[80ch] text-left rounded-xl border border-white/10 bg-black/20 p-3">
                        <summary className="cursor-pointer text-xs text-gray-200">Diagnostics</summary>
                        <pre className="mt-2 text-[11px] leading-snug text-gray-300 whitespace-pre-wrap break-words">
                          {JSON.stringify(tamboDiag, null, 2)}
                        </pre>
                      </details>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={backToHome}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-100 transition"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                ) : lastTamboMessage?.renderedComponent ? (
                  <TamboErrorBoundary
                    onError={(err) => {
                      const message = err instanceof Error ? err.message : String(err);
                      setTamboError(message || 'Unknown render error');
                    }}
                  >
                    <div
                      className="w-full p-4 cursor-pointer"
                      onClick={() => {
                        // Card click enters Focus Mode (visual only).
                        setIsFocusOpen(true);
                        setScreen('FOCUS');
                      }}
                    >
                      {lastTamboMessage.renderedComponent}
                    </div>
                  </TamboErrorBoundary>
                ) : lastTamboMessage ? (
                  <div className="w-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="text-sm text-gray-400 mb-2">Tambo responded</div>
                    <div className="text-xs text-gray-500 max-w-md">
                      {lastTamboMessage.content?.[0]?.text || 'Response received but no UI was generated'}
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-center text-sm text-gray-300">
                    Thinking…
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* FOCUS MODE (visual only; does not call tools or Tambo) */}
        {screen === 'FOCUS' && isFocusOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />

            <div className="absolute left-4 top-4 z-50">
              <button
                onClick={() => {
                  setIsFocusOpen(false);
                  setScreen('RESULTS');
                }}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-100 transition"
              >
                ← Back
              </button>
            </div>

            <div className="relative z-50 w-full h-full flex items-center justify-center px-4">
              <div className="w-full max-w-3xl rounded-2xl border border-white/12 bg-gray-950/55 backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                <div className="p-6">
                  <div className="text-sm uppercase tracking-[0.28em] text-gray-200/90">Focus</div>
                  <div className="mt-4 h-72 rounded-xl bg-black/10 border border-white/5 overflow-hidden">
                    <div className="h-full w-full p-4">{lastTamboMessage?.renderedComponent ?? null}</div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        // Close: back to RESULTS
                        setIsFocusOpen(false);
                        setScreen('RESULTS');
                      }}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-100 transition"
                    >
                      Close
                    </button>

                    <button
                      onClick={() => {
                        // Think with this:
                        // MUST NOT call tools
                        // MUST NOT call Tambo
                        // Only stores context + returns HOME
                        setFocusedInsight({
                          id: 'tambo-render',
                          type: 'tambo_component',
                          summary: 'User selected the focused insight',
                        });
                        setIsFocusOpen(false);
                        setScreen('HOME');
                      }}
                      className="px-4 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-sm text-white shadow-[0_0_25px_rgba(59,130,246,0.25)] transition"
                    >
                      Think with this
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legacy FocusPanel (kept) */}
        {focusedPanel && (
          <FocusPanel
            title={focusedPanel.title}
            data={focusedPanel.data}
            onClose={() => setFocusedPanel(null)}
            onBackToHome={() => {
              setFocusedPanel(null);
              setFocusedInsight(null);
              setScreen('HOME');
            }}
            onThinkWithThis={(ctx) => {
              setFocusedInsight(ctx);
              setFocusedPanel(null);
              setScreen('HOME');
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
