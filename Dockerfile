# Agentic - Multi-Agent Orchestration Platform
# Includes Claude CLI for autonomous agent execution

FROM node:20-slim

# Install dependencies for Claude CLI
RUN apt-get update && apt-get install -y \
    git \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Claude CLI globally
# Note: Claude CLI requires ANTHROPIC_API_KEY env var for authentication
RUN npm install -g @anthropic-ai/claude-code

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built files
COPY dist ./dist
COPY public ./public

# Copy agent definitions
COPY .claude ./.claude

# Create a directory for Claude CLI config
RUN mkdir -p /root/.claude

# Set environment variables
ENV NODE_ENV=production
ENV CI=true

# Claude CLI authentication:
# 1. Run 'claude setup-token' locally to get a long-lived token
# 2. Set CLAUDE_AUTH_TOKEN on Railway: railway variables set CLAUDE_AUTH_TOKEN=<token>
# 3. Also set USE_CLAUDE_CODE=true to enable CLI mode

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/index.js"]
