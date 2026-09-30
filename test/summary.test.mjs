import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { summarizeDirectory, toCsv } from '../actions/codeql-summary/index.mjs';

async function withDirectory(callback) {
  const root = await mkdtemp(join(tmpdir(), 'codeql-summary-'));
  try { return await callback(root); } finally { await rm(root, { recursive: true, force: true }); }
}

const sarif = (results) => ({
  version: '2.1.0',
  runs: [{
    tool: { driver: { name: 'CodeQL', rules: [{ id: 'js/example', properties: { 'security-severity': '7.5' } }] } },
    results,
  }],
});

test('summarizes rules without changing the original SARIF', async () => withDirectory(async root => {
  const path = join(root, 'javascript.sarif');
  const original = JSON.stringify(sarif([
    { ruleId: 'js/example', level: 'warning', message: { text: 'Example' }, locations: [{ physicalLocation: { artifactLocation: { uri: 'src/app.ts' }, region: { startLine: 7 } } }] },
  ]));
  await writeFile(path, original);
  const summary = await summarizeDirectory(root);
  assert.equal(summary.total, 1);
  assert.equal(summary.byRule['js/example'], 1);
  assert.equal(summary.byLevel.warning, 1);
  assert.equal(summary.findings[0].path, 'src/app.ts');
  assert.equal(summary.findings[0].line, 7);
  assert.equal(await readFile(path, 'utf8'), original);
}));

test('analyzes a valid SARIF with zero findings as zero', async () => withDirectory(async root => {
  await writeFile(join(root, 'empty.sarif'), JSON.stringify(sarif([])));
  const summary = await summarizeDirectory(root);
  assert.equal(summary.total, 0);
  assert.equal(summary.files, 1);
}));

test('does not turn absent SARIF into success', async () => withDirectory(async root => {
  await assert.rejects(() => summarizeDirectory(root), /SARIF.*ausente/i);
}));

test('rejects malformed SARIF even when a valid file exists', async () => withDirectory(async root => {
  await mkdir(join(root, 'nested'));
  await writeFile(join(root, 'nested', 'valid.sarif'), JSON.stringify(sarif([])));
  await writeFile(join(root, 'broken.sarif'), '{');
  await assert.rejects(() => summarizeDirectory(root), /SARIF.*inválido/i);
}));

test('CSV treats formula-like values as data', () => {
  const csv = toCsv({ findings: [{ ruleId: '=cmd', level: 'warning', path: '+evil', line: 1, message: '@payload', securitySeverity: '' }] });
  assert.match(csv, /'\=cmd/);
  assert.match(csv, /'\+evil/);
  assert.match(csv, /'@payload/);
});
