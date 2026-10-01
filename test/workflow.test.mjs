import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../.github/workflows/codeql-reusable.yml', import.meta.url), 'utf8');

test('preserves complete CodeQL SARIF before the policy step can fail', () => {
  const analyze = workflow.indexOf('name: Analyze and upload CodeQL results');
  const archive = workflow.indexOf('name: Save complete SARIF');
  const policy = workflow.indexOf('name: Summarize SARIF and evaluate policy');

  assert.ok(analyze >= 0, 'CodeQL analyze step exists');
  assert.ok(archive > analyze, 'SARIF artifact follows analysis');
  assert.ok(policy > archive, 'SARIF artifact is saved before policy evaluation');

  const step = workflow.slice(archive, policy);
  assert.match(step, /uses: actions\/upload-artifact@/);
  assert.match(step, /name: codeql-sarif-\$\{\{ inputs\.profile \}\}/);
  assert.match(step, /path: \$\{\{ steps\.analyze\.outputs\.sarif-output \}\}/);
  assert.match(step, /if-no-files-found: error/);
  assert.match(step, /retention-days: 14/);
});
