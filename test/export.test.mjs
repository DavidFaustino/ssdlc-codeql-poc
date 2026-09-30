import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAlerts, alertsCsv } from '../scripts/export-code-scanning.mjs';

test('retains alert lifecycle and identity across API pages', () => {
  const pages = [
    [{ number: 8, state: 'open', rule: { id: 'java/example', security_severity_level: 'high' }, most_recent_instance: { ref: 'refs/heads/main', commit_sha: 'abc' }, created_at: '2026-09-30T10:00:00Z' }],
    [{ number: 9, state: 'dismissed', dismissed_reason: 'false positive', rule: { id: 'js/example' }, most_recent_instance: { ref: 'refs/heads/master', commit_sha: 'def' } }],
  ];
  const records = normalizeAlerts(pages, 'owner/repo');
  assert.equal(records.length, 2);
  assert.deepEqual(records.map(r => [r.number, r.state, r.reason, r.ruleId]), [
    [8, 'open', '', 'java/example'], [9, 'dismissed', 'false positive', 'js/example'],
  ]);
  assert.equal(records[0].commit, 'abc');
});

test('CSV escapes spreadsheet formulas and quotes from API data', () => {
  const csv = alertsCsv([{ repository: 'owner/repo', number: 2, state: 'open', reason: '', ruleId: '=HYPERLINK("x")', severity: '', ref: '', commit: '', createdAt: '' }]);
  assert.match(csv, /'\=HYPERLINK\(""x""\)/);
});
