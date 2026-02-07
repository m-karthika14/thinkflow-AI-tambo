import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TamboProvider } from '@tambo-ai/react';
import App from './App.tsx';
import './index.css';
import { tamboComponents, tamboTools } from './tambo/manifest';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {import.meta.env.VITE_TAMBO_API_KEY ? (
      <TamboProvider
        apiKey={import.meta.env.VITE_TAMBO_API_KEY}
        components={tamboComponents}
        tools={tamboTools}
      >
        <App />
      </TamboProvider>
    ) : (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-light text-gray-100 mb-4">Missing Tambo API Key</h1>
          <p className="text-gray-300 mb-6">
            Please add <code className="bg-black/30 px-2 py-1 rounded">VITE_TAMBO_API_KEY</code> to your{' '}
            <code className="bg-black/30 px-2 py-1 rounded">.env.local</code> file and restart the dev server.
          </p>
          <div className="text-left bg-black/30 rounded-lg p-4 text-sm text-gray-400 font-mono">
            VITE_TAMBO_API_KEY=your_api_key_here
          </div>
        </div>
      </div>
    )}
  </StrictMode>
);
