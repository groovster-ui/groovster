/**
 * Token alias resolution used by MCP contrast checks.
 * Kept inside the package so a published install does not import the monorepo generator.
 * Behavior matches tools/gen/src/tokens-to-css.js collectTokenValues / resolveValueAgainst.
 */

function isToken(node) {
  return node && typeof node === 'object' && '$type' in node && '$value' in node;
}

export function collectTokenValues(obj, prefix = [], out = new Map()) {
  if (!obj || typeof obj !== 'object') return out;
  for (const [key, value] of Object.entries(obj)) {
    if (key === '$schema' || key === 'meta' || key.startsWith('$')) continue;
    if (isToken(value)) out.set([...prefix, key].join('.'), value.$value);
    else if (value && typeof value === 'object') collectTokenValues(value, [...prefix, key], out);
  }
  return out;
}

export function resolveValueAgainst(map, value, depth = 0) {
  if (depth > 8) return value;
  if (typeof value !== 'string') return value;
  if (/^\{[a-z0-9.-]+\}$/i.test(value.trim())) {
    const tokenPath = value.trim().slice(1, -1);
    const next = map.get(tokenPath);
    if (next == null) return value;
    return resolveValueAgainst(map, next, depth + 1);
  }
  return value.replace(/\{([a-z0-9.-]+)\}/gi, (_, tokenPath) => {
    const next = map.get(tokenPath);
    if (next == null) return `{${tokenPath}}`;
    const resolved = resolveValueAgainst(map, next, depth + 1);
    return typeof resolved === 'string' ? resolved : String(resolved);
  });
}
