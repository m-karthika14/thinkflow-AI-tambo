import { Sparkles, TrendingDown, Zap, Brain, Target, RefreshCw, Shield, Database } from 'lucide-react';
import NeuralBackground from '../components/NeuralBackground';

type Props = { onBack?: () => void };

export default function AboutPage({ onBack }: Props) {
  return (
    <div className="relative min-h-screen text-white z-20 bg-black">
      <NeuralBackground activeIntent={0} />
      {/* optional back button when rendered from app routing */}
      {onBack && (
        <div className="fixed right-6 top-6 z-40">
          <button
            onClick={onBack}
            className="px-3 py-2 rounded-md bg-white/6 hover:bg-white/12 text-sm text-gray-100 transition"
          >
            ← Back
          </button>
        </div>
      )}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-full">
            <p className="text-sm text-purple-300">Powered by 🟣 Tambo</p>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            ABOUT THINKFLOW AI
          </h1>
        </div>
      </section>

      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl transform hover:scale-[1.02] transition-all duration-500"
            style={{ transform: 'perspective(1000px) rotateX(2deg) translateY(-2cm)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h2 className="text-3xl font-bold">How ThinkFlow AI Began</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                I once read a Reddit post where a manager said the issue wasn't missing data — it was how hard it was to interpret it.
                Dashboards were fixed and complex. Even experienced managers struggled.
              </p>
              <p>
                When a new sales person joined, it took weeks to explain the dashboards, and mistakes still happened.
              </p>
              <p>
                After discussing this with a friend, we realized this problem was everywhere.
                So we built <span className="text-purple-400 font-semibold">ThinkFlow AI</span> — an interface that adapts to intent, not people to dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-6 bg-gradient-to-b from-transparent via-red-950/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-4xl font-bold">THE PROBLEM</h2>
            </div>
            <p className="text-2xl text-gray-200 font-semibold mb-4">
              Business dashboards don't match how people think
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Business users are overwhelmed by large datasets, rigid dashboards, endless tabs, and confusing charts.
              Interpreting what's happening — and deciding what to do next — takes too much time and effort.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Glass-like small card (chaos) - icon + description */}
            <div className="bg-white/4 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg min-h-[12rem] flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500/12 to-red-700/8 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-10 h-10 text-red-300" />
                </div>
                <p className="text-red-300 font-semibold">Noisy Dashboard Chaos</p>
              </div>
            </div>

            {/* Glass-like small card (calm) */}
            <div className="bg-white/4 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg min-h-[12rem] flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400/12 to-blue-400/12 rounded-full flex items-center justify-center">
                  <Zap className="w-10 h-10 text-green-300" />
                </div>
                <p className="text-green-300 font-semibold">Calm, Minimal UI State</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">THE GAP</h2>
          <p className="text-3xl text-purple-300 font-semibold mb-6">
            Data is flexible. Interfaces are not.
          </p>
          <p className="text-xl text-gray-400 leading-relaxed">
            People don't think in charts or dashboards.
            They think in questions, intent, and decisions — but today's tools don't adapt.
          </p>
        </div>
      </section>

      <section className="relative py-20 px-6 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <h2 className="text-5xl font-bold">THE SOLUTION</h2>
            </div>
            <p className="text-3xl font-bold text-purple-300 mb-12">
              ThinkFlow AI changes the interface, not the user
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12 mb-12">
            <div className="text-center mb-12">
              <div className="inline-block px-6 py-3 bg-white/10 rounded-full mb-8">
                <p className="text-lg font-semibold">One Dataset</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'EXPLORE', icon: Target, color: 'from-blue-500 to-cyan-500' },
                { label: 'UNDERSTAND', icon: Brain, color: 'from-purple-500 to-pink-500' },
                { label: 'DECIDE', icon: Zap, color: 'from-orange-500 to-red-500' },
                { label: 'ACT', icon: RefreshCw, color: 'from-green-500 to-emerald-500' },
              ].map((mode) => (
                <div
                  key={mode.label}
                  className="group relative backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${mode.color} rounded-full flex items-center justify-center group-hover:animate-pulse`}>
                    <mode.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-bold text-sm">{mode.label}</p>
                </div>
              ))}
            </div>

            <div className="text-center space-y-6">
              <p className="text-3xl font-bold leading-relaxed">
                Dynamic database of a company. Different thinking modes.<br />
                <span className="text-purple-300">The UI adapts instantly.</span>
              </p>
              <div className="max-w-2xl mx-auto pt-6 border-t border-white/10">
                <p className="text-gray-300 text-lg">
                  Users may type thoughts or filters — but the system never replies in text.
                  <span className="block mt-2 text-purple-300 font-semibold">The interface itself is the response.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-6 bg-gradient-to-b from-transparent via-yellow-950/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <h2 className="text-5xl font-bold">WHY TAMBO</h2>
            </div>
            <p className="text-2xl text-yellow-300 font-semibold mb-8">
              Why ThinkFlow AI is powered by Tambo
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-3xl p-12 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
              <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/40 rounded-2xl px-8 py-4">
                <p className="text-xl font-semibold">User Intent</p>
              </div>
              <div className="text-4xl text-yellow-400">→</div>
              <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/40 rounded-2xl px-8 py-4">
                <p className="text-xl font-semibold">🟣 Tambo</p>
              </div>
              <div className="text-4xl text-yellow-400">→</div>
              <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/40 rounded-2xl px-8 py-4">
                <p className="text-xl font-semibold">UI Components</p>
              </div>
            </div>

            <div className="space-y-6 text-center">
              <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
                Tambo is not used for chat or text generation.
                It is the reasoning layer that decides <span className="text-yellow-300 font-semibold">which UI should exist</span> based on user intent and context.
              </p>

              <div className="border border-yellow-500/50 rounded-2xl p-8 mt-8">
                <p className="text-3xl font-bold text-yellow-300">
                  Without Tambo, ThinkFlow AI cannot exist.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">KEY FEATURES</h2>
          </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Brain, text: 'Intent-driven Generative UI', color: 'purple' },
              { icon: RefreshCw, text: 'Dynamic dataset of a company', color: 'blue' },
              { icon: Target, text: 'Insights become context', color: 'pink' },
              { icon: Shield, text: 'No chatbot, no static dashboards', color: 'green' },
              { icon: Database, text: 'Built for live business databases', color: 'orange' },
              { icon: Sparkles, text: 'Multiple thinking modes', color: 'yellow' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-float"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`w-14 h-14 mb-4 bg-${feature.color}-500/20 rounded-full flex items-center justify-center group-hover:animate-pulse`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                </div>
                <p className="text-lg font-semibold text-gray-200">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-8">
            <h2 className="text-5xl font-bold">WHO IS THIS FOR</h2>
          </div>
          <p className="text-2xl text-gray-300 leading-relaxed">
            Managers, analysts, and sales teams —<br />
            anyone who needs to understand business data<br />
            without learning complex tools.
          </p>
        </div>
      </section>

      <section className="relative py-20 px-6 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-5xl font-bold">BUSINESS MODEL</h2>
            </div>
            <p className="text-2xl font-semibold text-green-300 mb-6">
              Built to scale as a real product
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-xl border border-green-500/30 rounded-3xl p-10">
            <p className="text-xl text-gray-300 leading-relaxed text-center">
              ThinkFlow AI follows a subscription-based SaaS model for organizations,
              scaling with users, connected data sources, and advanced intent-driven analysis.
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-32 px-6 bg-gradient-to-b from-transparent via-black/50 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <div className="space-y-8">
            <div className="inline-block animate-pulse">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-8">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              ThinkFlow AI is not a dashboard.<br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                It's a thinking interface — powered by Tambo.
              </span>
            </h2>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
