/** Flatten DTCG-ish token trees into CSS custom properties. */

function isToken(node) {
  return node && typeof node === 'object' && '$type' in node && '$value' in node;
}

/** Resolve DTCG `{color.ink}` / `{color.gray.8}` aliases to `var(--ew-…)` refs. */
export function resolveTokenRefs(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/\{([a-z0-9.-]+)\}/gi, (_, path) => {
    const name = ['ew', ...path.split('.')].join('-');
    return `var(--${name})`;
  });
}

function cssValue(type, value) {
  if (type === 'fontFamily' && Array.isArray(value)) {
    return value.map((v) => (String(v).includes(' ') ? `"${v}"` : v)).join(', ');
  }
  if (type === 'shadow' && Array.isArray(value)) {
    return value
      .map((s) => {
        const color = resolveTokenRefs(s.color);
        return `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread || '0px'} ${color}`;
      })
      .join(', ');
  }
  if (typeof value === 'number') return String(value);
  return resolveTokenRefs(String(value));
}

export function flattenTokens(obj, prefix = []) {
  const out = [];
  if (!obj || typeof obj !== 'object') return out;
  for (const [key, value] of Object.entries(obj)) {
    if (key === '$schema' || key === 'meta' || key.startsWith('$')) continue;
    if (isToken(value)) {
      const name = ['ew', ...prefix, key].join('-');
      out.push(`    --${name}: ${cssValue(value.$type, value.$value)};`);
    } else if (value && typeof value === 'object') {
      out.push(...flattenTokens(value, [...prefix, key]));
    }
  }
  return out;
}

/** Walk a token tree and collect path → raw $value (unresolved). */
export function collectTokenValues(obj, prefix = [], out = new Map()) {
  if (!obj || typeof obj !== 'object') return out;
  for (const [key, value] of Object.entries(obj)) {
    if (key === '$schema' || key === 'meta' || key.startsWith('$')) continue;
    if (isToken(value)) {
      out.set([...prefix, key].join('.'), value.$value);
    } else if (value && typeof value === 'object') {
      collectTokenValues(value, [...prefix, key], out);
    }
  }
  return out;
}

/** Resolve `{refs}` against a path→value map (tier1 literals). Max depth 8. */
export function resolveValueAgainst(map, value, depth = 0) {
  if (depth > 8) return value;
  if (typeof value !== 'string') return value;
  if (/^\{[a-z0-9.-]+\}$/i.test(value.trim())) {
    const path = value.trim().slice(1, -1);
    const next = map.get(path);
    if (next == null) return value;
    return resolveValueAgainst(map, next, depth + 1);
  }
  return value.replace(/\{([a-z0-9.-]+)\}/gi, (_, path) => {
    const next = map.get(path);
    if (next == null) return `{${path}}`;
    const resolved = resolveValueAgainst(map, next, depth + 1);
    return typeof resolved === 'string' ? resolved : String(resolved);
  });
}
