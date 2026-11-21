/** Flatten DTCG-ish token trees into CSS custom properties. */

function isToken(node) {
  return node && typeof node === 'object' && '$type' in node && '$value' in node;
}

function cssValue(type, value) {
  if (type === 'fontFamily' && Array.isArray(value)) {
    return value.map((v) => (String(v).includes(' ') ? `"${v}"` : v)).join(', ');
  }
  if (type === 'shadow' && Array.isArray(value)) {
    return value
      .map((s) => `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread || '0px'} ${s.color}`)
      .join(', ');
  }
  if (typeof value === 'number') return String(value);
  return String(value);
}

export function flattenTokens(obj, prefix = []) {
  const out = [];
  if (!obj || typeof obj !== 'object') return out;
  for (const [key, value] of Object.entries(obj)) {
    if (key === '$schema' || key === 'meta' || key.startsWith('$')) continue;
    if (isToken(value)) {
      const name = ['ew', ...prefix, key].join('-');
      out.push(`  --${name}: ${cssValue(value.$type, value.$value)};`);
    } else if (value && typeof value === 'object') {
      out.push(...flattenTokens(value, [...prefix, key]));
    }
  }
  return out;
}
