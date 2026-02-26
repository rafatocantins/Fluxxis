# MCP Setup Guide — AI Design System

This guide helps you configure Model Context Protocol (MCP) servers to accelerate development of your AI Design System.

---

## 🎯 Recommended MCPs for This Project

### Tier 1: Essential (Start Here)

| MCP | Purpose | Install Time |
|-----|---------|--------------|
| **Filesystem** | Read/edit project files securely | 1 min |
| **Context7** | Fetch latest React/TypeScript docs | 1 min |
| **GitHub** | Repository management, issues, PRs | 2 min |

### Tier 2: UI Generation (Highly Recommended)

| MCP | Purpose | Install Time |
|-----|---------|--------------|
| **Magic UI MCP** | 50+ animated React components | 2 min |
| **ReactBits MCP** | 135+ animated components | 2 min |
| **21st.dev Magic** | AI-driven UI generation | 5 min |

### Tier 3: Design & Debugging (Optional)

| MCP | Purpose | Install Time | Cost |
|-----|---------|--------------|------|
| **AppContext** | Real-time visual debugging | 10 min | $9.99/mo |
| **Figma MCP** | Extract design tokens from Figma | 5 min | Free |

---

## 🚀 Quick Start

### Minimal Setup (5 minutes)

```bash
# 1. Filesystem MCP - for file operations
npx -y @modelcontextprotocol/server-filesystem@latest --allowed-dirs .

# 2. Context7 MCP - for documentation
npx -y @context7/mcp@latest

# 3. GitHub MCP - for repository management
npx -y @modelcontextprotocol/server-github@latest
```

### Full Setup (15 minutes)

```bash
# 1. Magic UI MCP
npx @magicuidesign/cli@latest install

# 2. 21st.dev Magic (requires API key)
# Get key from https://21st.dev/magic
npx @21st-dev/cli@latest install cursor --api-key YOUR_KEY

# 3. ReactBits MCP
npx reactbits-dev-mcp-server
```

---

## 📋 Detailed Installation

### 1. Filesystem MCP

**Purpose:** Secure file access for reading and editing project files.

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem@latest", "--allowed-dirs", "."]
    }
  }
}
```

**Security:** Restricted to project directory only.

---

### 2. Context7 MCP

**Purpose:** Fetch current documentation for React, TypeScript, Tailwind, Zustand, etc.

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp@latest"]
    }
  }
}
```

---

### 3. GitHub MCP

**Purpose:** Repository management, issues, PRs, code search.

**Setup:**
1. Generate token at https://github.com/settings/tokens
2. Scopes: `repo`, `read:org`, `user`

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github@latest"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

---

### 4. Magic UI MCP ⭐

**Purpose:** Access to 50+ animated React components.

**Available Components:**
- **Layout:** bento-grid, dock, grid-pattern, dot-pattern
- **Motion:** blur-fade, scroll-progress, orbiting-circles
- **Buttons:** rainbow-button, shimmer-button, shiny-button
- **Text:** text-animate, aurora-text, number-ticker, typing-animation
- **Effects:** animated-beam, border-beam, magic-card, confetti, particles
- **Backgrounds:** warp-background, flickering-grid, ripple

```json
{
  "mcpServers": {
    "magicuidesign-mcp": {
      "command": "npx",
      "args": ["-y", "@magicuidesign/mcp@latest"]
    }
  }
}
```

**Example Usage:**
```
"Make a marquee of logos"
"Add a blur fade text animation"
"Add a grid background"
"Create a shimmer button for CTA"
```

---

### 5. ReactBits MCP

**Purpose:** Access to 135+ animated React components.

**Categories:**
- Animations, Backgrounds, Buttons, Cards
- Text Animations, Navigation

```json
{
  "mcpServers": {
    "reactbits": {
      "command": "npx",
      "args": ["reactbits-dev-mcp-server"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Note:** Set `GITHUB_TOKEN` for higher rate limits (5000/hr vs 60/hr).

---

### 6. 21st.dev Magic MCP

**Purpose:** AI-driven UI generation through natural language.

**Setup:**
1. Get API key from https://21st.dev/magic
2. Run installation command

```json
{
  "mcpServers": {
    "21st-dev-magic": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest"],
      "env": {
        "API_KEY": "${21ST_DEV_API_KEY}"
      }
    }
  }
}
```

---

### 7. AppContext (macOS Only)

**Purpose:** Real-time visual feedback with screenshots and console logs.

**Setup:**
1. Download from https://appcontext.dev
2. Install (macOS menu bar app)
3. Subscribe to Pro ($9.99/month)
4. Login with email

```json
{
  "mcpServers": {
    "appcontext": {
      "url": "http://localhost:7777/sse",
      "type": "sse"
    }
  }
}
```

**Use Cases:**
- Visual debugging of SmartCTA components
- Monitor behavior tracking in real-time
- Verify intent-based UI adaptations

---

### 8. Figma MCP

**Purpose:** Extract design tokens, components, and variables from Figma.

**Setup:**
1. Create token at https://www.figma.com/developers/api
2. Get file key from your design system file

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-mcp@latest"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}",
        "FIGMA_FILE_KEY": "${FIGMA_FILE_KEY}"
      }
    }
  }
}
```

---

## 🔧 IDE Configuration

### Cursor

1. Open Settings → Features → MCP
2. Click "Add MCP server"
3. Or edit `~/.cursor/mcp.json` directly

### VS Code

Add to User Settings (JSON) or `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem@latest", "--allowed-dirs", "."]
    }
  }
}
```

### Claude Desktop

Edit config file:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

---

## 🎯 Usage Examples for AI Design System

### Generating SmartCTA Variants

```
@magicuidesign-mcp — Create a shimmer button with hover effects for SmartCTA
@reactbits — Find animated button components with pulse effect
@21st-dev-magic — Generate a floating CTA pill with scroll-based animation
```

### Extracting Design Tokens

```
@figma — Extract color tokens from the design system file
@figma — Get typography variables for BrandVoice
```

### Debugging Behavior

```
@appcontext — Show current scroll velocity and dwell time
@appcontext — Capture console logs from behavior tracker
```

### Documentation Lookup

```
@context7 — Get latest React hooks documentation
@context7 — Find Zustand persistence patterns
@context7 — TypeScript utility types for component props
```

---

## 🔒 Security Best Practices

1. **Start read-only** — Docs, search, observability first
2. **Scope blast radius** — Per-project keys, limited directories
3. **Use environment variables** — No hard-coded keys in JSON
4. **Filesystem restrictions** — Only allow project directory
5. **Log all calls** — Track what was called with which arguments

---

## 📊 MCP Selection by Phase

| Phase | Focus | Recommended MCPs |
|-------|-------|------------------|
| **Phase 1** (Months 1-3) | Intent Design System | filesystem, context7, github, magicuidesign-mcp, reactbits |
| **Phase 2** (Months 4-8) | Adaptive Layer | + figma, appcontext |
| **Phase 3** (Months 9+) | Orchestration Platform | All MCPs for governance |

---

## 🆘 Troubleshooting

### MCP Not Loading
- Check Node.js version (Latest LTS required)
- Verify npx is in PATH
- Restart IDE after config changes

### Rate Limit Errors (ReactBits)
- Set `GITHUB_TOKEN` environment variable
- Without token: 60 requests/hour
- With token: 5000 requests/hour

### AppContext Not Connecting
- Ensure AppContext app is running (menu bar)
- Check URL: `http://localhost:7777/sse`
- Verify Chrome DevTools integration is enabled

### 21st.dev Magic API Errors
- Regenerate API key at https://21st.dev/magic
- Check key is set in environment variable
- Verify subscription is active

---

## 📚 Resources

- **MCP Servers Directory:** https://mcpservers.org
- **Official MCP Spec:** https://modelcontextprotocol.io
- **Awesome MCP Servers:** https://github.com/punkpeye/awesome-mcp-servers
- **Builder.io MCP Guide:** https://www.builder.io/blog/best-mcp-servers-2026
