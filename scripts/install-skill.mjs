import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SKILL_SOURCE = path.join(root, "skills/groovster");

export const PLATFORM_DIRS = {
  cursor: ".cursor/skills/groovster",
  claude: ".claude/skills/groovster",
  codex: ".agents/skills/groovster",
};

export function installSkill(destRoot, platforms = ["cursor", "claude", "codex"]) {
  const sourceReal = fs.realpathSync(SKILL_SOURCE);
  const installed = [];
  for (const name of platforms) {
    const rel = PLATFORM_DIRS[name];
    if (!rel) throw new Error(`Unknown platform ${name}`);
    const dest = path.join(destRoot, rel);
    if (fs.existsSync(dest) && fs.realpathSync(dest) === sourceReal) {
      installed.push({ platform: name, dest, skipped: true });
      continue;
    }
    fs.rmSync(dest, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.cpSync(SKILL_SOURCE, dest, { recursive: true });
    installed.push({ platform: name, dest, skipped: false });
  }
  return installed;
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  const args = process.argv.slice(2).filter((arg) => arg !== "--all");
  const platforms = args.length ? args : ["cursor", "claude", "codex"];
  for (const item of installSkill(process.cwd(), platforms)) {
    console.log(item.skipped ? `already linked ${item.platform}` : `copied ${item.platform} -> ${item.dest}`);
  }
}
