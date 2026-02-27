// Inject environment variables into globalThis for library components
// This makes VITE_* env vars available to the @ia-design-system/react library

declare global {
  interface Window {
    VITE_OPENROUTER_API_KEY?: string;
    VITE_GROQ_API_KEY?: string;
    VITE_GEMINI_API_KEY?: string;
    VITE_ANTHROPIC_API_KEY?: string;
    VITE_QWEN_API_KEY?: string;
  }
}

// Inject env vars at module load time
if (typeof window !== 'undefined') {
  window.VITE_OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  window.VITE_GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  window.VITE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  window.VITE_ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
  window.VITE_QWEN_API_KEY = import.meta.env.VITE_QWEN_API_KEY;
  
  console.log('[Env Injector] Environment variables loaded:', {
    hasOpenRouter: !!import.meta.env.VITE_OPENROUTER_API_KEY,
    hasGroq: !!import.meta.env.VITE_GROQ_API_KEY,
    hasGemini: !!import.meta.env.VITE_GEMINI_API_KEY,
  });
}

export {};
