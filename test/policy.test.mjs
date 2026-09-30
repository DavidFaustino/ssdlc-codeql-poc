import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const policyScript = new URL('../actions/codeql-summary/policy.mjs', import.meta.url).pathname;

async function runPolicy(mode, summary) {
  const root = await mkdtemp(join(tmpdir(), 'codeql-policy-'));
  try {
    const summaryPath = join(root, 'summary.json');
    const stepSummaryPath = join(root, 'step-summary.md');
    if (summary !== undefined) await writeFile(summaryPath, JSON.stringify(summary));
    const result = spawnSync(process.execPath, [policyScript, summaryPath, mode], {
      encoding: 'utf8',
      env: { ...process.env, GITHUB_STEP_SUMMARY: stepSummaryPath },
    });
    const markdown = await readFile(stepSummaryPath, 'utf8').catch(() => '');
    return { ...result, markdown };
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

const withFinding = {
  files: 1,
  total: 1,
  findings: [{ ruleId: 'java/sql-injection', path: 'src/Resource.java', line: 18 }],
};
const clean = { files: 1, total: 0, findings: [] };

test('observe with a finding reports it but does not warn or fail', async () => {
  const result = await runPolicy('observe', withFinding);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /::notice title=CodeQL policy::/);
  assert.doesNotMatch(result.stdout, /::warning|::error/);
  assert.match(result.markdown, /observe.*1.*pass/i);
});

test('warn with a finding emits a warning annotation and succeeds', async () => {
  const result = await runPolicy('warn', withFinding);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /::warning title=CodeQL policy::/);
  assert.match(result.markdown, /warn.*1.*warn/i);
});

test('block with a finding emits an error annotation and fails', async () => {
  const result = await runPolicy('block', withFinding);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /::error title=CodeQL policy::/);
  assert.match(result.markdown, /block.*1.*fail/i);
});

test('block with zero findings passes', async () => {
  const result = await runPolicy('block', clean);
  assert.equal(result.status, 0);
  assert.doesNotMatch(result.stdout, /::warning|::error/);
  assert.match(result.markdown, /block.*0.*pass/i);
});

test('missing summary fails instead of becoming zero findings', async () => {
  const result = await runPolicy('warn');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /summary.*ausente|ENOENT/i);
});

test('invalid policy mode fails rather than silently observing', async () => {
  const result = await runPolicy('ignore', clean);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /mode|modo/i);
});
