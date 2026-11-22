import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

async function screenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const htmlPath = `file://${join(repoRoot, 'demos/showcase/deco.html')}`;
  
  const states = [
    { mode: 'dark', fidelity: 'costume', name: 'deco-costume-dark' },
    { mode: 'light', fidelity: 'costume', name: 'deco-costume-light' },
    { mode: 'dark', fidelity: 'whisper', name: 'deco-whisper-dark' },
    { mode: 'light', fidelity: 'whisper', name: 'deco-whisper-light' },
  ];
  
  for (const state of states) {
    console.log(`📸 Capturing ${state.name}...`);
    
    await page.goto(htmlPath);
    
    // Set mode and fidelity
    await page.evaluate(({ mode, fidelity }) => {
      document.documentElement.setAttribute('data-mode', mode);
      document.documentElement.setAttribute('data-fidelity-band', fidelity);
    }, state);
    
    // Wait for fonts and rendering
    await page.waitForTimeout(500);
    
    // Full page screenshot
    await page.screenshot({
      path: join(repoRoot, `demos/showcase/shots/${state.name}.png`),
      fullPage: true,
    });
    
    console.log(`✅ Saved ${state.name}.png`);
  }
  
  await browser.close();
  console.log('\n✨ All screenshots captured!');
}

screenshot().catch(console.error);
