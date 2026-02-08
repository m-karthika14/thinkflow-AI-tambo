import { useState } from 'react';
import { Database, Brain, Target, Zap, Focus, ChevronRight } from 'lucide-react';
import NeuralBackground from '../components/NeuralBackground';

type Props = { onBack?: () => void };

export default function HowToUse({ onBack }: Props) {
  const [focusedCard, setFocusedCard] = useState<string | null>(null);
  // accept optional onBack prop (sometimes passed by parent); used solely to avoid unused prop warnings
  // Removed: void onBack;

  const intents = [
    { name: 'EXPLORE', desc: "See what's happening", color: 'from-blue-500 to-cyan-500' },
    { name: 'UNDERSTAND', desc: 'Interpret the situation', color: 'from-emerald-500 to-teal-500' },
    { name: 'DECIDE', desc: 'Find priorities', color: 'from-amber-500 to-orange-500' },
    { name: 'ACT', desc: 'Take next steps', color: 'from-rose-500 to-pink-500' }
  ];

  const steps = [
    {
      number: 1,
      title: 'Start with your data',
      description: 'ThinkFlow AI works on your business data — sales, revenue, performance, operations.',
      icon: Database,
      color: 'from-blue-500 to-blue-600',
      detail: 'This demo uses a Flipkart-style dataset. Live data can be connected.',
      visual: 'dataset'
    },
    {
      number: 2,
      title: 'Type your thought',
      description: "Share what's on your mind without waiting for answers.",
      subtitle: '(Optional)',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
      examples: ['Why did revenue drop?', 'Which region is struggling?', 'What should we focus on?'],
      detail: 'This input never shows text answers. It only adds context.',
      visual: 'input'
    },
    {
      number: 3,
      title: 'Choose how you want to think',
      description: 'Select an intent that matches your current goal.',
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      visual: 'intents'
    },
    {
      number: 4,
      title: 'The interface responds',
      description: 'ThinkFlow AI never replies in text. The interface itself is the answer.',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      cards: ['Trends', 'Breakdowns', 'Risks', 'Actions'],
      visual: 'cards'
    },
    {
      number: 5,
      title: 'Focus on an insight',
      description: 'Click any card to zoom in and explore deeper.',
      subtitle: '(Optional)',
      icon: Focus,
      color: 'from-pink-500 to-rose-600',
      visual: 'focus'
    }
  ];

  const handleIntentClick = (intent: string) => {
    // simple visual feedback placeholder - no persistent state needed here
    // In the full app this would trigger an intent animation or state
    void intent;
  };

  return (
    <div className="relative min-h-screen text-white bg-black">
      
      {/* Neural Network Background */}
      <NeuralBackground activeIntent={1} />

      {/* Back button */}
      {onBack && (
        <div className="fixed right-6 top-6 z-40">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-100 transition"
          >
            ← Back
          </button>
        </div>
      )}

      <div className="relative z-20 max-w-5xl mx-auto px-6 py-12">

        

  <div className="flex flex-col items-center justify-center mb-6 text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">How to <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Think</span> with ThinkFlow</h1>
            <p className="text-sm text-gray-300 mt-2">In just five simple steps, understand your business better.</p>
          </div>

          
        </div>

  <div className="space-y-20" style={{ transform: 'translateY(-3cm)' }}>
          {steps.map((step, idx) => {
            const StepIcon = step.icon as any;
            return (
              <div key={step.number} className="animate-fadeSlideUp" style={{ animationDelay: `${0.1 + idx * 0.15}s` }}>
                <div className="flex gap-8 items-stretch">
                  <div className="flex flex-col items-center" style={step.number === 1 ? { transform: 'translateY(3cm)' } : undefined}>
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <StepIcon className="w-10 h-10 text-white" />
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="w-1 flex-1 bg-gradient-to-b from-slate-700 via-slate-700 to-transparent mt-4 min-h-96"></div>
                    )}
                  </div>

                  <div className="flex-1 pb-8">
                    <div
                      className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm"
                      style={step.number === 1 ? { transform: 'translateY(3cm)' } : undefined}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-sm text-gray-400 font-medium mb-2">STEP {step.number}</div>
                          <h3 className="text-3xl font-bold mb-1">{step.title}</h3>
                          {step.subtitle && <div className="text-sm text-gray-500 italic">{step.subtitle}</div>}
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-600 flex-shrink-0 mt-2" />
                      </div>

                      <p className="text-lg text-gray-300 mb-6 leading-relaxed">{step.description}</p>

                      {step.examples && (
                        <div className="space-y-3 mb-6">
                          {step.examples.map((example, i) => (
                            <div key={i} className="flex items-start gap-3 text-gray-400">
                              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 mt-2 flex-shrink-0"></div>
                              <div className="italic">{example}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {step.visual === 'dataset' && (
                        <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></div>
                          <div>
                            <div className="text-sm font-medium text-gray-300">Dataset ready</div>
                            <div className="text-xs text-gray-500">{step.detail}</div>
                          </div>
                        </div>
                      )}

                      {step.visual === 'input' && (
                        <div className="mt-6">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Type your thought here..."
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all text-base"
                            />
                            <div className="absolute right-4 top-3.5 w-0.5 h-5 bg-blue-400 animate-blink"></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-3 italic">{step.detail}</p>
                        </div>
                      )}

                      {step.visual === 'intents' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                          {intents.map((intent) => (
                            <button
                              key={intent.name}
                              onClick={() => handleIntentClick(intent.name)}
                              className={`bg-gradient-to-r ${intent.color} rounded-xl px-6 py-4 text-left font-bold text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform group`}
                            >
                              <div className="group-hover:text-white/90 transition-colors">{intent.name}</div>
                              <div className="text-sm text-white/70 group-hover:text-white/80 transition-colors font-normal">{intent.desc}</div>
                            </button>
                          ))}
                        </div>
                      )}

                      {step.visual === 'cards' && (
                        <div className="grid grid-cols-2 gap-3 mt-6">
                          {step.cards?.map((card) => (
                            <div
                              key={card}
                              className="bg-slate-900/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 hover:bg-slate-900/70 transition-all duration-300 hover:shadow-lg"
                            >
                              <div className="text-sm font-semibold text-gray-300">{card}</div>
                              <div className="mt-3 h-20 bg-gradient-to-br from-slate-700/20 to-slate-800/20 rounded-lg"></div>
                            </div>
                          ))}
                        </div>
                      )}

                      {step.visual === 'focus' && (
                        <div className="mt-6">
                          <div
                            onClick={() => setFocusedCard(focusedCard ? null : 'revenue')}
                            className={`bg-gradient-to-br from-slate-800 to-slate-900 border-2 rounded-xl p-6 cursor-pointer transition-all duration-500 ${
                              focusedCard ? 'border-blue-500 shadow-2xl shadow-blue-500/20 scale-105' : 'border-slate-700 hover:border-slate-600'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-lg font-semibold">Revenue Trend Card</div>
                              <span className="text-xs text-gray-400">Click to focus</span>
                            </div>
                            <div className="h-24 bg-slate-700/20 rounded-lg mb-4"></div>
                            {focusedCard && (
                              <div className="flex gap-2 animate-fadeIn">
                                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                                  Think with this
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFocusedCard(null);
                                  }}
                                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
                                >
                                  Close
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        

      </div>
    </div>
  );
}
