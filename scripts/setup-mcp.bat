@echo off
REM MCP Setup Script for AI Design System (Windows)
REM Run this script to install and configure all MCP servers

echo.
echo ============================================
echo   Setting up MCP servers for AI Design System
echo ============================================
echo.

REM Check for Node.js
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js 20+
    exit /b 1
)
echo OK: Node.js found
echo.

REM Create project MCP config
echo Creating project MCP configuration...
if not exist ".vscode" mkdir .vscode

(
echo {
echo   "$schema": "https://json.schemastore.org/mcp-config.json",
echo   "mcpServers": {
echo     "filesystem": {
echo       "command": "npx",
echo       "args": ["-y", "@modelcontextprotocol/server-filesystem@latest", "--allowed-dirs", "."]
echo     },
echo     "context7": {
echo       "command": "npx",
echo       "args": ["-y", "@context7/mcp@latest"]
echo     },
echo     "magicuidesign-mcp": {
echo       "command": "npx",
echo       "args": ["-y", "@magicuidesign/mcp@latest"]
echo     },
echo     "reactbits": {
echo       "command": "npx",
echo       "args": ["-y", "reactbits-dev-mcp-server"]
echo     }
echo   }
echo }
) > .vscode\mcp.json

echo OK: Project MCP configuration created at .vscode\mcp.json
echo.

REM Install MCP servers
echo Installing MCP servers...
echo.

echo   --^> Filesystem MCP...
start /B npx -y @modelcontextprotocol/server-filesystem@latest --allowed-dirs .

echo   --^> Context7 MCP...
start /B npx -y @context7/mcp@latest

echo   --^> Magic UI MCP...
start /B npx -y @magicuidesign/mcp@latest

echo   --^> ReactBits MCP...
start /B npx -y reactbits-dev-mcp-server

timeout /t 5 /nobreak >nul

echo.
echo ============================================
echo   All MCP servers installed successfully!
echo ============================================
echo.
echo Next steps:
echo   1. Set GITHUB_TOKEN for GitHub MCP and higher ReactBits rate limits
echo   2. Set 21ST_DEV_API_KEY for 21st.dev Magic MCP ^(optional^)
echo   3. Restart Cursor/VSCode to load MCP servers
echo.
echo To add GitHub MCP, run:
echo   npx -y @modelcontextprotocol/server-github@latest
echo.
echo To add 21st.dev Magic MCP, run:
echo   npx @21st-dev/cli@latest install cursor --api-key YOUR_KEY
echo.
pause
