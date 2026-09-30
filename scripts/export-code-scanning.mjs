import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export function normalizeAlerts(pages, repository) {
  if (!Array.isArray(pages) || !pages.every(Array.isArray)) throw new Error('Resposta paginada inválida.');
  return pages.flat().map(alert => ({
    repository,
    number: alert.number,
    state: alert.state ?? '',
    reason: alert.dismissed_reason ?? '',
    ruleId: alert.rule?.id ?? '',
    severity: alert.rule?.security_severity_level ?? alert.rule?.severity ?? '',
    ref: alert.most_recent_instance?.ref ?? '',
    commit: alert.most_recent_instance?.commit_sha ?? '',
    createdAt: alert.created_at ?? '',
  }));
}

function csvCell(value) {
  let text = String(value ?? '');
  if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function alertsCsv(records) {
  const columns = ['repository', 'number', 'state', 'reason', 'ruleId', 'severity', 'ref', 'commit', 'createdAt'];
  return [columns.join(','), ...records.map(record => columns.map(column => csvCell(record[column])).join(','))].join('\n') + '\n';
}

async function main() {
  const [repository, outputDir] = process.argv.slice(2);
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository ?? '') || !outputDir) {
    throw new Error('Uso: node export-code-scanning.mjs <owner/repo> <output-dir>');
  }
  const result = spawnSync('gh', [
    'api', '-H', 'Accept: application/vnd.github+json',
    `repos/${repository}/code-scanning/alerts?per_page=100&state=all`, '--paginate', '--slurp',
  ], { encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
  if (result.error || result.status !== 0) {
    throw new Error(`Falha ao ler alertas do GitHub: ${result.error?.message ?? result.stderr.trim()}`);
  }
  const records = normalizeAlerts(JSON.parse(result.stdout), repository);
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, 'alerts.json'), JSON.stringify({ repository, collectedAt: new Date().toISOString(), records }, null, 2) + '\n');
  await writeFile(join(outputDir, 'alerts.csv'), alertsCsv(records));
  process.stdout.write(`${repository}: ${records.length} alertas exportados.\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
