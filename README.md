# CodeQL SAST — laboratório SSDLC

Workflow reutilizável de CodeQL para os forks Quarkus e Angular da PoC Plard.
O resultado do scanner aparece em **Security → Code scanning** do repositório
consumidor. A action de resumo processa o SARIF e produz JSON/CSV. O artifact
SARIF integral foi testado em uma branch experimental, ainda fora de `main`.

## Navegação da PoC

- [Laboratório local](laboratorio-local/README.md) — processo executado, arquitetura, linha do tempo e evidências.
- [Piloto P](piloto-p/README.md) — plano para validação futura em repositórios reais; não executado.

## Repositórios

- `DavidFaustino/codeql-poc-quarkus` — Java/Quarkus, módulo `getting-started`.
- `DavidFaustino/codeql-poc-angular` — Angular/TypeScript com npm.

Os forks chamam `.github/workflows/codeql-reusable.yml` deste repositório
por SHA. Os resultados são de laboratório, com código público e casos sintéticos.

Para ver os runs, PRs e alertas em ordem, siga o [roteiro de validação](docs/roteiro-validacao.md).

## Política de laboratório

O workflow reutilizável recebe `policy_mode: observe | warn | block` (padrão `observe`). A decisão usa **qualquer achado** presente no SARIF válido, sem limiar de severidade nesta PoC:

| Modo | Com achado | Sem achado |
|---|---|---|
| `observe` | Anotação informativa; job passa | Job passa |
| `warn` | Anotação warning; job passa | Job passa |
| `block` | Anotação error; job falha | Job passa |

Falha de análise, SARIF ausente/inválido ou modo desconhecido é **falha técnica**, nunca zero achados. O upload do SARIF pelo CodeQL precede a política; o artifact de resumo é salvo mesmo quando `block` falha. A falha do job **não bloqueia merge por si só**: para impor este gate, o check precisa ser obrigatório na regra de proteção. Alternativamente, o GitHub oferece [merge protection por alerta de Code scanning](https://docs.github.com/en/code-security/concepts/code-scanning/merge-protection), uma política distinta do check customizado. A escolha para a organização Plard permanece pendente de decisão SSDLC/Foundation.

## Teste local do processador

```sh
node --test test/*.test.mjs
```

Use Node.js 24. Nenhum segredo é necessário para os scripts de resumo.

## Exportar estados de alertas

Com `gh` autenticado, executar:

```sh
node scripts/export-code-scanning.mjs DavidFaustino/codeql-poc-quarkus ./exports/quarkus
node scripts/export-code-scanning.mjs DavidFaustino/codeql-poc-angular ./exports/angular
```

Os arquivos `alerts.json` e `alerts.csv` mostram o estado observado no momento
da coleta. Eles não substituem o histórico de análises nem provam cobertura.
Não coloque o token do GitHub na linha de comando ou nos artefatos.
PoC de CodeQL SAST reutilizável para Quarkus e Angular
