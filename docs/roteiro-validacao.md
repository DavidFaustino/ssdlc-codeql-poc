# Roteiro de navegação — PoC CodeQL

Use a conta GitHub autorizada para ver Code scanning. Este é um laboratório público com controles sintéticos, não um painel corporativo Plard. Não faça merge dos PRs draft nem deploy dos casos de controle.

## 1. Execução e resumo

Abra [Actions no Quarkus](https://github.com/DavidFaustino/codeql-poc-quarkus/actions/workflows/wf-codeql-poc.yml) ou [Actions no Angular](https://github.com/DavidFaustino/codeql-poc-angular/actions/workflows/wf-codeql-poc.yml). Compare a baseline, o run com achado e o run após correção. No job `codeql`, veja as etapas de build, `Analyze and upload CodeQL results` e `Summarize SARIF`. O resumo do job mostra contagens; o artifact `codeql-summary-*` contém JSON/CSV por 14 dias.

## 2. Resultado na mudança

Abra o [PR Quarkus](https://github.com/DavidFaustino/codeql-poc-quarkus/pull/1) e o [PR Angular](https://github.com/DavidFaustino/codeql-poc-angular/pull/1). Em **Checks**, abra o job CodeQL e compare os commits vulnerável/corrigido. O achado Java é `java/sql-injection`; o TypeScript é `js/xss`. Os PRs estão draft e corrigidos no HEAD. A análise de PR usa `refs/pull/1/merge`; não confunda esse SHA com o HEAD da branch.

## 3. Alertas do repositório

Em cada repositório, abra **Security → Code scanning**. No Angular, procure o alerta `js/xss` #2 da branch padrão `master`. O estado final esperado é `fixed`. A linha do tempo documentada em `_plard` mostra abertura, correção, reabertura, descarte com motivo `used in tests`, reabertura manual e correção final. Um descarte manual não deve ser interpretado como código corrigido.

Se a UI não mostrar um alerta do PR na lista padrão, consulte a referência do PR explicitamente:

```sh
gh api 'repos/DavidFaustino/codeql-poc-angular/code-scanning/alerts?ref=refs%2Fpull%2F1%2Fmerge&per_page=100' --jq '[.[]|{number,state,rule:.rule.id,ref:.most_recent_instance.ref}]'
```

Para estados atuais da branch padrão e exportação local:

```sh
node scripts/export-code-scanning.mjs DavidFaustino/codeql-poc-angular ./exports/angular
node scripts/export-code-scanning.mjs DavidFaustino/codeql-poc-quarkus ./exports/quarkus
```

O CSV/JSON é um retrato no momento da coleta, não uma trilha de auditoria completa. `most_recent_instance.commit_sha` aponta para a última ocorrência do achado, não necessariamente para o commit que o corrigiu.

## 4. O que ainda exige a organização Plard

Security overview organizacional, cobertura de repositórios, visões gerenciais consolidadas, política de gate/merge, retenção, permissões e comparação lado a lado com Fortify não foram validados nesta conta pessoal. No piloto corporativo, confirmar acesso/licença primeiro; então repetir os mesmos passos em repositórios representativos e registrar escopo, commit, módulo e runner.
