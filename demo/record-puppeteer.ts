import puppeteer, { Browser, Page } from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';

const DASHBOARD_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:3000/api';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createTestData() {
  // Create project
  try {
    await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Demo Project', description: 'Demo project for recording' })
    });
  } catch (e) {}

  // Create tasks in different statuses
  const tasks = [
    { title: 'Design system architecture', owner: 'engineering', priority: 'P1', status: 'done' },
    { title: 'Build user authentication API', owner: 'engineering', priority: 'P1', status: 'in_progress' },
    { title: 'Create marketing landing page', owner: 'marketing', priority: 'P2', status: 'ready' },
    { title: 'Set up analytics tracking', owner: 'data', priority: 'P2', status: 'ready' },
    { title: 'Write API documentation', owner: 'pm', priority: 'P3', status: 'backlog' },
    { title: 'Research competitor features', owner: 'researcher', priority: 'P2', status: 'backlog' },
  ];

  for (const task of tasks) {
    try {
      await fetch(`${API_URL}/projects/default/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
    } catch (e) {}
  }
}

async function recordDemo() {
  console.log('🎬 Starting demo recording...');

  // Create test data first
  await createTestData();

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--window-size=1280,800',
      '--window-position=0,0'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Start recording
  const recorder = new PuppeteerScreenRecorder(page, {
    followNewTab: true,
    fps: 30,
    videoFrame: { width: 1280, height: 800 },
  });

  const videoPath = './demo/demo-new.mp4';
  await recorder.start(videoPath);
  console.log('📹 Recording started...');

  try {
    // Scene 1: Kanban Dashboard
    console.log('Scene 1: Kanban Dashboard');
    await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle0' });
    await sleep(2000);

    // Add title overlay
    await page.evaluate(() => {
      const title = document.createElement('div');
      title.id = 'demo-title';
      title.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #2563eb;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-family: -apple-system, sans-serif;
          font-size: 18px;
          font-weight: 600;
          z-index: 10000;
          box-shadow: 0 4px 12px rgba(37,99,235,0.3);
        ">
          Agentic - Multi-Agent Task Board
        </div>
      `;
      document.body.appendChild(title);
    });
    await sleep(2500);
    await page.evaluate(() => document.getElementById('demo-title')?.remove());

    // Scene 2: Move task to Ready -> Agent picks it up
    console.log('Scene 2: Agent picks up task');

    // Find a ready task and simulate agent picking it up
    const tasksRes = await fetch(`${API_URL}/projects/default/tasks`);
    const tasks = await tasksRes.json();
    const readyTask = tasks.find((t: any) => t.status === 'ready');

    if (readyTask) {
      // Show action overlay
      await page.evaluate(() => {
        const overlay = document.createElement('div');
        overlay.id = 'action-overlay';
        overlay.innerHTML = `
          <div style="
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: #1e293b;
            border-radius: 8px;
            padding: 16px 20px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 13px;
            color: #22c55e;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
          ">
            <div style="color: #94a3b8; margin-bottom: 8px;">$ Agent picking up task...</div>
            <div style="color: #3b82f6;">POST /api/run-agent {"agent": "marketing"}</div>
          </div>
        `;
        document.body.appendChild(overlay);
      });
      await sleep(1500);

      // Move task to in_progress
      await fetch(`${API_URL}/tasks/${readyTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in_progress' })
      });

      await page.reload({ waitUntil: 'networkidle0' });

      await page.evaluate(() => {
        const overlay = document.getElementById('action-overlay');
        if (overlay) {
          overlay.innerHTML = `
            <div style="
              position: fixed;
              bottom: 20px;
              left: 20px;
              background: #1e293b;
              border-radius: 8px;
              padding: 16px 20px;
              font-family: 'Monaco', 'Menlo', monospace;
              font-size: 13px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.2);
              z-index: 10000;
            ">
              <div style="color: #22c55e;">✓ Agent started</div>
              <div style="color: #fbbf24; margin-top: 4px;">[Slack] Channel created: #task-marketing</div>
              <div style="color: #fbbf24;">[Agent] Working on task...</div>
            </div>
          `;
        }
      });
      await sleep(2500);
    }

    // Scene 3: Show Slack conversation simulation
    console.log('Scene 3: Slack conversation');
    await page.evaluate(() => {
      document.getElementById('action-overlay')?.remove();

      const slack = document.createElement('div');
      slack.id = 'slack-panel';
      slack.innerHTML = `
        <div style="
          position: fixed;
          top: 80px;
          right: 20px;
          width: 340px;
          background: #1a1d21;
          border-radius: 8px;
          font-family: -apple-system, sans-serif;
          color: #fff;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          z-index: 10000;
          overflow: hidden;
        ">
          <div style="background: #350d36; padding: 10px 14px; display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 600; font-size: 14px;"># task-marketing</span>
          </div>
          <div id="slack-messages" style="padding: 12px; min-height: 200px;"></div>
        </div>
      `;
      document.body.appendChild(slack);
    });
    await sleep(500);

    // Animate messages
    const messages = [
      { user: 'marketing', isBot: true, text: '🤖 Starting: Create marketing landing page', delay: 800 },
      { user: 'marketing', isBot: true, text: 'Analyzing brand guidelines...', delay: 1000 },
      { user: 'dean', isBot: false, text: 'Add a pricing section', delay: 1200 },
      { user: 'marketing', isBot: true, text: '✅ Added pricing with 3 tiers', delay: 1000 },
      { user: 'marketing', isBot: true, text: '✅ Task completed!', delay: 800 },
    ];

    for (const msg of messages) {
      await page.evaluate((m) => {
        const container = document.getElementById('slack-messages');
        if (!container) return;
        const msgEl = document.createElement('div');
        msgEl.style.cssText = 'display: flex; margin-bottom: 12px;';
        msgEl.innerHTML = `
          <div style="
            width: 32px; height: 32px;
            background: ${m.isBot ? '#4a154b' : '#2eb67d'};
            border-radius: 4px;
            display: flex; align-items: center; justify-content: center;
            margin-right: 8px; flex-shrink: 0; font-size: 14px;
          ">${m.isBot ? '🤖' : '👤'}</div>
          <div>
            <div style="font-weight: 600; color: ${m.isBot ? '#1d9bd1' : '#fff'}; font-size: 13px;">
              ${m.user} <span style="color: #616061; font-weight: 400; font-size: 11px;">now</span>
            </div>
            <div style="color: #d1d2d3; font-size: 13px; margin-top: 2px;">${m.text}</div>
          </div>
        `;
        container.appendChild(msgEl);
      }, msg);
      await sleep(msg.delay);
    }
    await sleep(1000);

    // Move task to done
    if (readyTask) {
      await fetch(`${API_URL}/tasks/${readyTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'done' })
      });
    }

    await page.evaluate(() => document.getElementById('slack-panel')?.remove());
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(1500);

    // Scene 4: Click on GANTT view
    console.log('Scene 4: Gantt Chart');
    await page.evaluate(() => {
      const title = document.createElement('div');
      title.id = 'demo-title';
      title.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #2563eb;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-family: -apple-system, sans-serif;
          font-size: 16px;
          font-weight: 600;
          z-index: 10000;
        ">
          Gantt Chart Timeline
        </div>
      `;
      document.body.appendChild(title);
    });

    // Click on GANTT button
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        if (btn.textContent?.includes('GANTT')) btn.click();
      });
    });
    await sleep(3000);
    await page.evaluate(() => document.getElementById('demo-title')?.remove());

    // Scene 5: Click on TRACES view
    console.log('Scene 5: Activity Traces');
    await page.evaluate(() => {
      const title = document.createElement('div');
      title.id = 'demo-title';
      title.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #2563eb;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-family: -apple-system, sans-serif;
          font-size: 16px;
          font-weight: 600;
          z-index: 10000;
        ">
          Activity Traces by Task
        </div>
      `;
      document.body.appendChild(title);
    });

    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        if (btn.textContent?.includes('TRACES')) btn.click();
      });
    });
    await sleep(3000);
    await page.evaluate(() => document.getElementById('demo-title')?.remove());

    // Scene 6: Back to Tasks, show agent management
    console.log('Scene 6: Agent Management');
    await page.evaluate(() => {
      // Click logo to go back to tasks
      const logo = document.querySelector('.logo');
      if (logo) (logo as HTMLElement).click();
    });
    await sleep(1000);

    await page.evaluate(() => {
      const title = document.createElement('div');
      title.id = 'demo-title';
      title.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #2563eb;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-family: -apple-system, sans-serif;
          font-size: 16px;
          font-weight: 600;
          z-index: 10000;
        ">
          Agent Management - Edit & Delete
        </div>
      `;
      document.body.appendChild(title);
    });

    // Click AGENTS button
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        if (btn.textContent?.includes('AGENTS')) btn.click();
      });
    });
    await sleep(2500);
    await page.evaluate(() => document.getElementById('demo-title')?.remove());

    // Scene 7: Final CTA
    console.log('Scene 7: GitHub CTA');
    await page.evaluate(() => {
      const cta = document.createElement('div');
      cta.innerHTML = `
        <div style="
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        ">
          <div style="
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border-radius: 16px;
            padding: 48px 64px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          ">
            <div style="font-size: 56px; margin-bottom: 16px;">🤖</div>
            <div style="font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 8px; font-family: -apple-system, sans-serif;">
              Agentic
            </div>
            <div style="font-size: 16px; color: #94a3b8; margin-bottom: 16px; font-family: -apple-system, sans-serif;">
              Self-improving multi-agent orchestration
            </div>
            <div style="font-size: 18px; color: #3b82f6; margin-bottom: 16px; font-family: -apple-system, sans-serif;">
              github.com/0xtechdean/agentic
            </div>
            <div style="font-size: 13px; color: #64748b; font-family: -apple-system, sans-serif;">
              MIT Licensed • TypeScript • Claude AI
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(cta);
    });
    await sleep(3000);

  } catch (error) {
    console.error('Error during recording:', error);
  }

  // Stop recording
  await recorder.stop();
  console.log(`✅ Recording saved to: ${videoPath}`);

  await browser.close();

  // Convert to GIF
  console.log('🎨 Converting to GIF...');
  const { execSync } = await import('child_process');
  try {
    execSync(`ffmpeg -y -i ${videoPath} -vf "fps=12,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128:stats_mode=single[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" -loop 0 ./demo/demo.gif`, {
      stdio: 'inherit'
    });
    console.log('✅ GIF created: ./demo/demo.gif');

    const { statSync } = await import('fs');
    const stats = statSync('./demo/demo.gif');
    console.log(`📦 GIF size: ${(stats.size / 1024 / 1024).toFixed(2)}MB`);
  } catch (e) {
    console.log('⚠️ GIF conversion failed, MP4 available at:', videoPath);
  }
}

recordDemo().catch(console.error);
