#!/bin/bash
# AI Team Orchestrator Demo Script
# Record with: asciinema rec demo.cast
# Or use: terminalizer record demo

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          AI Team Orchestrator - Demo                     ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
sleep 2

# Step 1: Clone
echo -e "${YELLOW}Step 1: Clone the repository${NC}"
echo -e "${GREEN}$ git clone https://github.com/0xtechdean/ai-team-orchestrator.git${NC}"
sleep 1
echo "Cloning into 'ai-team-orchestrator'..."
sleep 1
echo "done."
echo ""
sleep 2

# Step 2: Install
echo -e "${YELLOW}Step 2: Install dependencies${NC}"
echo -e "${GREEN}$ cd ai-team-orchestrator && npm install${NC}"
sleep 1
echo "Installing dependencies..."
sleep 2
echo "added 156 packages in 4s"
echo ""
sleep 2

# Step 3: Configure
echo -e "${YELLOW}Step 3: Configure environment${NC}"
echo -e "${GREEN}$ cp .env.example .env${NC}"
sleep 1
echo -e "${GREEN}$ cat .env${NC}"
sleep 1
cat << 'EOF'
ANTHROPIC_API_KEY=sk-ant-...
MEM0_API_KEY=m0-...
SLACK_BOT_TOKEN=xoxb-...
SLACK_CHANNEL_ID=C0123456789
EOF
echo ""
sleep 2

# Step 4: Start server
echo -e "${YELLOW}Step 4: Start the server${NC}"
echo -e "${GREEN}$ npm start${NC}"
sleep 1
cat << 'EOF'
╔══════════════════════════════════════════════════════╗
║           AI Team Orchestrator                       ║
║                                                      ║
║   Server running on http://localhost:3000            ║
║   Dashboard: http://localhost:3000                   ║
╚══════════════════════════════════════════════════════╝
EOF
echo ""
sleep 3

# Step 5: Show agents
echo -e "${YELLOW}Step 5: List available agents${NC}"
echo -e "${GREEN}$ curl localhost:3000/api/agents | jq${NC}"
sleep 1
cat << 'EOF'
[
  {
    "id": "pm",
    "name": "pm",
    "role": "manager",
    "description": "Product Manager - coordinates team"
  },
  {
    "id": "backend",
    "name": "backend",
    "role": "specialist",
    "description": "Backend Engineer - APIs and databases"
  },
  {
    "id": "frontend",
    "name": "frontend",
    "role": "specialist",
    "description": "Frontend Engineer - UI components"
  }
]
EOF
echo ""
sleep 3

# Step 6: Create task
echo -e "${YELLOW}Step 6: Create a task${NC}"
echo -e "${GREEN}$ curl -X POST localhost:3000/api/projects/default/tasks \\${NC}"
echo -e "${GREEN}    -H 'Content-Type: application/json' \\${NC}"
echo -e "${GREEN}    -d '{\"title\": \"Implement user auth API\", \"owner\": \"backend\", \"priority\": \"P1\"}'${NC}"
sleep 1
cat << 'EOF'
{
  "id": "a1b2c3d4",
  "title": "Implement user auth API",
  "status": "backlog",
  "owner": "backend",
  "priority": "P1"
}
EOF
echo ""
sleep 3

# Step 7: Run agent
echo -e "${YELLOW}Step 7: Run an agent on the task${NC}"
echo -e "${GREEN}$ curl -X POST localhost:3000/api/run-agent \\${NC}"
echo -e "${GREEN}    -H 'Content-Type: application/json' \\${NC}"
echo -e "${GREEN}    -d '{\"agentName\": \"backend\", \"task\": \"Implement user auth API\"}'${NC}"
sleep 1
echo ""
echo -e "${BLUE}[Orchestrator] Running backend agent...${NC}"
sleep 1
echo -e "${BLUE}[Slack] Created channel: #task-backend-a1b2c3d4${NC}"
sleep 1
echo -e "${BLUE}[Orchestrator] Agent analyzing task...${NC}"
sleep 2
echo -e "${BLUE}[Orchestrator] Agent executing...${NC}"
sleep 2
cat << 'EOF'

## Task Completed

### Actions Taken
1. Created auth routes in /src/routes/auth.ts
2. Implemented JWT token generation
3. Added password hashing with bcrypt
4. Created user model with validation

### Files Modified
- src/routes/auth.ts (new)
- src/models/user.ts (new)
- src/middleware/auth.ts (new)

### Learnings
- Used bcrypt for password hashing
- JWT tokens expire in 24h
- Added rate limiting to prevent brute force

EOF
sleep 3

# Step 8: Slack notification
echo -e "${YELLOW}Step 8: Slack channel updated${NC}"
echo ""
cat << 'EOF'
┌─────────────────────────────────────────────────────────┐
│  #task-backend-a1b2c3d4                                 │
├─────────────────────────────────────────────────────────┤
│  🤖 Agent backend is starting work on this task        │
│                                                         │
│  Task: Implement user auth API                         │
│  Status: In Progress                                    │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ✅ Task Completed                                      │
│  Duration: 45s                                          │
│  Status: Success                                        │
│                                                         │
│  Learnings:                                            │
│  • Used bcrypt for password hashing                    │
│  • JWT tokens expire in 24h                            │
└─────────────────────────────────────────────────────────┘
EOF
echo ""
sleep 3

# Step 9: Self-improvement
echo -e "${YELLOW}Step 9: Self-Improvement in Action${NC}"
echo ""
echo -e "${BLUE}[Registry] Pattern detected: 'implement-endpoint' (3 occurrences)${NC}"
sleep 1
echo -e "${BLUE}[Registry] Suggesting skill creation: 'api-endpoint-scaffold'${NC}"
sleep 1
echo ""
cat << 'EOF'
## New Skill Created

Name: api-endpoint-scaffold
Description: Scaffolds a new API endpoint with auth middleware
Created by: backend agent
Pattern: implement-endpoint

This skill will be reused for future endpoint tasks.
EOF
echo ""
sleep 3

# Final
echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    Demo Complete!                        ║${NC}"
echo -e "${BLUE}╠══════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║  Try it: github.com/0xtechdean/ai-team-orchestrator      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
