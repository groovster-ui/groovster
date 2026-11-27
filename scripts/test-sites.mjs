import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checks = ['scripts/recipes-browser.mjs', 'scripts/apps-dense-browser.mjs'];

const results = [];
for (const script of checks) {
  const code = await new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(root, script)], { cwd: root, stdio: 'inherit' });
    child.on('exit', (status) => resolve(status ?? 1));
  });
  results.push({ script, code });
  console.error(code === 0 ? `${script} passed` : `${script} failed (${code})`);
}

const failed = results.filter((item) => item.code !== 0);
if (failed.length) {
  console.error(`${failed.length} of ${results.length} site check(s) failed`);
  process.exit(1);
}
console.log('site checks passed');
