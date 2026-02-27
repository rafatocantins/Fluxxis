# Free AI Setup Guide

## 🎯 Recommended: Groq (Best Free Tier)

**Why Groq?**
- ✅ **1,000 requests/day** for Llama 3.3 70B
- ✅ **Fastest inference** (300+ tokens/sec)
- ✅ **No credit card required**
- ✅ **High quality** (Llama 3.3 70B = GPT-4 level)
- ✅ **OpenAI-compatible API**

### Get Your Free Groq API Key

1. Go to https://console.groq.com/keys
2. Sign in with GitHub/Google
3. Click "Create API Key"
4. Copy the key (starts with `gsk_...`)

### Update `.env`

```bash
GROQ_API_KEY=gsk_your_key_here
```

### Update Demo `.env`

```bash
VITE_GROQ_API_KEY=gsk_your_key_here
```

### Restart Demo Server

```bash
# Kill existing server
taskkill /F /IM node.exe

# Start new server
cd demo && npm run dev
```

---

## 🥈 Alternative: OpenRouter (Most Models)

**Why OpenRouter?**
- ✅ **Access to 20+ free models** (DeepSeek, Llama, Qwen, etc.)
- ✅ **50-1,000 requests/day** depending on model
- ✅ **No credit card required**
- ✅ **Unified API** for all models

### Get Your Free OpenRouter API Key

1. Go to https://openrouter.ai/keys
2. Sign in
3. Create API key
4. Copy the key

### Update `.env`

```bash
OPENROUTER_API_KEY=sk_or_your_key_here
```

---

## 📊 Provider Comparison

| Provider | Best Model | Free Tier | Speed | Credit Card |
|----------|-----------|-----------|-------|-------------|
| **Groq** ⭐ | Llama 3.3 70B | 1K req/day | ⚡⚡⚡ Fastest | ❌ No |
| **OpenRouter** | DeepSeek R1 (free) | 50-1K req/day | ⚡⚡ Fast | ❌ No |
| Google Gemini | Gemini 2.5 Flash | 1K req/day | ⚡⚡ Fast | ❌ No |
| Anthropic | Claude Sonnet | $5 credit | ⚡⚡ Fast | ✅ Yes |
| Qwen | Qwen-Max | Pay-per-use | ⚡⚡ Fast | ✅ Yes |

---

## 🚀 Quick Test

After setting up Groq:

1. Refresh demo at `http://localhost:5173`
2. Look for buttons labeled "With brandVoice + Groq AI ✨"
3. Should see "Loading..." then AI-generated copy
4. Check console for: `[SmartCTA] Copy generated: ...`

---

## 💡 Provider Priority

The system automatically uses providers in this order:
1. **Groq** (if `GROQ_API_KEY` set)
2. **OpenRouter** (if `OPENROUTER_API_KEY` set)
3. **Gemini** (if `GEMINI_API_KEY` set)
4. **Anthropic** (if `ANTHROPIC_API_KEY` set)
5. **Qwen** (if `QWEN_API_KEY` set)

Set multiple keys and the system will use the first available!

---

## 🎯 Recommended Models by Use Case

| Use Case | Provider | Model | Why |
|----------|----------|-------|-----|
| **Marketing Copy** | Groq | Llama 3.3 70B | Creative, persuasive |
| **Technical Docs** | OpenRouter | DeepSeek R1 | Accurate, detailed |
| **Multilingual** | OpenRouter | Qwen 2.5 72B | 100+ languages |
| **Fast Iteration** | Groq | Llama 3.1 8B | Fastest, good enough |
| **Long Context** | OpenRouter | DeepSeek 671K | 671K token window |

---

**Ready to test with Groq!** 🚀
