# Fluxxis em 5 Minutos

> ⏱️ Guia rápido para começar a usar Fluxxis — interfaces adaptativas baseadas em intenção.

---

## 📋 Pré-requisitos

| Requisito | React SDK | Shopify Plugin | Core SDK |
|-----------|:---------:|:--------------:|:--------:|
| Node.js 18+ | ✅ | — | ✅ |
| React 18+ | ✅ | — | — |
| TypeScript 5+ | Recomendado | — | Recomendado |
| Conta Shopify | — | ✅ | — |
| Loja Shopify ativa | — | ✅ | — |

**Instalação global recomendada:**

```bash
npm install @fluxxis/core @fluxxis/react
# ou
pnpm add @fluxxis/core @fluxxis/react
```

> `@fluxxis/react` re-exporta tudo de `@fluxxis/core`. Se usas React, só precisas importar de `@fluxxis/react`.

---

## ⚛️ React SDK Quickstart

### 1. Wrap da aplicação

O `FluxxisProvider` inicializa o motor de intenção e deve envolver qualquer componente Fluxxis.

```tsx
// App.tsx
import { FluxxisProvider } from '@fluxxis/react';

function App() {
  return (
    <FluxxisProvider options={{ strictMode: true }} cacheTTL={300000}>
      <PricingPage />
    </FluxxisProvider>
  );
}

export default App;
```

### 2. Definir intents

Usa o hook `useIntent` para declarar a intenção do teu componente. O motor resolve automaticamente densidade, ênfase, animação e hierarquia com base nos sinais do utilizador.

```tsx
// CustomButton.tsx
import { useIntent } from '@fluxxis/react';

function CustomButton() {
  const resolution = useIntent({
    goal: 'convert',
    priority: 'high',
    actorType: 'human',
  });

  return (
    <button
      style={{
        fontWeight: resolution.emphasis === 'strong' ? 700 : 400,
        transform: resolution.animation === 'urgent' ? 'scale(1.05)' : 'none',
        boxShadow: resolution.emphasis === 'strong'
          ? '0 4px 20px rgba(0,0,0,0.25)'
          : '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {resolution.microcopy ?? 'Começar Agora'}
    </button>
  );
}
```

### 3. Ver o morph com SmartCTA

O `SmartCTA` é um componente pronto que faz tudo: declara intenção, observa comportamento e adapta-se em tempo real (< 100ms).

```tsx
// PricingPage.tsx
import { FluxxisProvider, SmartSection, SmartCTA } from '@fluxxis/react';

function PricingPage() {
  return (
    <FluxxisProvider>
      <SmartSection goal="convert" pageContext="pricing-comparison">
        <h2>Escolhe o teu plano</h2>

        <SmartCTA
          goal="convert"
          defaultCopy="Começar Grátis"
          pageContext="pricing"
          animated
          animatedVariant="primary"
          size="lg"
          onClick={() => (window.location.href = '/signup')}
        />

        <SmartCTA
          goal="inform"
          defaultCopy="Ver Preços"
          pageContext="pricing"
          variant="secondary"
        />
      </SmartSection>
    </FluxxisProvider>
  );
}
```

**O que acontece:**
1. **Signal** — O utilizador passa o rato sobre o botão, faz scroll, hesita
2. **Interpret** — O motor analisa os sinais e resolve: `emphasis: 'strong'`, `animation: 'urgent'`
3. **Morph** — O botão adapta-se: sombra mais forte, shimmer animation, microcopy gerado
4. **Render** — O utilizador vê o CTA otimizado e clica com confiança

---

## 🛒 Shopify Plugin Quickstart

O Adaptive CTA Engine injeta CTAs inteligentes em qualquer loja Shopify. Detecta intenção do URL e comportamento do utilizador para adaptar o botão de compra.

### 1. Adicionar o script-tag

No admin do Shopify, vai a **Online Store → Themes → Edit Code**.

No ficheiro `theme.liquid`, adiciona antes do fecho de `</body>`:

```html
<!-- Fluxxis Adaptive CTA -->
<script src="https://cdn.fluxxis.dev/adaptive-cta/v0.2.0/smart-cta.umd.js"></script>
<script>
  window.FluxxisCTA = window.FluxxisCTA || {};
  window.FluxxisCTA.licenseKey = '{{ settings.fluxxis_license_key }}';
  window.FluxxisCTA.experimentId = 'my-store-prod';
</script>
```

### 2. Configurar no tema

Cria um snippet Liquid em **Snippets → Add a new snippet** chamado `fluxxis-cta.liquid`:

```liquid
{% comment %} Fluxxis Adaptive CTA Snippet {% endcomment %}
<div id="fluxxis-cta-root"
     data-product-id="{{ product.id }}"
     data-product-title="{{ product.title | escape }}"
     data-product-price="{{ product.price | money_without_currency }}"
     data-currency="{{ cart.currency.iso_code }}">
</div>
```

No `product-template.liquid` (ou equivalente), adiciona onde queres o CTA:

```liquid
{% render 'fluxxis-cta' %}
```

### 3. Ver o CTA adaptativo

O script-tag faz todo o pipeline automaticamente:

```
URL da página → detectIntentFromURL() → collectSignals() → resolveCTA() → render
```

| Página | Intento detetado | CTA exibido |
|--------|:-----------------:|-------------|
| `/products/...` | `browse` | 🔍 Explorar Produtos |
| `/cart`, `/checkout` | `buy` | 🛒 Comprar Agora — €29.99 |
| `/compare` | `compare` | ⚖️ Comparar Modelos |
| `/blog/...` | `learn` | 📚 Saber Mais |

> **Fallback sem JavaScript:** O `<noscript>` renderiza um link estático. A loja funciona para todos os utilizadores.

### Alternativa: ScriptTag API

```bash
curl -X POST https://your-store.myshopify.com/admin/api/2024-01/script_tags.json \
  -H "X-Shopify-Access-Token: YOUR_TOKEN" \
  -d '{
    "script_tag": {
      "event": "onload",
      "src": "https://cdn.fluxxis.dev/adaptive-cta/v0.2.0/smart-cta.umd.js"
    }
  }'
```

---

## 🧠 Core SDK Quickstart

O `@fluxxis/core` é o motor agnóstico de framework. Usa-o diretamente quando não tens React ou queres controlo total.

### Instalação

```bash
npm install @fluxxis/core
```

### Exemplo: Interpretar intents programaticamente

```typescript
import {
  resolveIntent,
  IntentResolver,
  DEFAULT_RESOLUTION_OPTIONS,
  nodeRegistry,
  detectActorType,
} from '@fluxxis/core';

// 1. Criar resolver com cache
const resolver = new IntentResolver(DEFAULT_RESOLUTION_OPTIONS, 300000);

// 2. Declarar intenção
const declaration = {
  componentId: 'hero-cta-1',
  goal: 'convert' as const,
  priority: 'high' as const,
  timestamp: Date.now(),
  actorType: 'human' as const,
  context: { page: 'pricing', deviceType: 'desktop' },
};

// 3. Simular sinais do utilizador (dwell > 5s → emphasis: strong)
const signals = [
  {
    type: 'dwell' as const, value: 5200, timestamp: Date.now() - 1000,
    context: { componentId: 'hero-cta-1', userType: 'returning' },
  },
  { type: 'hover' as const, value: 1, timestamp: Date.now() - 500,
    context: { componentId: 'hero-cta-1' } },
];

// 4. Resolver — emphasis:'strong', animation:'urgent'
const resolution = resolver.resolve(declaration, signals);
console.log('Resolução:', {
  emphasis: resolution.emphasis,
  animation: resolution.animation,
  microcopy: resolution.microcopy,
});

// 5. Registar no node registry
nodeRegistry.register({
  id: 'hero-cta-1', goal: 'convert', pageContext: 'pricing',
});

// 6. Detetar tipo de ator (humano vs AI agent)
console.log('Ator:', detectActorType(navigator.userAgent));

// 7. Cache stats
console.log(resolver.getCacheStats()); // { size: 1, hits: 0, misses: 1 }
resolver.resolve(declaration, signals);  // cache hit
console.log(resolver.getCacheStats()); // { size: 1, hits: 1, misses: 1 }

// 8. Limpar
nodeRegistry.deregister('hero-cta-1', 'Componente removido');
resolver.clearCache();
```

### Exemplo: Tokens de design

```typescript
import { getIntentTokens, applyIntentTokens } from '@fluxxis/core';

// Obter tokens CSS para um goal
const tokens = getIntentTokens('convert');
// { animation: '...', borderRadius: '8px', shadow: '...' }

// Aplicar tokens diretamente a um elemento DOM
const button = document.getElementById('my-button');
if (button) {
  applyIntentTokens(button, 'convert');
}
```

---

## 🚀 Próximos Passos

| Recurso | Descrição |
|---------|-----------|
| [📘 API: @fluxxis/core](./api/core.md) | Referência completa do motor — tipos, resolução de intents, tokens |
| [📘 API: @fluxxis/react](./api/react.md) | Componentes, hooks e stores React |
| [📘 API: @fluxxis/ui](./api/ui.md) | Design tokens, CSS custom properties, classes utilitárias |
| [📘 API: Adaptive CTA](./api/adaptive-cta.md) | Motor de CTA para Shopify/WooCommerce |
| [📘 Getting Started](./getting-started.md) | Guia detalhado com exemplos de Progressive Enhancement |
| [📄 Technical Paper](../FLUXXIS-PAPER.md) | Definição formal, arquitetura e provas |
| [🗺️ ROADMAP](../ROADMAP.md) | Planeamento e próximas features |

---

**Fluxxis não desenha pixels. Orquestra intenção.**
