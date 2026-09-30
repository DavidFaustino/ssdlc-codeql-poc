# CodeQL SAST — laboratório SSDLC

Workflow reutilizável de CodeQL para os forks Quarkus e Angular da PoC Plard.
O resultado do scanner aparece em **Security → Code scanning** do repositório
consumidor. A action de resumo preserva o SARIF original e produz JSON/CSV.

## Repositórios

- `DavidFaustino/codeql-poc-quarkus` — Java/Quarkus, módulo `getting-started`.
- `DavidFaustino/codeql-poc-angular` — Angular/TypeScript com npm.

Os forks chamam `.github/workflows/codeql-reusable.yml` deste repositório
por SHA. Os resultados são de laboratório, com código público e casos sintéticos.

## Teste local do processador

```sh
node --test test/*.test.mjs
```

Use Node.js 24. Nenhum segredo é necessário para os scripts de resumo.
PoC de CodeQL SAST reutilizável para Quarkus e Angular
