/** Heuristic validate for Button/Card starter tasks (MCP validate lands in Phase 2). */

function countMatches(html, re) {
  return [...html.matchAll(re)].length;
}

export function validateMarkup(html, expect = {}) {
  const issues = [];
  const fixes = [];
  const hay = html || '';

  for (const cls of expect.classes || []) {
    if (!hay.includes(cls)) {
      issues.push(`missing class ${cls}`);
      fixes.push(`Add class="${cls}" to the appropriate element`);
    }
  }

  if (expect.dataEra) {
    const re = new RegExp(`data-era=["']${expect.dataEra}["']`);
    if (!re.test(hay)) {
      issues.push(`missing data-era="${expect.dataEra}"`);
      fixes.push(`Set data-era="${expect.dataEra}" on a wrapping element`);
    }
  }

  if (expect.dataMode) {
    const re = new RegExp(`data-mode=["']${expect.dataMode}["']`);
    if (!re.test(hay)) {
      issues.push(`missing data-mode="${expect.dataMode}"`);
      fixes.push(`Set data-mode="${expect.dataMode}"`);
    }
  }

  if (expect.dataFidelityBand) {
    const re = new RegExp(`data-fidelity-band=["']${expect.dataFidelityBand}["']`);
    if (!re.test(hay)) {
      issues.push(`missing data-fidelity-band="${expect.dataFidelityBand}"`);
      fixes.push(`Set data-fidelity-band="${expect.dataFidelityBand}" (or map fidelity to the band)`);
    }
  }

  if (expect.requireEras) {
    for (const era of expect.requireEras) {
      const re = new RegExp(`data-era=["']${era}["']`);
      if (!re.test(hay)) {
        issues.push(`missing hero era data-era="${era}"`);
        fixes.push(`Include a wrapper with data-era="${era}"`);
      }
    }
  }

  const buttons = countMatches(hay, /class=["'][^"']*\bew-button\b/g);
  const cards = countMatches(hay, /class=["'][^"']*\bew-card\b/g);
  if (expect.minButtons != null && buttons < expect.minButtons) {
    issues.push(`expected >= ${expect.minButtons} ew-button, found ${buttons}`);
    fixes.push(`Add ${expect.minButtons - buttons} more <button class="ew-button">`);
  }
  if (expect.minCards != null && cards < expect.minCards) {
    issues.push(`expected >= ${expect.minCards} ew-card, found ${cards}`);
    fixes.push(`Add ${expect.minCards - cards} more elements with class="ew-card"`);
  }

  for (const v of expect.requireVariants || []) {
    // variant may be on button or card
    const re = new RegExp(`data-variant=["']${v}["']`);
    if (!re.test(hay)) {
      issues.push(`missing data-variant="${v}"`);
      fixes.push(`Set data-variant="${v}" where required`);
    }
  }

  for (const bad of expect.forbid || []) {
    if (bad && hay.toLowerCase().includes(String(bad).toLowerCase())) {
      issues.push(`forbidden pattern: ${bad}`);
      fixes.push(`Remove "${bad}" (neverDo / out of contract)`);
    }
  }

  const pass = issues.length === 0;
  return {
    pass,
    score: pass ? 1 : Math.max(0, 1 - issues.length * 0.15),
    issues,
    fixes,
    counts: { buttons, cards },
  };
}
