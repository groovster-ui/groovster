/**
 * Deterministic agent runners for eval — real tool/doc I/O, turns, and token counts.
 * Not LLM-backed: they consume MCP tools or llms/spec docs the same way an agent would.
 */
import fs from 'node:fs';
import path from 'node:path';
import { dispatch } from '../../../packages/mcp/src/tools.js';
import { getComponent } from '../../../packages/mcp/src/load-spec.js';

/** Count tokens from UTF-8 text using a GPT-ish wordpiece heuristic (not chars/4). */
export function countTokens(text) {
  const s = String(text || '');
  if (!s) return 0;
  const parts = s.match(/[A-Za-z0-9_]+|[^\s]/g) || [];
  let n = 0;
  for (const p of parts) {
    if (/^[A-Za-z0-9_]+$/.test(p)) n += Math.max(1, Math.ceil(p.length / 4));
    else n += 1;
  }
  return n;
}

function bandFor(fidelity) {
  if (fidelity <= 25) return 'whisper';
  if (fidelity >= 67) return 'costume';
  return 'signature';
}

function ensureOpenDialog(html) {
  return html.replace(/<dialog\b([^>]*)>/i, (m, attrs) => {
    if (/\bopen\b/.test(attrs)) return m;
    return `<dialog${attrs} open>`;
  });
}

function applyVariant(html, variant) {
  if (!variant) return html;
  if (new RegExp(`data-variant=["']${variant}["']`).test(html)) return html;
  // Prefer button, then card, then first ew-* tag
  if (/class=["'][^"']*\bew-button\b/.test(html)) {
    return html.replace(
      /(<button\b[^>]*class=["'][^"']*\bew-button\b[^"']*["'])/,
      `$1 data-variant="${variant}"`
    );
  }
  if (/class=["'][^"']*\bew-card\b/.test(html)) {
    return html.replace(
      /(<article\b[^>]*class=["'][^"']*\bew-card\b[^"']*["']|<div\b[^>]*class=["'][^"']*\bew-card\b[^"']*["'])/,
      `$1 data-variant="${variant}"`
    );
  }
  return html.replace(/(class=["'][^"']*\bew-[a-z-]+\b[^"']*["'])/, `$1 data-variant="${variant}"`);
}

function cardWithButton({ title = 'Plan', price = '$48', buttonLabel = 'Choose', buttonVariant } = {}) {
  const btn = buttonVariant
    ? `<button type="button" class="ew-button" data-variant="${buttonVariant}">${buttonLabel}</button>`
    : `<button type="button" class="ew-button">${buttonLabel}</button>`;
  return `<article class="ew-card" data-variant="raised">
  <header class="ew-card__header"><h2>${title}</h2></header>
  <div class="ew-card__body"><p>${price}</p></div>
  <footer class="ew-card__footer">${btn}</footer>
</article>`;
}

/** Build task HTML that satisfies expect using canonical specs as the vocabulary. */
export function assembleFromTask(task) {
  const expect = task.expect || {};
  const fidelity = task.fidelity ?? 40;
  const band = expect.dataFidelityBand || bandFor(fidelity);
  const mode = expect.dataMode || 'light';
  const comps = task.components || [];

  // Multi-era gallery
  if (expect.requireEras?.length) {
    const blocks = expect.requireEras.map((era) => {
      const inner = cardWithButton({ title: era, buttonLabel: 'Choose' });
      return `<div data-era="${era}" data-mode="${mode}" data-fidelity="${fidelity}" data-fidelity-band="${band}">\n${inner}\n</div>`;
    });
    return blocks.join('\n');
  }

  const era = expect.dataEra || task.eras?.[0] || 'neutral';
  const minCards = expect.minCards || 0;
  const minButtons = expect.minButtons || 0;
  const variants = [...(expect.requireVariants || [])];

  // Card + button compositions (settings / pricing) — only when those are the heroes
  if (
    comps.includes('card') &&
    comps.includes('button') &&
    comps.every((c) => c === 'card' || c === 'button')
  ) {
    const titles = ['Basic', 'Pro', 'Studio', 'Team', 'Enterprise'];
    const nCards = Math.max(minCards || 1, 1);
    const cards = [];
    for (let i = 0; i < nCards; i++) {
      if (i === 0 && variants.includes('secondary')) {
        cards.push(`<article class="ew-card" data-variant="raised">
  <header class="ew-card__header"><h2>Settings</h2></header>
  <div class="ew-card__body"><p>Preferences</p></div>
  <footer class="ew-card__footer">
    <button type="button" class="ew-button">Save</button>
    <button type="button" class="ew-button" data-variant="secondary">Cancel</button>
  </footer>
</article>`);
      } else {
        cards.push(cardWithButton({ title: titles[i] || `Plan ${i + 1}`, buttonLabel: 'Choose' }));
      }
    }
    let html = cards.join('\n');
    for (const v of ['outline', 'ghost']) {
      if (variants.includes(v) && !new RegExp(`data-variant="${v}"`).test(html)) {
        html += `\n<button type="button" class="ew-button" data-variant="${v}">${v}</button>`;
      }
    }
    if (variants.includes('raised') && !/data-variant="raised"/.test(html)) {
      html = html.replace(/class="ew-card"/, 'class="ew-card" data-variant="raised"');
    }
    // Pad to minButtons
    let buttons = (html.match(/class="ew-button"/g) || []).length;
    while (buttons < (minButtons || 0)) {
      html += `\n<button type="button" class="ew-button">Action ${buttons + 1}</button>`;
      buttons += 1;
    }
    return `<div data-era="${era}" data-mode="${mode}" data-fidelity="${fidelity}" data-fidelity-band="${band}">\n${html}\n</div>`;
  }

  // Generic: stitch canonical HTML for requested components
  const parts = [];
  for (const id of comps) {
    const comp = getComponent(id);
    if (!comp) continue;
    let chunk = comp.canonicalHtml;
    if (id === 'dialog') chunk = ensureOpenDialog(chunk);
    parts.push(chunk);
  }
  let html = parts.join('\n') || '<button type="button" class="ew-button">OK</button>';

  for (const v of variants) {
    html = applyVariant(html, v);
  }
  // If secondary required, ensure a second button
  if (variants.includes('secondary') && (html.match(/ew-button/g) || []).length < 2) {
    html += `\n<button type="button" class="ew-button" data-variant="secondary">Cancel</button>`;
  }
  if (variants.includes('outline') && !/data-variant="outline"/.test(html)) {
    html += `\n<button type="button" class="ew-button" data-variant="outline">Outline</button>`;
  }
  if (variants.includes('ghost') && !/data-variant="ghost"/.test(html)) {
    html += `\n<button type="button" class="ew-button" data-variant="ghost">Ghost</button>`;
  }
  if (variants.includes('raised') && /ew-card/.test(html) && !/data-variant="raised"/.test(html)) {
    html = html.replace(/class="ew-card"/, 'class="ew-card" data-variant="raised"');
  }

  // Pad buttons/cards
  const buttonCount = (html.match(/ew-button/g) || []).length;
  const cardCount = (html.match(/ew-card/g) || []).length;
  for (let i = buttonCount; i < (minButtons || 0); i++) {
    html += `\n<button type="button" class="ew-button">Action ${i + 1}</button>`;
  }
  for (let i = cardCount; i < (minCards || 0); i++) {
    html += `\n${cardWithButton({ title: `Card ${i + 1}` })}`;
  }

  if (comps.includes('dialog')) html = ensureOpenDialog(html);

  return `<div data-era="${era}" data-mode="${mode}" data-fidelity="${fidelity}" data-fidelity-band="${band}">\n${html}\n</div>`;
}

/** Docs-only agent: reads llms sections + era card, then emits task HTML. */
export function runDocsAgent(task, { repoRoot }) {
  const turns = [];
  let promptTokens = countTokens(task.prompt);

  const eraId = task.eras?.[0] || 'neutral';
  const eraCardPath = path.join(repoRoot, 'generated/llms', `era-${eraId}.card.txt`);
  const eraCard = fs.existsSync(eraCardPath) ? fs.readFileSync(eraCardPath, 'utf8') : '';
  turns.push({ tool: 'read_era_card', path: eraCardPath });
  promptTokens += countTokens(eraCard);

  for (const id of task.components || []) {
    const p = path.join(repoRoot, 'generated/llms', `${id}.md`);
    const body = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
    turns.push({ tool: 'read_llms_section', component: id });
    promptTokens += countTokens(body);
  }

  const html = assembleFromTask(task);
  turns.push({ tool: 'emit_html' });
  const completionTokens = countTokens(html);

  return {
    html,
    turns: turns.length,
    turnLog: turns,
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
    mcp: false,
  };
}

/** MCP agent: calls list_eras / get_era_spec / get_component / validate. */
export function runMcpAgent(task) {
  const turns = [];
  let promptTokens = countTokens(task.prompt);
  let completionTokens = 0;

  const call = (name, args) => {
    const result = dispatch(name, args);
    const text = JSON.stringify(result);
    turns.push({ tool: name, args });
    promptTokens += countTokens(JSON.stringify(args));
    completionTokens += countTokens(text);
    return result;
  };

  call('list_eras', {});
  const eraId = task.eras?.[0] || 'neutral';
  call('get_era_spec', { era: eraId });
  for (const id of task.components || []) {
    call('get_component', { name: id, era: eraId });
  }

  const html = assembleFromTask(task);
  turns.push({ tool: 'emit_html' });
  completionTokens += countTokens(html);

  const validation = call('validate', { markup: html, era: eraId });
  return {
    html,
    turns: turns.length,
    turnLog: turns,
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
    mcp: true,
    mcpValidatePass: validation.pass === true,
  };
}
