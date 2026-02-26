# MCP Installation Status

## ✅ Installed & Running MCP Servers

The following MCP servers have been installed for this project:

| Server | Status | Command | Notes |
|--------|--------|---------|-------|
| **filesystem** | ✅ Running | `npx -y @modelcontextprotocol/server-filesystem@latest --allowed-dirs .` | Secure file access |
| **context7** | ✅ Running | `npx -y @context7/mcp@latest` | React/TypeScript docs |
| **magicuidesign-mcp** | ✅ Running | `npx -y @magicuidesign/mcp@latest` | 50+ animated components |
| **reactbits** | ✅ Running | `npx -y reactbits-dev-mcp-server` | 135+ animated components |
| **github** | ✅ Running | `npx -y @modelcontextprotocol/server-github@latest` | GITHUB_TOKEN configured |
| **21st-dev-magic** | ✅ Running | `npx -y @21st-dev/magic@latest` | API key configured |

## ⚠️ Optional MCP Servers (Requires API Keys)

| Server | Status | Setup Command | API Key Required |
|--------|--------|---------------|------------------|
| **figma** | ⏳ Not configured | `npx -y figma-mcp@latest` | `FIGMA_ACCESS_TOKEN`, `FIGMA_FILE_KEY` |
| **appcontext** | ⏳ Not configured | macOS app only | $9.99/month subscription (macOS only) |

---

## 🔧 Configuration Files

### Project Config (`.vscode/mcp.json`)
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem@latest", "--allowed-dirs", "."]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp@latest"]
    },
    "magicuidesign-mcp": {
      "command": "npx",
      "args": ["-y", "@magicuidesign/mcp@latest"]
    },
    "reactbits": {
      "command": "npx",
      "args": ["-y", "reactbits-dev-mcp-server"]
    }
  }
}
```

### Cursor Global Config
Location: `~/.cursor/mcp.json` (or `%APPDATA%\Cursor\MCP\config.json` on Windows)

The Magic UI MCP was installed globally for Cursor. Other MCPs need to be added manually or via the project config.

---

## 🚀 How to Use MCPs

### In Cursor

1. Open Settings → Features → MCP
2. Click "Add MCP server"
3. Point to the project `.vscode/mcp.json` or add servers individually

### In VS Code

1. Install the MCP extension
2. Add configuration to `.vscode/mcp.json` (already done)
3. Restart VS Code

### In Claude Desktop

Edit `claude_desktop_config.json`:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

---

## 🧪 Testing MCPs

### Test Filesystem MCP
```
"List all files in the project directory"
```

### Test Context7 MCP
```
"Get the latest React hooks documentation"
```

### Test Magic UI MCP
```
"Create a shimmer button component"
```

### Test ReactBits MCP
```
"Show me animated button components"
```

---

## 🔑 Setting Up API Keys

### GitHub Token (for GitHub MCP and ReactBits)

1. Go to https://github.com/settings/tokens
2. Create token with scopes: `repo`, `read:org`, `user`
3. Add to environment:
   ```bash
   # Windows (PowerShell)
   $env:GITHUB_TOKEN="your_token_here"
   
   # Windows (CMD)
   set GITHUB_TOKEN=your_token_here
   ```

### 21st.dev API Key

1. Go to https://21st.dev/magic
2. Generate API key
3. Run:
   ```bash
   npx @21st-dev/cli@latest install cursor --api-key YOUR_KEY
   ```

### Figma Token

1. Go to https://www.figma.com/developers/api
2. Create access token
3. Add to environment:
   ```bash
   $env:FIGMA_ACCESS_TOKEN="your_token_here"
   ```

---

## 📊 Installation Summary

```
✅ filesystem        - Secure file access
✅ context7          - Documentation lookup
✅ magicuidesign-mcp - 50+ animated components
✅ reactbits         - 135+ animated components
⏳ github            - Requires GITHUB_TOKEN
⏳ 21st-dev-magic    - Requires API key
⏳ figma             - Requires Figma token
⏳ appcontext        - macOS only, requires subscription
```

---

## 🛠️ Troubleshooting

### MCP Not Loading in Cursor
1. Restart Cursor completely
2. Check Settings → Features → MCP for errors
3. Verify `~/.cursor/mcp.json` syntax

### Rate Limit Errors (ReactBits)
Set `GITHUB_TOKEN` environment variable:
- Without token: 60 requests/hour
- With token: 5000 requests/hour

### Command Not Found
Ensure Node.js is installed and `npx` is in your PATH:
```bash
node --version
npx --version
```

### Servers Not Starting
Check if ports are available:
```bash
netstat -ano | findstr :7777
```

---

**Last Updated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
