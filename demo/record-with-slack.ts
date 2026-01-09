import 'dotenv/config';
import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';

const DASHBOARD_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:3000/api';
const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN!;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createSlackChannel(taskId: string): Promise<string | null> {
  const channelName = `task-backend-${taskId}`;

  const res = await fetch('https://slack.com/api/conversations.create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SLACK_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: channelName, is_private: false }),
  });

  const data = await res.json();
  if (!data.ok) {
    console.error('Failed to create channel:', data.error);
    return null;
  }

  return data.channel.id;
}

async function postToSlack(channelId: string, text: string) {
  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SLACK_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ channel: channelId, text }),
  });
}

async function recordDemo() {
  console.log('🎬 Recording demo with REAL Slack integration...\n');

  // Generate task ID
  const taskId = Math.random().toString(36).substring(2, 8);
  console.log(`Task ID: ${taskId}`);

  // Create real Slack channel first
  console.log('Creating Slack channel...');
  const channelId = await createSlackChannel(taskId);
  if (!channelId) {
    console.error('Failed to create channel, aborting');
    return;
  }
  console.log(`Channel created: ${channelId}\n`);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--window-size=1600,900', '--window-position=0,0']
  });

  // Open dashboard
  const dashboardPage = await browser.newPage();
  await dashboardPage.setViewport({ width: 1600, height: 900 });

  // Start recording
  const recorder = new PuppeteerScreenRecorder(dashboardPage, {
    followNewTab: true,
    fps: 30,
    videoFrame: { width: 1600, height: 900 },
  });

  const videoPath = './demo/demo-slack-real.mp4';
  await recorder.start(videoPath);
  console.log('📹 Recording started...');

  try {
    // Scene 1: Dashboard
    console.log('Scene 1: Dashboard');
    await dashboardPage.goto(DASHBOARD_URL, { waitUntil: 'networkidle0' });
    await sleep(2000);

    // Add title
    await dashboardPage.evaluate(() => {
      const title = document.createElement('div');
      title.innerHTML = `
        <div style="position:fixed;top:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:white;padding:12px 24px;border-radius:8px;font-family:-apple-system,sans-serif;font-size:18px;font-weight:600;z-index:10000;">
          🤖 AI Team Orchestrator - Live Demo
        </div>
      `;
      document.body.appendChild(title);
    });
    await sleep(2000);

    // Scene 2: Show terminal overlay - creating channel
    console.log('Scene 2: Creating Slack channel');
    await dashboardPage.evaluate((tid: string) => {
      const overlay = document.createElement('div');
      overlay.id = 'terminal';
      overlay.innerHTML = `
        <div style="position:fixed;bottom:20px;left:20px;background:#1e1e1e;border-radius:8px;padding:16px 20px;font-family:Monaco,monospace;font-size:14px;box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:10000;min-width:500px;">
          <div style="color:#888;margin-bottom:8px;">$ Running backend agent...</div>
          <div style="color:#4ade80;">✓ Agent started</div>
          <div style="color:#fbbf24;margin-top:4px;">[Slack] Creating channel #task-backend-${tid}</div>
        </div>
      `;
      document.body.appendChild(overlay);
    }, taskId);

    // Post first message to real Slack
    await postToSlack(channelId, `🤖 *Agent backend* is starting work on this task

*Task:* Build user authentication API
*Task ID:* \`${taskId}\`
*Status:* In Progress

---
Reply here to communicate with the agent.`);
    await sleep(1500);

    // Update terminal
    await dashboardPage.evaluate((cid: string) => {
      const terminal = document.getElementById('terminal');
      if (terminal) {
        terminal.innerHTML = `
          <div style="position:fixed;bottom:20px;left:20px;background:#1e1e1e;border-radius:8px;padding:16px 20px;font-family:Monaco,monospace;font-size:14px;box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:10000;min-width:500px;">
            <div style="color:#4ade80;">✓ Agent started</div>
            <div style="color:#4ade80;">✓ Slack channel created: ${cid}</div>
            <div style="color:#60a5fa;margin-top:8px;">[Agent] Analyzing requirements...</div>
          </div>
        `;
      }
    }, channelId);

    await postToSlack(channelId, '🔄 Analyzing requirements...');
    await sleep(1500);

    // Scene 3: Open Slack in iframe/embed or show channel URL
    console.log('Scene 3: Show Slack channel');

    // Add Slack panel simulation with real channel info
    await dashboardPage.evaluate((tid: string, cid: string) => {
      const slack = document.createElement('div');
      slack.innerHTML = `
        <div style="position:fixed;top:60px;right:20px;width:420px;background:#1a1d21;border-radius:8px;font-family:-apple-system,sans-serif;color:#fff;box-shadow:0 8px 32px rgba(0,0,0,0.4);z-index:10000;overflow:hidden;">
          <div style="background:#350d36;padding:12px 16px;display:flex;align-items:center;gap:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>
            <span style="font-weight:600;">#task-backend-${tid}</span>
            <span style="margin-left:auto;background:#2eb67d;padding:2px 8px;border-radius:4px;font-size:11px;">LIVE</span>
          </div>
          <div id="slack-msgs" style="padding:16px;min-height:300px;max-height:400px;overflow-y:auto;"></div>
          <div style="padding:12px 16px;border-top:1px solid #333;background:#222;">
            <div style="background:#333;border-radius:4px;padding:10px 12px;color:#888;font-size:14px;">Message #task-backend-${tid}</div>
          </div>
        </div>
      `;
      document.body.appendChild(slack);
    }, taskId, channelId);

    // Add messages to Slack panel one by one
    const addSlackMessage = async (user: string, text: string, isBot: boolean) => {
      await dashboardPage.evaluate((u: string, t: string, bot: boolean) => {
        const msgs = document.getElementById('slack-msgs');
        if (msgs) {
          const msg = document.createElement('div');
          msg.style.cssText = 'display:flex;margin-bottom:14px;';
          msg.innerHTML = `
            <div style="width:36px;height:36px;background:${bot ? '#4a154b' : '#2eb67d'};border-radius:4px;display:flex;align-items:center;justify-content:center;margin-right:10px;flex-shrink:0;">${bot ? '🤖' : '👤'}</div>
            <div>
              <div style="font-weight:600;color:${bot ? '#1d9bd1' : '#fff'};font-size:14px;">${u} <span style="color:#616061;font-weight:400;font-size:12px;">now</span></div>
              <div style="color:#d1d2d3;font-size:14px;margin-top:2px;white-space:pre-wrap;">${t}</div>
            </div>
          `;
          msgs.appendChild(msg);
          msgs.scrollTop = msgs.scrollHeight;
        }
      }, user, text, isBot);
    };

    // Show initial message
    await addSlackMessage('backend', '🤖 Starting work on: Build user auth API', true);
    await sleep(1000);

    // Progress messages
    await addSlackMessage('backend', '🔄 Analyzing requirements...', true);
    await postToSlack(channelId, '🔄 Implementing JWT authentication...');
    await sleep(1200);

    await addSlackMessage('backend', '🔄 Implementing JWT authentication...', true);
    await postToSlack(channelId, '🔄 Adding password hashing...');
    await sleep(1200);

    // User interaction
    await addSlackMessage('dean', 'Can you add rate limiting?', false);
    await sleep(1500);

    await addSlackMessage('backend', '✅ Added rate limiting: 100 req/min', true);
    await postToSlack(channelId, '✅ Added rate limiting: 100 req/min (as requested by @dean)');
    await sleep(1500);

    // Scene 4: Task completion
    console.log('Scene 4: Task completion');

    await addSlackMessage('backend', '✅ Task completed! PR ready for review.', true);
    await postToSlack(channelId, `✅ *Task Completed!*

*Summary:*
• Implemented JWT token generation
• Added password hashing with bcrypt
• Created user model with validation
• Added rate limiting (100 req/min)

*Files:* \`src/routes/auth.ts\`, \`src/models/user.ts\`, \`src/middleware/auth.ts\``);

    // Update terminal
    await dashboardPage.evaluate(() => {
      const terminal = document.getElementById('terminal');
      if (terminal) {
        terminal.innerHTML = `
          <div style="position:fixed;bottom:20px;left:20px;background:#1e1e1e;border-radius:8px;padding:16px 20px;font-family:Monaco,monospace;font-size:14px;box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:10000;min-width:500px;">
            <div style="color:#4ade80;">✓ Agent completed task</div>
            <div style="color:#4ade80;">✓ Slack channel updated</div>
            <div style="color:#60a5fa;margin-top:8px;">Duration: 45s</div>
          </div>
        `;
      }
    });

    // Add LIVE badge change to completed
    await dashboardPage.evaluate(() => {
      const badge = document.querySelector('[style*="background:#2eb67d"]');
      if (badge) {
        (badge as HTMLElement).textContent = '✓ DONE';
      }
    });

    await sleep(2500);

    // Scene 5: Self-improvement
    console.log('Scene 5: Self-improvement');
    await dashboardPage.evaluate(() => {
      // Remove slack panel
      const panels = document.querySelectorAll('[style*="position:fixed"]');
      panels.forEach(p => p.remove());

      const improve = document.createElement('div');
      improve.innerHTML = `
        <div style="position:fixed;bottom:20px;left:20px;right:20px;background:linear-gradient(135deg,#1e1e1e 0%,#2d2d2d 100%);border-radius:8px;padding:20px;font-family:Monaco,monospace;box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:10000;">
          <div style="color:#60a5fa;font-size:16px;margin-bottom:12px;">🧠 Self-Improvement System</div>
          <div style="color:#fbbf24;margin-bottom:6px;">[Registry] Pattern detected: 'auth-endpoint' used 3 times</div>
          <div style="color:#fbbf24;margin-bottom:6px;">[Registry] 💡 Creating reusable skill: 'jwt-auth-scaffold'</div>
          <div style="color:#4ade80;margin-top:10px;">✅ Skill saved! Future auth tasks will be 3x faster.</div>
        </div>
      `;
      document.body.appendChild(improve);
    });
    await sleep(3000);

    // Scene 6: CTA
    console.log('Scene 6: GitHub CTA');
    await dashboardPage.evaluate(() => {
      const overlays = document.querySelectorAll('[style*="position:fixed"]');
      overlays.forEach(o => o.remove());

      const cta = document.createElement('div');
      cta.innerHTML = `
        <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:10000;">
          <div style="background:linear-gradient(135deg,#1e1e1e 0%,#2d2d2d 100%);border-radius:16px;padding:48px 64px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.4);">
            <div style="font-size:64px;margin-bottom:20px;">🤖</div>
            <div style="font-size:28px;font-weight:700;color:#fff;margin-bottom:12px;font-family:-apple-system,sans-serif;">AI Team Orchestrator</div>
            <div style="font-size:18px;color:#60a5fa;margin-bottom:20px;font-family:-apple-system,sans-serif;">github.com/0xtechdean/ai-team-orchestrator</div>
            <div style="font-size:14px;color:#888;font-family:-apple-system,sans-serif;">MIT Licensed • TypeScript • Real Slack Integration</div>
          </div>
        </div>
      `;
      document.body.appendChild(cta);
    });
    await sleep(3000);

  } catch (error) {
    console.error('Error:', error);
  }

  await recorder.stop();
  console.log(`\n✅ Recording saved: ${videoPath}`);
  await browser.close();

  // Convert to GIF
  console.log('🎨 Converting to GIF...');
  const { execSync } = await import('child_process');
  try {
    execSync(`ffmpeg -y -i ${videoPath} -vf "fps=15,scale=900:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=256:stats_mode=single[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5" -loop 0 ./demo/demo.gif`, {
      stdio: 'inherit'
    });
    const { statSync } = await import('fs');
    const stats = statSync('./demo/demo.gif');
    console.log(`✅ GIF created: ./demo/demo.gif (${(stats.size / 1024).toFixed(0)}KB)`);
  } catch (e) {
    console.log('GIF conversion failed, MP4 available');
  }

  console.log(`\n📢 Real Slack channel created: #task-backend-${taskId}`);
}

recordDemo().catch(console.error);
