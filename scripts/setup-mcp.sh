#!/bin/bash
# MCP Setup Script for AI Design System
# Run this script to install and configure all MCP servers

echo "🚀 Setting up MCP servers for AI Design System..."
echo ""

# Check for Node.js
echo "📦 Checking Node.js..."
node --version || { echo "❌ Node.js not found. Please install Node.js 20+"; exit 1; }
echo "✅ Node.js found"
echo ""

# Create project MCP config
echo "📝 Creating project MCP configuration..."
mkdir -p .vscode
cat > .vscode/mcp.json << 'EOF'
{
  "$schema": "https://json.schemastore.org/mcp-config.json",
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
EOF
echo "✅ Project MCP configuration created at .vscode/mcp.json"
echo ""

# Install MCP servers
echo "📦 Installing MCP servers..."
echo ""

echo "  → Filesystem MCP..."
npx -y @modelcontextprotocol/server-filesystem@latest --allowed-dirs . &

echo "  → Context7 MCP..."
npx -y @context7/mcp@latest &

echo "  → Magic UI MCP..."
npx -y @magicuidesign/mcp@latest &

echo "  → ReactBits MCP..."
npx -y reactbits-dev-mcp-server &

wait

echo ""
echo "✅ All MCP servers installed successfully!"
echo ""
echo "📌 Next steps:"
echo "   1. Set GITHUB_TOKEN for GitHub MCP and higher ReactBits rate limits"
echo "   2. Set 21ST_DEV_API_KEY for 21st.dev Magic MCP (optional)"
echo "   3. Restart Cursor/VSCode to load MCP servers"
echo ""
echo "🔧 To add GitHub MCP, run:"
echo "   npx -y @modelcontextprotocol/server-github@latest"
echo ""
echo "🔧 To add 21st.dev Magic MCP, run:"
echo "   npx @21st-dev/cli@latest install cursor --api-key YOUR_KEY"
echo ""
