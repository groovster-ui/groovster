/** Flatten DTCG-ish token trees into CSS custom properties. */

function isToken(node) {
  return node && typeof node === 'object' && '$type' in node && '$value' in node;
}

function resolveTokenValue(value, type, resolvedTokens) {
  if (typeof value !== 'string') return value;
  
  const refRegex = /\{([^}]+)\}/g;
  let resolved = value;
  let match;
  
  while ((match = refRegex.exec(value)) !== null) {
    const refPath = match[1];
    const varName = '--ew-' + refPath.replace(/\./g, '-');
    
    if (resolvedTokens.has(varName)) {
      resolved = resolved.replace(match[0], `var(${varName})`);
    } else {
      resolved = resolved.replace(match[0], `var(${varName})`);
    }
  }
  
  return resolved;
}

function cssValue(type, value, resolvedTokens = new Set()) {
  const resolved = resolveTokenValue(value, type, resolvedTokens);
  
  if (type === 'fontFamily' && Array.isArray(resolved)) {
    return resolved.map((v) => (String(v).includes(' ') ? `"${v}"` : v)).join(', ');
  }
  if (type === 'shadow' && Array.isArray(resolved)) {
    return resolved
      .map((s) => {
        const color = resolveTokenValue(s.color, 'color', resolvedTokens);
        return `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread || '0px'} ${color}`;
      })
      .join(', ');
  }
  if (typeof resolved === 'number') return String(resolved);
  return String(resolved);
}

export function flattenTokens(obj, prefix = [], resolvedTokens = new Set()) {
  const out = [];
  if (!obj || typeof obj !== 'object') return out;
  for (const [key, value] of Object.entries(obj)) {
    if (key === '$schema' || key === 'meta' || key.startsWith('$')) continue;
    if (isToken(value)) {
      const name = ['ew', ...prefix, key].join('-');
      const varName = `--${name}`;
      out.push(`  ${varName}: ${cssValue(value.$type, value.$value, resolvedTokens)};`);
      resolvedTokens.add(varName);
    } else if (value && typeof value === 'object') {
      out.push(...flattenTokens(value, [...prefix, key], resolvedTokens));
    }
  }
  return out;
}
