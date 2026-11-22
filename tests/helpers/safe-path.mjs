import path from 'node:path';

/**
 * Resolve `requested` under `root` and reject path traversal.
 * Returns the absolute path when it stays inside root; otherwise null.
 *
 * Safe when: resolved === root || resolved.startsWith(root + path.sep)
 * (plain startsWith(root) is vulnerable to a "root-evil" sibling prefix).
 *
 * @param {string} root
 * @param {string} requested — absolute or relative to root
 * @returns {string | null}
 */
export function safePath(root, requested) {
  const resolvedRoot = path.resolve(root);
  const resolved = path.isAbsolute(requested)
    ? path.resolve(requested)
    : path.resolve(resolvedRoot, requested);
  if (resolved === resolvedRoot || resolved.startsWith(resolvedRoot + path.sep)) {
    return resolved;
  }
  return null;
}
