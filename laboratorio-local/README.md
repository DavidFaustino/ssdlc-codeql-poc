# PoC local — mapa

Esta pasta registra **o que foi executado** no laboratório público de CodeQL SAST. O repositório central contém o workflow reutilizável e os scripts; os forks [Quarkus](https://github.com/DavidFaustino/codeql-poc-quarkus) e [Angular](https://github.com/DavidFaustino/codeql-poc-angular) foram os consumidores. “Local” indica a PoC conduzida na conta pessoal com Codex no Mac; os scans ocorreram nos runners do GitHub.

## Onde começar

1. [Arquitetura executada](arquitetura.md) — peças e fluxo de dados.
2. [Processo reproduzível](processo.md) — como foram feitos os scans, controles, correções e verificações.
3. [Resultados e evidências](resultados.md) — PRs, runs, achados e limites de cada teste.
4. [Linha do tempo](historico.md) — ordem dos experimentos e decisões.
5. [Roteiro de navegação no GitHub](../docs/roteiro-validacao.md) — telas de Actions, PR e Code scanning.

O [Piloto P](../piloto-p/README.md) é **posterior** e ainda está em planejamento. Não confundir seus checklists com testes já realizados.

## Estado ao encerrar esta rodada

- Quarkus/Java e Angular/TypeScript: baseline, achados sintéticos, correção no mesmo PR e novo SARIF com **1 → 0** achados demonstrados.
- Modos experimentais `observe`, `warn` e `block`: executados. O modo `block` é um check customizado, não uma política de merge por si só.
- Ruleset nativo CodeQL High ou superior: testado temporariamente **somente no fork Angular**. O Ruleset foi desativado após o teste; o PR voltou a draft.
- Fortify no mesmo código, outras stacks, DefectDojo/MCP, Devin, release/gate e ambiente corporativo: **não testados nesta rodada**.

Os artifacts SARIF tinham retenção de 14 dias. As referências de run, hashes e resultados registrados permitem auditar o experimento, mas não garantem que o arquivo integral ainda esteja disponível para download. A pasta `exports/` deste checkout é ignorada pelo Git e não faz parte da evidência publicada.

**Decisão registrada:** seguir para um piloto controlado, mantendo o controle SAST vigente enquanto CodeQL é avaliado em paralelo. Esta PoC não aprova substituição de ferramenta ou política corporativa.
