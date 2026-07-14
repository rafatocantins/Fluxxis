# Contributing to FLUXXIS

Obrigado pelo interesse em contribuir com o FLUXXIS! 🚀

Este documento descreve como configurar o ambiente, a estrutura do projeto, e o processo para enviar contribuições.

---

## 📋 Código de Conduta

Seja respeitoso, construtivo e inclusivo. Todas as contribuições são bem-vindas — code, docs, issues, reviews.

---

## 🛠️ Setup do Ambiente

### Pré-requisitos

- **Node.js** >= 18.0.0
- **pnpm** >= 10.0.0 (gerenciado via `packageManager` no `package.json`)

### Clone e Instalação

```bash
git clone https://github.com/rafatocantins/Fluxxis.git
cd Fluxxis
pnpm install
pnpm build
```

---

## 📁 Estrutura do Monorepo

```
Fluxxis/
├── packages/
│   ├── core/          # @fluxxis/core — Engine framework-agnostic
│   │   └── src/
│   │       ├── signals/       # Detecção de agentes
│   │       ├── intents/       # Resolução de intents
│   │       ├── analytics/     # Analytics para agentes
│   │       ├── structured-data/  # JSON-LD, Microdata, RDFa
│   │       ├── licensing/     # API keys, tiers, enforcement
│   │       ├── registry/      # Node registry
│   │       ├── tracking/      # Tracking system
│   │       ├── tokens/        # Design tokens
│   │       ├── types/         # Type definitions
│   │       └── utils/         # Utilities
│   ├── react/         # @fluxxis/react — React adapter
│   │   └── src/
│   │       ├── components/    # SmartSection, SmartCTA, etc.
│   │       ├── hooks/         # useIntent, useBehaviorObserver, etc.
│   │       └── stores/        # Zustand stores
│   └── demo/          # Landing page / showcase
│       └── src/       # React app + Vite
├── .github/workflows/ # CI/CD pipelines
├── CHANGELOG.md       # Keep a Changelog
├── CONTRIBUTING.md    # Este arquivo
└── LICENSE            # MIT
```

---

## 🚀 Scripts Disponíveis

Na raiz do monorepo:

| Script | Descrição |
|--------|-----------|
| `pnpm dev` | Inicia todos os pacotes em modo dev |
| `pnpm build` | Build de todos os pacotes |
| `pnpm test` | Executa todos os testes (Vitest) |
| `pnpm test:coverage` | Testes com cobertura |
| `pnpm lint` | ESLint em todos os pacotes |
| `pnpm lint:fix` | ESLint com auto-fix |
| `pnpm format` | Prettier em todos os arquivos |
| `pnpm typecheck` | TypeScript type-checking |
| `pnpm clean` | Limpa diretórios `dist` |

Por pacote (ex: dentro de `packages/core`):

```bash
cd packages/core
pnpm dev          # Watch mode
pnpm build        # Build com tsup
pnpm test         # Vitest
pnpm typecheck    # tsc --noEmit
```

---

## 🌿 Processo de Pull Request

### 1. Branch Naming

Use o padrão de conventional branches:

| Prefixo | Uso |
|---------|-----|
| `feat/*` | Nova feature |
| `fix/*` | Correção de bug |
| `docs/*` | Documentação |
| `chore/*` | Manutenção, build, CI |
| `refactor/*` | Refatoração |
| `test/*` | Testes |

Exemplos: `feat/smart-modal`, `fix/core-build`, `docs/api-reference`, `chore/release-prep`

### 2. Conventional Commits

Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): descrição curta

Corpo detalhado opcional.
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`

### 3. Fluxo de PR

1. **Fork** o repositório (ou crie branch se for maintainer)
2. **Crie uma branch** a partir de `main`
3. **Desenvolva** sua contribuição
4. **Teste** localmente: `pnpm build && pnpm test && pnpm typecheck`
5. **Commit** com mensagens convencionais
6. **Push** e abra um Pull Request para `main`
7. Aguarde **review** e **CI** (lint, typecheck, test, build)

### 4. Checklist do PR

- [ ] Testes passam localmente (`pnpm test`)
- [ ] Build passa (`pnpm build`)
- [ ] TypeScript sem erros (`pnpm typecheck`)
- [ ] Lint limpo (`pnpm lint`)
- [ ] Commits seguem Conventional Commits
- [ ] Documentação atualizada se necessário

---

## 🎨 Code Style

- **Formatter**: Prettier
- **Linter**: ESLint com `@typescript-eslint`
- **TypeScript**: Strict mode habilitado
- **React**: ESLint plugins `react` e `react-hooks`
- **Formatar antes de commitar**: `pnpm format`

```bash
# Formatar tudo
pnpm format

# Lint com auto-fix
pnpm lint:fix
```

---

## 🧪 Testing

- **Framework**: Vitest
- **E2E (futuro)**: Playwright

```bash
# Rodar todos os testes
pnpm test

# Rodar com watch mode
cd packages/core && pnpm test:watch

# Rodar com coverage
pnpm test:coverage
```

Os testes estão organizados por módulo dentro de diretórios `__tests__/`:

```
packages/core/src/
├── signals/__tests__/agentDetection.test.ts
├── intents/__tests__/resolution.test.ts
├── licensing/__tests__/licensing.test.ts
└── structured-data/__tests__/structured-data.test.ts
```

---

## 📦 Publicação

Packages públicos no npm:

- `@fluxxis/core` — npm registry
- `@fluxxis/react` — npm registry

O release é feito via git tags semver + GitHub Actions (a ser configurado).

---

## ❓ Dúvidas?

Abra uma [issue](https://github.com/rafatocantins/Fluxxis/issues) ou comente no PR.

---

**FLUXXIS Research Team** — Construindo interfaces que se adaptam.
