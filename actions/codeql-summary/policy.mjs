import { readFile, appendFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function decidePolicy(summary, mode) {
  if (!['observe', 'warn', 'block'].includes(mode)) throw new Error(`Modo de política inválido: ${mode}`);
  if (!Number.isInteger(summary?.files) || summary.files < 1 ||
      !Number.isInteger(summary?.total) || summary.total < 0 ||
      !Array.isArray(summary?.findings) || summary.findings.length !== summary.total) {
    throw new Error('Summary inválido: contagem de achados inconsistente.');
  }
  if (summary.total === 0 || mode === 'observe') return { decision: 'pass', annotation: 'notice' };
  if (mode === 'warn') return { decision: 'warn', annotation: 'warning' };
  return { decision: 'fail', annotation: 'error' };
}

async function main() {
  const [summaryPath, mode] = process.argv.slice(2);
  if (!summaryPath) throw new Error('Summary ausente: informe o caminho do summary.json.');
  let summary;
  try { summary = JSON.parse(await readFile(summaryPath, 'utf8')); }
  catch { throw new Error('Summary ausente ou inválido: não é possível avaliar a política.'); }
  const { decision, annotation } = decidePolicy(summary, mode);
  const message = `Mode ${mode}; ${summary.total} CodeQL finding(s); decision ${decision}.`;
  process.stdout.write(`::${annotation} title=CodeQL policy::${message}\n`);
  const markdown = `\n## CodeQL policy\n\n| Mode | Findings | Decision |\n|---|---:|---|\n| ${mode} | ${summary.total} | ${decision} |\n`;
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, markdown);
  if (decision === 'fail') process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
