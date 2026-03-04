# AI Driven Design System — Documento Mestre do Projeto

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Status:** Aprovação Pendente  
**Confidencial:** Interno  
**Owner:** Product Lead

---

## 📋 Índice

1. [Visão Executiva](#1-visão-executiva)
2. [Tese Central do Projeto](#2-tese-central-do-projeto)
3. [Análise Crítica](#3-análise-crítica)
4. [Arquitetura do Sistema](#4-arquitetura-do-sistema)
5. [Roadmap por Fases](#5-roadmap-por-fases)
6. [Especificações Técnicas](#6-especificações-técnicas)
7. [Propostas de Valor](#7-propostas-de-valor)
8. [Riscos e Mitigação](#8-riscos-e-mitigação)
9. [Plano de Ação Imediato](#9-plano-de-ação-imediato)

---

## 1. Visão Executiva

### O Que Estamos a Construir

Um **Design System Orientado por Intenção** onde cada elemento da interface — desde um botão até uma página completa — tem um objetivo declarado, observa comportamento em tempo real, e adapta-se autonomamente para cumprir esse objetivo.

### Diferenciador de Mercado

| Design Systems Tradicionais | AI Driven Design System |
|----------------------------|------------------------|
| Componentes estáticos | Componentes com intenção |
| Sem conhecimento de objetivo | Goal declarado por nó |
| Otimização manual externa | Adaptação nativa e automática |
| Personalização por segmento | Personalização individual ética |
| Black box decisions | Decisões auditáveis e explicáveis |

### Mercado e Oportunidade

- **Mercado de personalização AI:** $629 mil milhões até 2029
- **80% das organizações** identificam experiências personalizadas como prioridade
- **Gap no mercado:** Nenhum design system existente com hierarquia de intenção nativa

---

## 2. Tese Central do Projeto

### Princípio Fundador

> **O objetivo vem sempre primeiro. A personalização serve o objetivo — nunca o substitui.**

Se um utilizador prefere interfaces minimalistas mas o goal requer mostrar detalhe, mostramos o detalhe da forma mais confortável possível. O goal nunca é comprometido.

### Hierarquia de Intenção

```
PAGE         → Macro outcome (ex: "generate qualified lead")
  └── SECTION    → Strategic step (ex: "overcome price objection")
        └── LAYOUT   → Structural frame (ex: "present clearly, reduce noise")
              └── COMPONENT → Tactical action (ex: "trigger click")
                    └── ELEMENT   → Micro-signal (ex: "attract the eye")
```

### Regras Invioláveis

1. **Nunca modificar um nó que está 20% acima do seu baseline**
2. **Sempre começar pelo nível de intervenção mais baixo**
3. **Nunca automatizar mudanças estruturantes (níveis 6-8)**
4. **Cada decisão deve ser explicável e auditável**
5. **Preferências explícitas do utilizador são soberanas**

---

## 3. Análise Crítica

### ✅ O Que É Genuinamente Forte

| Conceito | Por Que Funciona |
|----------|-----------------|
| **Hierarquia de Intenção** | Page → Section → Layout → Component com goals declarados é uma inovação real. Nenhum design system existente opera com esta lógica orientada a objetivos. |
| **Princípio "Goal First"** | Personalização serve o objetivo, nunca o substitui. Isto protege o sistema de se tornar uma ferramenta de manipulação. |
| **Espectro de Intervenção** | Começar no nível 1 (tokens) e só escalar com evidência é engenharia cautelosa e correcta. Previne mudanças disruptivas prematuras. |
| **Human-in-the-Loop para mudanças estruturais** | Mudanças de layout/secção exigem aprovação humana. Isto equilibra automação com responsabilidade. |
| **BrandVoice como fonte única de verdade** | Centralizar o tom de comunicação evita inconsistências e permite copy gerado por AI com coerência. |

### ⚠️ O Que É Problemático ou Prematuro

| Conceito | Risco | Mitigação |
|----------|-------|-----------|
| **Orchestrator completo como ponto de partida** | É um sistema de anos, não de semanas. Tentar construir tudo primeiro = nunca lançar. | Começar com um EventBus mínimo. Adicionar Decision Engine apenas após validação. |
| **UserPersonalisationProfile com 15+ sinais** | A maioria dos utilizadores não atinge sessão 10. Sinais como `respondsToBold` exigem volume estatístico inexistente no início. | Reduzir para 4 sinais fundamentais: `readingPattern`, `decisionSpeed`, `preferredDensity`, `sessionFrequency`. |
| **Decision Engine com Reinforcement Learning** | RL para interfaces é área de investigação com poucos casos de sucesso em produção. Difícil de debugar e explicar. | Substituir por regras determinísticas na v1. Introduzir ML apenas após ter dados reais e padrões validados. |
| **Visual Intelligence / Behavior Layer como sistemas separados** | Na prática, decisões visuais dependem de comportamento e vice-versa. Separação arquitectural cria acoplamento implícito. | Unificar num único módulo de "Adaptive Intelligence" com sub-módulos internos. |
| **Ethics Guard como layer sobreposta** | Regras éticas aplicadas "por cima" das decisões já falharam — as decisões erradas nunca deviam ser tomadas. | Integrar as regras éticas directamente nos critérios de decisão, não como filtro posterior. |

### 🎯 O Risco Central Não Nomeado

> **O projeto tenta resolver 3 produtos distintos em simultâneo:**
> 1. Um **design system** (componentes, tokens, layouts)
> 2. Um **sistema de otimização** (A/B testing, intervenção baseada em dados)
> 3. Um **sistema de personalização** (adaptação individual, memória cross-session)

Cada um destes é um produto completo por si só. Tentar construir os três integrados desde o início é o caminho mais rápido para não entregar nenhum.

---

## 4. Arquitetura do Sistema

### Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        ORCHESTRATOR                              │
│   (Registry + EventBus + Decision Engine + Audit Log)           │
└────────┬──────────────────────────────────────────┬─────────────┘
         │ broadcast()                    emit() ↑  │
         ▼                                          │
┌────────────────┐                                  │
│   PAGE NODE    │                                  │
│  goal: "lead   │                                  │
│  to conversion"│                                  │
└───────┬────────┘                                  │
        │                                           │
        ▼                                           │
┌────────────────────────────────────────────────────────────────┐
│                      SECTION: "convince"                        │
│  goal: drive-conversion | metric: conversion_rate               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              LAYOUT: split-with-sidebar                   │  │
│  │  columns: [65%, 35%]  →  rule: if failing → [100%]       │  │
│  │                                                            │  │
│  │  ┌────────────────────────┐  ┌────────────────────────┐  │  │
│  │  │    SmartPricing        │  │   SmartTestimonial     │  │  │
│  │  │    goal: highlight     │  │   goal: build-trust    │  │  │
│  │  └────────────────────────┘  └────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌───────────────────────────────────────────────────┐   │  │
│  │  │                 SmartCTA                           │   │  │
│  │  │    goal: convert | subscribes: intent, pricing     │   │  │
│  │  └───────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### Camadas do Sistema (v1 Simplificada)

| Camada | Responsabilidade | Tecnologias |
|--------|------------------|-------------|
| **Brain Layer** | Contexto global, estado de intenção, memória | Zustand, Edge Functions |
| **Orchestrator** | Registry, EventBus (v1 simples) | TypeScript |
| **Behavior Layer** | Tracking de scroll, hover, dwell, exit | IntersectionObserver, Mouse Events |
| **Visual Intelligence** | Tokens, ênfase, tipografia, cor | CSS Variables, Framer Motion |
| **LLM Layer** | Geração de copy, classificação de intent | Claude API, Edge Functions |
| **Observability** | Audit log, métricas, health monitor | Custom Analytics |

### Contrato de Nó Inteligente

```typescript
interface IntelligentNode {
  // Identidade
  id: string
  type: "page" | "section" | "layout" | "component" | "element"
  parent: string | null
  
  // Intenção
  goal: Goal
  successMetric: Metric
  currentPerformance: number  // 0-1
  isProtected: boolean        // true se >= baseline * 1.2
  
  // Ciclo de vida
  onMount(): void
  onUnmount(): void
  
  // Comunicação
  emit(event: NodeEvent): void
  receive(instruction: Instruction): void
  
  // Capacidade de mudança
  recompose(strategy: RecompositionStrategy): void
  degrade(): void  // fallback gracioso
}
```

### Espectro de Intervenção

| Nível | Nome | O Que Muda | Auto? | Sessões Mín. |
|-------|------|------------|-------|--------------|
| 1 | TOKEN_ADJUSTMENT | size, weight, colour, spacing | ✅ SIM | 50 |
| 2 | EMPHASIS_SHIFT | visual weight redistribution | ✅ SIM | 75 |
| 3 | MICRO_MOTION | pulse, anchor, reveal | ✅ SIM* | 75 |
| 4 | COPY_VARIANT | text, tone, CTA wording | ✅ SIM | 100 |
| 5 | COMPONENT_VARIANT | different version, same goal | ✅ SIM | 150 |
| 6 | POSITION_SHIFT | component moves within layout | ⚠️ PROPÔE | 200 |
| 7 | LAYOUT_CHANGE | columns, weights, order | ⚠️ PROPÔE | 300 |
| 8 | SECTION_REBUILD | new section strategy entirely | ⚠️ PROPÔE + HUMANO | 500 |

*\* apenas se userVisualProfile.respondsToMotion === true*

### Regra de Protecção

```typescript
function canIntervene(node: IntelligentNode, intervention: Intervention): boolean {
  // Nunca tocar no que está bem a funcionar
  if (node.isProtected && intervention.level > 2) return false
  
  // Nunca actuar em mudanças recentes bem-sucedidas — deixar estabilizar
  if (node.lastSuccessfulChange && 
      timeSince(node.lastSuccessfulChange) < STABILIZATION_PERIOD) return false
  
  // Nunca correr duas intervenções na mesma secção simultaneamente
  if (node.parentSection.hasActiveIntervention()) return false
  
  // Nunca actuar com dados insuficientes
  if (node.exposedSessions < intervention.minSessionsRequired) return false
  
  return true
}
```

---

## 5. Roadmap por Fases

### 📦 FASE 1 — Intent Design System (Meses 1-3)

**Objetivo:** Validar a tese central com um produto instalável e funcional.

#### Entregáveis

| Componente | Descrição | Prioridade |
|------------|-----------|------------|
| `<BrainProvider>` | React context com estado global | P0 |
| `useOrchestrator` | Hook de registo e comunicação | P0 |
| `<SmartCTA>` | Componente MVP com goal declarado | [x] P0 |
| `<SmartSection>` | Wrapper com monitoring de secção | [x] P0 |
| `<SmartLayout>` | Layout com regras adaptativas básicas | P1 |
| `BrandVoice` | Schema de tom de voz + copy generator | [x] P0 |
| `EventBus` | Sistema pub/sub mínimo | [x] P0 |
| `PrivacyFilter` | Filtro de dados antes de qualquer saída | [x] P0 |
| `FallbackEngine` | Degradação graciosa sem API/JS | [x] P0 |

#### Sinais de Personalização (v1)

Apenas 4 sinais fundamentais — os mais fiáveis com baixo volume:

| Sinal | Como é Detectado | Threshold de Confiança |
|-------|------------------|----------------------|
| `readingPattern` | Scroll velocity + dwell time por palavra | 2 sessões |
| `decisionSpeed` | CTR em primeiras visitas | 2 sessões |
| `preferredDensity` | Padrão de scroll + tempo em secções densas | 3 sessões |
| `sessionFrequency` | Cookie de sessão + fingerprint | 1 sessão |

#### Critérios de Sucesso da Fase 1

- [ ] Um desenvolvedor consegue instalar a biblioteca em <30 minutos
- [ ] `<SmartCTA goal="convert" />` funciona com tracking real
- [ ] Copy generation via Edge Function + Claude API (<400ms latency)
- [ ] Fallback estático funciona quando API falha
- [ ] 3-5 equipas externas a testar em produção
- [ ] Goal Completion Rate +15% vs componentes estáticos (teste controlado)

#### Timeline Fase 1

```
Semana 1-2:  Setup repositório, estrutura base, BrainProvider
Semana 3-4:  SmartCTA MVP com tracking e copy generation
Semana 5-6:  SmartSection + SmartLayout básicos
Semana 7-8:  PrivacyFilter + FallbackEngine + testes
Semana 9-10: Documentação + onboarding de primeiros utilizadores
Semana 11-12: Validação com dados reais + ajustes
```

---

### 🚀 FASE 2 — Adaptive Layer (Meses 4-8)

**Objetivo:** Adicionar inteligência observacional e adaptação automática segura.

#### Novas Capacidades

| Capacidade | Descrição | Níveis de Intervenção |
|------------|-----------|----------------------|
| **Espectro de Intervenção** | Automação níveis 1-5 | 1-5 automático |
| **Behavior Tracking Robusto** | Semântica, não só eventos | — |
| **Emphasis Map** | Hierarquia visual dinâmica | Nível 2 |
| **A/B Orchestrator** | Variantes de componente | Nível 4-5 |
| **Dashboard de Métricas** | Goal Completion Rate por componente | — |
| **GDPR Compliance** | Privacy by design | — |

#### Critérios de Sucesso da Fase 2

- [ ] Sistema deteta falha de componente e aplica adaptação nível 1-3 automaticamente
- [ ] Relatório de melhoria de métrica após intervenção
- [ ] Zero intervenções manuais necessárias para níveis 1-5
- [ ] Dashboard funcional com Goal Completion Rate por componente
- [ ] 10+ equipas em produção
- [ ] Custo LLM <€500/mês com volume real

#### Timeline Fase 2

```
Mês 4:  Espectro de intervenção níveis 1-3
Mês 5:  Níveis 4-5 + Emphasis Map
Mês 6:  A/B Orchestrator básico
Mês 7:  Dashboard de métricas
Mês 8:  Validação + otimização de custos LLM
```

---

### 🏗️ FASE 3 — Orchestration Platform (Meses 9+)

**Objetivo:** Escalar para governança centralizada e personalização individual avançada.

#### Capacidades Avançadas

| Capacidade | Descrição | Aprovação Humana |
|------------|-----------|-----------------|
| **Orchestrator Completo** | Decision Engine baseado em dados reais | — |
| **Human-in-the-Loop** | Dashboard para propostas estruturais | Níveis 6-8 |
| **Personalização Individual** | Perfis validados por sessão | — |
| **Audit Log Completo** | Explicabilidade de cada decisão | — |
| **Enterprise Integration** | SSO, RBAC, compliance | — |

#### Estrutura de Proposta Estrutural

```typescript
{
  problem: "Section 'pricing' CTR 0.9% em 847 sessões",
  evidence: ["73% exit rate", "dwell 12s sem conversão"],
  hypothesis: "Muita escolha está a paralisar a decisão",
  proposal: "Tabela 3 planos → pergunta única 'Quantas pessoas?'",
  risks: "Utilizadores recorrentes vão notar a mudança",
  rollout: "5% → 20% → 50% → 100% com reversão automática",
  successCriteria: "CTR > 2.5% em 200 sessões"
}
```

#### Critérios de Sucesso da Fase 3

- [ ] Propostas estruturais geradas automaticamente com evidência completa
- [ ] Dashboard de review humano funcional
- [ ] Rollout faseado com reversão automática implementado
- [ ] Audit log completo acessível para compliance
- [ ] 50+ equipas em produção
- [ ] ROI mensurável por cliente (>3x custo da ferramenta)

#### Timeline Fase 3

```
Mês 9-10:  Decision Engine baseado em dados reais
Mês 11-12: Human-in-the-Loop dashboard
Mês 13-14: Personalização individual avançada
Mês 15-16: Enterprise features (SSO, RBAC, compliance)
Mês 17-18: Scale e otimização
```

---

## 6. Especificações Técnicas

### Stack Recomendada

#### Frontend
- **React** com TypeScript
- **Zustand** ou **Jotai** para estado global (Brain)
- **IntersectionObserver API** para visibility tracking
- **Framer Motion** para behavioral animations

#### Intelligence Layer
- **Edge Functions** (Vercel Edge / Cloudflare Workers) para chamadas LLM
- **Anthropic Claude API** (`claude-sonnet-4-5-20250929`) para copy generation
- **Streaming responses** para baixa latência

#### Observability
- Custom analytics layer (evitar third-party por defeito)
- Cada componente emite eventos estruturados para BehaviorLog
- ComponentHealthMonitor track goal completion por componente

#### Privacy
- All behavior tracking é first-party apenas
- PrivacyFilter corre antes de qualquer dado sair do cliente
- Sem PII em prompts LLM — apenas behavioral signals e segmentos
- GDPR-compliant by design: opt-out degrada para componentes estáticos

### File Structure

```
/ai-design-system
├── /system
│   ├── /orchestrator
│   │   ├── Orchestrator.ts
│   │   ├── DecisionEngine.ts
│   │   ├── InterventionSpectrum.ts
│   │   ├── ProposalQueue.ts
│   │   └── ProtectionRules.ts
│   └── /brain
│       ├── BrainProvider.tsx
│       ├── IntentEngine.ts
│       ├── IdentityLayer.ts
│       ├── BehaviorLog.ts
│       ├── VisualIntelligence.ts
│       ├── BrandVoice.ts
│       └── EthicsGuard.ts
├── /hooks
│   ├── useOrchestrator.ts
│   ├── useScrollObserver.ts
│   ├── useHoverTracker.ts
│   ├── useExitIntent.ts
│   ├── useDwellTimer.ts
│   ├── useVisibilityObserver.ts
│   ├── useEmphasis.ts
│   └── useVisualTokens.ts
├── /components
│   └── /smart
│       ├── SmartCTA/
│       ├── SmartHero/
│       ├── SmartSection/
│       ├── SmartLayout/
│       ├── SmartPricing/
│       ├── SmartForm/
│       ├── SmartNav/
│       └── SmartTestimonial/
├── /tokens
│   ├── intent.tokens.ts
│   ├── motion.tokens.ts
│   ├── density.tokens.ts
│   └── tone.tokens.ts
├── /utilities
│   ├── copyGenerator.ts
│   ├── variantManager.ts
│   ├── privacyFilter.ts
│   ├── fallbackEngine.ts
│   └── performanceBudget.ts
├── /observability
│   ├── ComponentHealthMonitor.ts
│   ├── GoalTracker.ts
│   ├── PersonalisationAudit.ts
│   └── ProposalDashboard.ts
├── /edge-functions
│   ├── generate-copy.ts
│   ├── classify-intent.ts
│   └── evaluate-goal.ts
└── package.json
```

### SmartCTA — Spec Detalhada (Primeiro Build Target)

#### Props

```typescript
interface SmartCTAProps {
  goal: "convert" | "engage" | "capture" | "navigate"
  defaultCopy: string              // fallback se LLM indisponível
  pageContext: string              // ex: "pricing page, Pro plan section"
  href?: string
  onConvert?: () => void
}
```

#### Regras de Comportamento

| Sinal | Threshold | Resposta |
|-------|-----------|----------|
| Scroll past sem clique | 1x | Ancorar como floating pill bottom-right |
| Hover dwell | >2s sem clique | Subtle pulse animation |
| Página 80% lida, sem conversão | — | Mudar copy: intent = "hesitating" |
| Exit intent detectado | — | Transformar em inline micro-form |
| 3ª visita, mesma página | — | Copy reconhece visita de retorno |
| CTR = 0% após 50 exposições | — | Trigger A/B variant proposal |

#### Copy Generation Prompt Template

```
You are a conversion copywriter for {brand}.
Voice: {brandVoice.tone}
Audience: {brandVoice.audience}
Avoid: {brandVoice.avoid}
CTA style: {brandVoice.ctaStyle}
Max words: 5

Context:
Page: {pageContext}
User intent: {intentState}
Visit number: {userProfile.visitCount}
Behavior signal: {latestBehaviorSignal}
Previous CTA copy that failed: {failedVariants}

Generate the most compelling CTA copy for this exact moment.
Return only the copy. No punctuation unless essential.
```

---

## 7. Propostas de Valor

### Por Segmento de Mercado

| Segmento | Produto Recomendado | Proposta de Valor |
|----------|--------------------|-----------------|
| **Agências / Freelancers** | Fase 1 | "Um design system que obriga os clientes a declarar objetivos antes de construir. Muda a conversa de 'como fica?' para 'o que faz?'" |
| **Equipas de Produto SaaS** | Fase 2 | "Otimização contínua sem engenheiros dedicados a A/B tests. O componente sabe quando está a falhar e faz algo em relação a isso." |
| **Enterprise / Regulados** | Fase 3 | "Personalização com governança. Cada decisão é auditável, cada mudança estrutural exige aprovação, cada adaptação respeita limites éticos declarados." |

### Diferenciador Único do Mercado

> **Goal-first + Personalização Ética + Transparência Total**

Enquanto ferramentas como Optimizely ou Dynamic Yield optimizam métricas como black boxes, este sistema:
- Explica **porque** tomou cada decisão
- Tem **limites éticos invioláveis** declarados no código
- Coloca o **humano no circuito** para mudanças significativas
- Prioriza **continuidade da experiência** sobre disrupção estatística

### Métricas de Sucesso

| Métrica | Fase 1 Target | Fase 2 Target | Fase 3 Target |
|---------|---------------|---------------|---------------|
| **Goal Completion Rate** | +15% vs estático | +25% vs estático | +35% vs estático |
| **Tempo de Instalação** | <30 minutos | <20 minutos | <15 minutos |
| **Fallback Funcional** | 100% dos casos | 100% dos casos | 100% dos casos |
| **Copy Generation Latency** | <400ms | <300ms | <250ms |
| **Utilizadores Ativos** | 3-5 equipas | 10-20 equipas | 50+ equipas |

---

## 8. Riscos e Mitigação

### Riscos Técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Latência LLM afeta UX** | Alta | Médio | Cache por sessão, fallback estático, edge functions |
| **Dados insuficientes para ML** | Alta | Alto | Começar com regras determinísticas, coletar desde dia 1 |
| **Complexidade do Orchestrator** | Média | Alto | Começar com EventBus simples, escalar gradualmente |
| **Privacy/Compliance falhas** | Baixa | Crítico | PrivacyFilter por design, audit log completo, GDPR desde dia 1 |

### Riscos de Produto

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Valor não percebido pelo cliente** | Média | Alto | ROI mensurável por componente, dashboard claro |
| **Adoção mais lenta que esperado** | Média | Médio | Foco em early adopters SaaS, casos de uso claros |
| **Concorrência lança produto similar** | Baixa | Médio | Diferenciação: goal-first + ética + transparência |

### Riscos de Negócio

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Custos de escala não sustentáveis** | Média | Alto | Threshold claro para ML próprio, otimização contínua |
| **Dificuldade em vender para enterprise** | Média | Médio | Começar por SMB/SaaS, enterprise como Fase 3 |
| **Dependência de provider LLM** | Média | Médio | Multi-provider strategy (Claude + GPT + fallback open) |

---

## 9. Plano de Ação Imediato

### Próximas 2 Semanas

#### Semana 1: Fundação Técnica

```bash
# 1. Setup do repositório
npx create-react-app ai-design-system --template typescript
npm install zustand framer-motion @anthropic-ai/sdk

# 2. Estrutura base de pastas
mkdir -p src/{orchestrator,brain,hooks,components/smart,tokens,utilities,observability,edge-functions}

# 3. Primeiro commit
git init
git add .
git commit -m "Initial commit: AI Driven Design System foundation"
```

#### Semana 2: Primeiro Componente Funcional

```typescript
// SmartCTA.tsx — Esqueleto funcional
export const SmartCTA = ({ goal, defaultCopy, pageContext }: SmartCTAProps) => {
  const { emit, subscribe } = useOrchestrator({ /* contract */ })
  const [copy, setCopy] = useState(defaultCopy)
  const [isFloating, setIsFloating] = useState(false)
  
  // Observa comportamento
  useScrollObserver({ onScrollPast: () => setIsFloating(true) })
  useHoverTracker({ onDwell: () => triggerPulseAnimation() })
  
  // Adapta copy quando intent muda
  subscribe("intent:changed", (intent) => {
    if (intent === "hesitating") {
      const newCopy = await generateCopy({ 
        voice: BrandVoice, 
        context: { pageContext, intent, goal },
        constraint: "max 5 words"
      })
      setCopy(newCopy)
    }
  })
  
  return <Button floating={isFloating}>{copy}</Button>
}
```

#### Critério de Validação da Semana 2

> Conseguir demonstrar num vídeo de 2 minutos:
> 1. Um utilizador faz scroll past o CTA → botão ancora como floating pill
> 2. O mesmo utilizador volta à página → CTA muda copy para "Bem-vindo de volta"
> 3. Tudo isto com fallback estático se a API falhar

---

## 📎 Apêndices

### A. Glossário de Termos

| Termo | Definição |
|-------|-----------|
| **Goal Completion Rate (GCR)** | % de vezes que um componente cumpre o seu objetivo declarado |
| **Intervention Spectrum** | 8 níveis de mudança, do mais subtil ao mais disruptivo |
| **Emphasis Map** | Mapa de peso visual distribuído por todos os nós visíveis |
| **Human-in-the-Loop** | Aprovação humana obrigatória para mudanças estruturantes (níveis 6-8) |
| **PrivacyFilter** | Camada que remove PII antes de qualquer dado sair do cliente |
| **FallbackEngine** | Sistema de degradação graciosa quando serviços falham |
| **BrandVoice** | Fonte única de verdade para tom e linguagem da marca |
| **Orchestrator** | Autoridade global que medeia toda a comunicação entre nós |

### B. Princípios de Desenvolvimento

1. **Nunca construir infra sem necessidade do produto** — Cada linha de código do Orchestrator deve responder a um caso de uso validado.
2. **Dados antes de IA** — Regras determinísticas entregam 80% do valor com 5% da complexidade. Introduzir ML apenas após ter padrões claros.
3. **Fallback primeiro** — Cada componente deve funcionar perfeitamente sem JS, sem API, sem tracking. A inteligência é um upgrade, não um requisito.
4. **Transparência por design** — Cada decisão de personalização deve ser logada e explicável. Se não consegues explicar porque o CTA mudou, não deves ter mudado.
5. **Proteger o que funciona** — Nunca modificar um nó que está 20% acima do seu baseline. O sistema melhora o que falha, não arrisca o que ganha.

### C. Referências Externas

| Categoria | Recurso |
|-----------|---------|
| **Design Systems** | Storybook, Radix UI, Tailwind CSS |
| **Personalization** | Optimizely, Dynamic Yield, Adobe Target |
| **LLM Providers** | Anthropic Claude, OpenAI GPT, Google Gemini |
| **Edge Computing** | Vercel Edge Functions, Cloudflare Workers |
| **ML Infrastructure** | TensorFlow, PyTorch, MLflow, Airflow |

---

## 📝 Aprovações

| Role | Nome | Assinatura | Data |
|------|------|------------|------|
| **Product Lead** | | | |
| **Engineering Lead** | | | |
| **Design Lead** | | | |
| **CEO/Founder** | | | |

---

**Documento Criado:** Fevereiro 2026  
**Próxima Revisão:** Abril 2026  
**Owner do Documento:** Product Lead

---

> **Nota Final:** Este roadmap é um documento vivo. Deve ser revisado e atualizado a cada fase concluída com base em dados reais, feedback de utilizadores, e mudanças no mercado. A visão de longo prazo justifica a direcção, mas as decisões de curto prazo devem ser guiadas por evidência, não por teoria.

---

## 🎯 Conclusão

> **O valor real deste projeto não está na visão de 3 anos — está no SmartCTA que observa, adapta e reporta ao seu goal.**

Começa pequeno. Valida a tese central com um componente. Usa os dados reais para decidir o que construir a seguir. A hierarquia de intenção, o espectro de intervenção e o princípio "goal first" são suficientes para criar um produto diferenciado.

O Orchestrator completo, a personalização individual avançada e o Decision Engine com RL são a visão de longo prazo que justifica a direcção — mas não podem ser o ponto de partida.

**Próximo passo concreto:** Criar o repositório, implementar o contrato de Node e o SmartCTA MVP, e partilhar uma demo funcional em 14 dias.

---

*Fim do Documento*