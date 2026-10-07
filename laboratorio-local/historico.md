# Linha do tempo do laboratório

| Data | O que mudou | Estado após o marco |
|---|---|---|
| 29/09/2026 | Definidos Quarkus/Angular e o laboratório pessoal para iniciar CodeQL em paralelo à ferramenta SAST vigente. | Plano inicial; nenhuma validação corporativa. |
| 30/09/2026 | Criados repositório central e dois forks; executados baseline, casos SQL injection/XSS, correções, exportação de alertas e ciclo de vida do alerta Angular. | Detecção e correção dos controles sintéticos validadas. |
| 30/09/2026 | Testados `observe`, `warn` e `block` no PR Quarkus com o mesmo achado. | Decisão customizada demonstrada; sem proteção nativa de merge. |
| 30/09/2026 | Preparação da fase seguinte no Mac: Node.js 24 e testes locais; consulta a PR, merge ref e alertas históricos. | Correlação manual compreendida; novo ciclo ainda pendente. |
| 01/10/2026 | Branch central `poc/sarif-artifact` passou a salvar o SARIF integral; Codex conduziu achado → leitura SARIF → correção → reanálise no mesmo PR Quarkus e depois Angular. | Dois ciclos 1 → 0 comprovados; Devin não testado. |
| 01/10/2026 | Ruleset temporário CodeQL High ou superior no fork Angular, com script customizado em `observe`. | Check nativo bloqueou com achado e liberou após correção; Ruleset desativado e PR draft ao final. |
| 07/10/2026 | Documentação pública do processo consolidada nesta pasta; `piloto-p/` separado como etapa futura. | Organização documental; nenhum novo scan ou política executados nesta data. |

O detalhamento de cada run e sua conclusão limitada está em [Resultados](resultados.md). As fases DefectDojo/MCP, agente corporativo, gate de release e piloto em repositórios reais continuam pendentes; documentação de proposta não conta como evidência de execução.
