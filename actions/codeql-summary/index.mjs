import { readdir, readFile, mkdir, writeFile, appendFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

async function sarifPaths(root) {
  const paths = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) paths.push(...await sarifPaths(path));
    else if (entry.isFile() && entry.name.endsWith('.sarif')) paths.push(path);
  }
  return paths.sort();
}

export async function summarizeDirectory(root) {
  const paths = await sarifPaths(root);
  if (!paths.length) throw new Error('SARIF ausente: a análise não produziu um relatório.');
  const summary = { files: paths.length, total: 0, byRule: {}, byLevel: {}, findings: [] };
  for (const path of paths) {
    let document;
    try { document = JSON.parse(await readFile(path, 'utf8')); }
    catch { throw new Error(`SARIF inválido: ${path}`); }
    if (document?.version !== '2.1.0' || !Array.isArray(document.runs) ||
        !document.runs.every(run => Array.isArray(run.results) && run.tool?.driver?.name)) {
      throw new Error(`SARIF inválido: ${path}`);
    }
    for (const run of document.runs) {
      const rules = new Map((run.tool.driver.rules || []).map(rule => [rule.id, rule]));
      for (const result of run.results) {
        const location = result.locations?.[0]?.physicalLocation;
        const ruleId = result.ruleId || '(sem ruleId)';
        const level = result.level || '(não informado)';
        summary.findings.push({
          ruleId, level,
          securitySeverity: rules.get(result.ruleId)?.properties?.['security-severity'] ?? '',
          path: location?.artifactLocation?.uri ?? '',
          line: location?.region?.startLine ?? '',
          message: result.message?.text ?? '',
        });
        summary.byRule[ruleId] = (summary.byRule[ruleId] || 0) + 1;
        summary.byLevel[level] = (summary.byLevel[level] || 0) + 1;
        summary.total++;
      }
    }
  }
  return summary;
}

function csvCell(value) {
  let text = String(value ?? '');
  if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function toCsv(summary) {
  const columns = ['ruleId', 'level', 'securitySeverity', 'path', 'line', 'message'];
  return [columns.join(','), ...summary.findings.map(item => columns.map(key => csvCell(item[key])).join(','))].join('\n') + '\n';
}

async function main() {
  const [sarifRoot, outputRoot] = process.argv.slice(2);
  if (!sarifRoot || !outputRoot) throw new Error('Uso: node index.mjs <sarif-dir> <output-dir>');
  const summary = await summarizeDirectory(sarifRoot);
  await mkdir(outputRoot, { recursive: true });
  await writeFile(join(outputRoot, 'summary.json'), JSON.stringify({
    ...summary,
    provenance: {
      repository: process.env.GITHUB_REPOSITORY || '',
      ref: process.env.GITHUB_REF || '',
      sha: process.env.GITHUB_SHA || '',
      runId: process.env.GITHUB_RUN_ID || '',
      runAttempt: process.env.GITHUB_RUN_ATTEMPT || '',
      workflowRef: process.env.GITHUB_WORKFLOW_REF || '',
    },
  }, null, 2) + '\n');
  await writeFile(join(outputRoot, 'findings.csv'), toCsv(summary));
  const table = Object.entries(summary.byLevel).map(([level, count]) => `| ${level} | ${count} |`).join('\n');
  const markdown = `## CodeQL SAST\n\nSARIF válido: ${summary.files} arquivo(s). Resultados: ${summary.total}.\n\n| Nível SARIF | Quantidade |\n|---|---:|\n${table || '| Sem resultados | 0 |'}\n\nContagem de resultados, não decisão de risco.\n`;
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, markdown);
  else process.stdout.write(markdown);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
