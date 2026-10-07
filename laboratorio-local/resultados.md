# Resultados e evidências

Resultados históricos da PoC pessoal, registrados entre 30/09 e 01/10/2026. Para acompanhar as telas, consulte o [roteiro](../docs/roteiro-validacao.md). Links para runs continuam úteis para a sequência, mas artifacts SARIF tinham retenção configurada de 14 dias.

## Baseline e controles

| Caso | Evidência inicial | Evidência após correção | Conclusão limitada |
|---|---|---|---|
| Quarkus baseline | [Run 36664824759](https://github.com/DavidFaustino/codeql-poc-quarkus/actions/runs/36664824759), 0 achados | — | Scan concluiu; zero não prova ausência de vulnerabilidades. |
| Angular baseline | [Run 36664836807](https://github.com/DavidFaustino/codeql-poc-angular/actions/runs/36664836807), 0 achados | — | Mesmo limite. |
| SQL injection Java no [PR Quarkus #1](https://github.com/DavidFaustino/codeql-poc-quarkus/pull/1) | [Run 36665219524](https://github.com/DavidFaustino/codeql-poc-quarkus/actions/runs/36665219524), `java/sql-injection` = 1 | [Run 36665557860](https://github.com/DavidFaustino/codeql-poc-quarkus/actions/runs/36665557860), 0; alerta `fixed` | Caso sintético detectado e corrigido, sem merge/deploy. |
| XSS TypeScript no [PR Angular #1](https://github.com/DavidFaustino/codeql-poc-angular/pull/1) | [Run 36665242508](https://github.com/DavidFaustino/codeql-poc-angular/actions/runs/36665242508), `js/xss` = 1 | [Run 36665554433](https://github.com/DavidFaustino/codeql-poc-angular/actions/runs/36665554433), 0; alerta `fixed` | Caso sintético detectado e corrigido, sem merge/deploy. |

No controle da branch padrão Angular, o alerta #2 percorreu `open → fixed → open → dismissed → open → fixed`. Runs: [abertura](https://github.com/DavidFaustino/codeql-poc-angular/actions/runs/36665694763), [correção](https://github.com/DavidFaustino/codeql-poc-angular/actions/runs/36665893224), [reabertura](https://github.com/DavidFaustino/codeql-poc-angular/actions/runs/36666104672) e [correção final](https://github.com/DavidFaustino/codeql-poc-angular/actions/runs/36666309238). O descarte manual não foi apresentado como remediação.

## Política customizada, sem Ruleset

No [PR Quarkus #2](https://github.com/DavidFaustino/codeql-poc-quarkus/pull/2), o mesmo achado `java/sql-injection` foi analisado com três modos da action central:

| Modo | Run | SARIF | Resultado do job |
|---|---|---:|---|
| `observe` | [36668979579](https://github.com/DavidFaustino/codeql-poc-quarkus/actions/runs/36668979579) | 1 | success + notice |
| `warn` | [36669175570](https://github.com/DavidFaustino/codeql-poc-quarkus/actions/runs/36669175570) | 1 | success + warning |
| `block` | [36669367787](https://github.com/DavidFaustino/codeql-poc-quarkus/actions/runs/36669367787) | 1 | failure + error |
| `block` após correção | [36669563099](https://github.com/DavidFaustino/codeql-poc-quarkus/actions/runs/36669563099) | 0 | success |

O script de laboratório bloqueava por **qualquer** achado, sem limiar de severidade. O resultado vermelho desse job não provou proteção de merge.

## SARIF integral e correção pelo Codex

O commit central [`836fab4`](https://github.com/DavidFaustino/ssdlc-codeql-poc/commit/836fab41ce4b2153abc90ada9cd5a4e50764924a) na branch `poc/sarif-artifact` adicionou o artifact completo. A suíte Node.js 24 passou com **14/14** testes. A mudança não estava em `main` ao fim da rodada.

| PR | Head com achado / run | Head corrigido / run | SARIF e resultado |
|---|---|---|---|
| [Quarkus #2](https://github.com/DavidFaustino/codeql-poc-quarkus/pull/2) | `100ca739362070d4486abfba68e435770319b81e` / [36872794433](https://github.com/DavidFaustino/codeql-poc-quarkus/actions/runs/36872794433) | `39517d83cbd811413fbc336ffc32cb8bdc3353f0` / [36873401922](https://github.com/DavidFaustino/codeql-poc-quarkus/actions/runs/36873401922) | `java/sql-injection` 1 → 0; SARIF SHA-256 `2cae913d15a53c348777807865a01e9b5617092c3ced27e6539c2fe33d0f5d40` / `1db9d912d6f2e5fbccdccb51485043a204cfe908a7e43f542e0a1db708a8a132`. |
| [Angular #1](https://github.com/DavidFaustino/codeql-poc-angular/pull/1) | `bcdba3c343ea009b9d70b78e05804be2becb1aad` / [36875053318](https://github.com/DavidFaustino/codeql-poc-angular/actions/runs/36875053318) | `baa5448b6cff42b10caf4cc2ae91d9eeedbf5ce1` / [36875391292](https://github.com/DavidFaustino/codeql-poc-angular/actions/runs/36875391292) | `js/xss` 1 → 0; SARIF SHA-256 `edbcf586c220eee4264cbcab54f1da8c001659d8909a92b1e2f28d0b297d6f74` / `7124c73b74d09d5b7d41d8a20f537c93481da0632ddf345de4efd08ac2f687c0`. |

Codex leu os SARIFs desses runs e corrigiu no **mesmo PR**. Os PRs permaneceram draft, sem merge nem deploy. SHA-256 identifica o arquivo observado na ocasião; não representa uma cópia permanente do artifact.

## Ruleset nativo separado da política customizada

No fork Angular, o [Ruleset temporário 24336501](https://github.com/DavidFaustino/codeql-poc-angular/rules/24336501) usou CodeQL com limiar `high_or_higher`. O workflow customizado ficou em `observe` para isolar o teste.

| Estado | Evidência | Resultado |
|---|---|---|
| 1 XSS High aberto | [Run 36933752319](https://github.com/DavidFaustino/codeql-poc-angular/actions/runs/36933752319) | Workflow success; check nativo CodeQL failure; PR `BLOCKED`. |
| Correção no mesmo PR | [Run 36934038163](https://github.com/DavidFaustino/codeql-poc-angular/actions/runs/36934038163) | 0 achados; check nativo success; PR `CLEAN`. |
| Laboratório restaurado | [Run 36934310462](https://github.com/DavidFaustino/codeql-poc-angular/actions/runs/36934310462) | PR draft; modo customizado `block`; Ruleset desativado. |

Esse resultado vale para o fork pessoal e o caso High testado. Não estabelece política organizacional. Não foram medidos ingestão de alertas, escala nem comportamento do Ruleset em outros limiares.
