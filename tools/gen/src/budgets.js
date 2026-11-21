import { BUDGETS_PATH } from './paths.js';
import { readJson } from './io.js';

export function checkBudgets(manifest) {
  const budgets = readJson(BUDGETS_PATH);
  const failures = [];
  for (const [key, measured] of Object.entries(manifest.budgetReport.measured)) {
    const budgetKey = measured.budget;
    const limit = budgets.budgets[budgetKey]?.maxChars;
    if (limit == null) {
      failures.push({ key, error: `Unknown budget key ${budgetKey}` });
      continue;
    }
    if (measured.chars > limit) {
      failures.push({ key, chars: measured.chars, limit, budgetKey });
    }
  }
  return failures;
}
