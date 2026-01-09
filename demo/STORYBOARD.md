# AI Team Orchestrator - Video Storyboard

## Video Details
- **Duration**: 60-90 seconds
- **Format**: Screen recording + optional AI voiceover
- **Style**: Fast-paced, developer-focused

---

## Scene 1: Hook (0-5s)
**Visual**: Text animation
**Text**: "What if AI agents could hire other AI agents?"

---

## Scene 2: Problem (5-15s)
**Visual**: Split screen showing chaos
**Narration**:
"Managing AI agents is messy. They don't communicate. They don't learn from each other. And when you need a new capability, you have to build it yourself."

---

## Scene 3: Solution (15-25s)
**Visual**: Show the repo/dashboard
**Narration**:
"Introducing AI Team Orchestrator - a self-improving multi-agent system."

---

## Scene 4: Feature 1 - Agent Collaboration (25-35s)
**Visual**: Terminal showing agent running
```
[Orchestrator] Running backend agent...
[Slack] Created channel: #task-backend-a1b2c3
[Agent] Analyzing task...
[Agent] Completed: Implement user auth API
```
**Narration**: "Agents work together on tasks, with dedicated Slack channels for real-time communication."

---

## Scene 5: Feature 2 - Self-Improvement (35-45s)
**Visual**: Show pattern detection
```
[Registry] Pattern detected: 'implement-endpoint' (3x)
[Registry] Creating skill: 'api-endpoint-scaffold'
```
**Narration**: "The system learns. When it spots patterns, it creates reusable skills automatically."

---

## Scene 6: Feature 3 - Agent Creation (45-55s)
**Visual**: Show manager agent creating new agent
```
[PM Agent] Capability gap detected: No security specialist
[Registry] New agent created: 'security' (specialist)
```
**Narration**: "Manager agents can even create new specialist agents when they spot capability gaps."

---

## Scene 7: Architecture (55-65s)
**Visual**: Show architecture diagram
```
┌─────────────────────────────────────────┐
│   Managers → Specialists → Support      │
│        ↓           ↓           ↓        │
│   Orchestrator + Mem0 + Redis + Slack   │
└─────────────────────────────────────────┘
```
**Narration**: "Built with Claude API, Mem0 for shared memory, Redis for persistence, and Slack for communication."

---

## Scene 8: CTA (65-75s)
**Visual**: GitHub repo page
**Text on screen**:
```
github.com/0xtechdean/ai-team-orchestrator

MIT Licensed | TypeScript | Ready to Deploy
```
**Narration**: "Open source. MIT licensed. Try it today."

---

## Recording Options

### Option A: Terminal Recording
```bash
# Install asciinema
brew install asciinema

# Record the demo
asciinema rec demo.cast

# Run the demo script
./demo-script.sh

# Convert to GIF
docker run --rm -v $PWD:/data asciinema/asciicast2gif demo.cast demo.gif
```

### Option B: Screen.studio (Recommended for Mac)
1. Download Screen.studio
2. Record dashboard + terminal side by side
3. Add zoom effects on key moments
4. Export as MP4

### Option C: AI Video (HeyGen/Synthesia)
1. Use this storyboard as script
2. Generate AI presenter
3. Add screen recordings as B-roll
4. Combine in video editor

---

## Key Shots to Capture

| Shot | Description | Duration |
|------|-------------|----------|
| Dashboard | Kanban board with tasks | 5s |
| Terminal | Agent running | 10s |
| Slack | Channel with agent messages | 5s |
| Code | Agent definition markdown | 5s |
| API | curl commands working | 5s |

---

## Music/Sound
- Lo-fi beats or tech ambient
- Keyboard typing sounds on terminal shots
- Subtle "success" sound on completions
