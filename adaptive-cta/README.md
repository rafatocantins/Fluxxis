# Fluxxis Adaptive CTA Engine

> **CTAs inteligentes que se adaptam à intenção de cada visitante.**
> SaaS — €29/mês. Shopify + WooCommerce.

---

## O que é?

O **Adaptive CTA Engine** é um plugin para e-commerce que substitui botões CTA estáticos por botões inteligentes baseados em intenção. A IA do Fluxxis detecta se o visitante quer **explorar**, **comprar**, **comparar** ou **aprender** — e adapta o texto, cor e ícone do botão em tempo real.

### Quatro Intenções, Um Botão

| Intenção | CTA | Cor | Ícone |
|----------|-----|-----|-------|
| **Browse** | Explorar Produtos | `#2EE6D6` (cyan) | 🔍 |
| **Buy** | Comprar Agora | `#FF5C9D` (pink) | 🛒 |
| **Compare** | Comparar Modelos | `#FFB454` (amber) | ⚖️ |
| **Learn** | Saber Mais | `#8B6DFF` (violet) | 📚 |

---

## Instalação

### Shopify

1. Instala a app **Fluxxis Adaptive CTA** pela Shopify App Store
2. Ou adiciona manualmente via ScriptTag API:

```json
POST /admin/api/2024-01/script_tags.json
{
  "script_tag": {
    "event": "onload",
    "src": "https://cdn.fluxxis.dev/adaptive-cta/v0.1.0/smart-cta.umd.js"
  }
}
```

### WooCommerce

1. Faz upload da pasta `woocommerce/fluxxis-cta` para `/wp-content/plugins/`
2. Ativa o plugin no WordPress Admin → Plugins
3. Configura a chave de licença em WooCommerce → Settings → Adaptive CTA

### React (standalone)

```bash
npm install @fluxxis/adaptive-cta
```

```tsx
import { SmartCTA } from '@fluxxis/adaptive-cta'

<SmartCTA
  intent="buy"
  productId="sku-123"
  price={29.99}
  productName="Widget Pro"
  onCTAClick={(intent) => console.log(`CTA clicked: ${intent}`)}
/>
```

---

## Estrutura do Projeto

```
adaptive-cta/
├── src/
│   ├── index.ts            # Entry points (ESM + CJS + UMD)
│   ├── SmartCTA.tsx         # React component
│   ├── intent-resolver.ts   # Intent detection + CTA mapping
│   ├── ds-adapter.ts        # Multi-platform design system adapters
│   ├── tracking.ts          # Analytics events
│   └── types.ts             # TypeScript types
├── shopify/
│   ├── plugin.json          # Shopify app config
│   └── script-tag.js        # Standalone script for ScriptTag API
├── woocommerce/
│   └── fluxxis-cta.php      # WordPress/WooCommerce plugin
├── landing/
│   └── index.html           # Pricing landing page
└── __tests__/
    └── SmartCTA.test.ts     # Unit tests
```

---

## Design Tokens

Construído com **Fluxxis Design Tokens v2.0**:

```css
--flux-violet:  #8B6DFF;
--flux-cyan:    #2EE6D6;
--flux-pink:    #FF5C9D;
--flux-amber:   #FFB454;
```

Todas as cores garantem contraste **WCAG 2.1 AA** (≥ 4.5:1).

---

## Acessibilidade

- ✅ Contraste ≥ 4.5:1 em todos os modos
- ✅ `focus-visible` com outline de 3px
- ✅ `aria-label` em todos os botões
- ✅ `prefers-reduced-motion` respeitado
- ✅ Fallback `<noscript>` com botão estático "Comprar"

---

## Analytics

Três eventos disparados automaticamente:

| Evento | Quando |
|--------|--------|
| `cta_impression` | CTA renderizado |
| `cta_click` | Clique no CTA |
| `cta_conversion` | Compra concluída |

Configura o endpoint com:

```ts
import { setTrackingEndpoint } from '@fluxxis/adaptive-cta/tracking'
setTrackingEndpoint('https://api.fluxxis.dev/v1/cta-events')
```

---

## Preço

**€29/mês** — Teste grátis 14 dias. Sem cartão de crédito.

[Começar Teste Grátis →](https://fluxxis.dev/adaptive-cta#pricing)

---

## Licença

MIT © 2025 FLUXXIS Research Team
