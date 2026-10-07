# Processo da PoC local

Este é o procedimento efetivamente usado e o que observar ao repeti-lo. Os IDs e estados específicos estão em [Resultados](resultados.md). Os casos vulneráveis foram sintéticos, mantidos em branches/PRs de laboratório e não implantados.

## 1. Preparar o laboratório

1. Usar o repositório central para o [workflow reutilizável](../.github/workflows/codeql-reusable.yml) e os forks Quarkus/Angular como consumidores. Cada fork tem `.github/workflows/wf-codeql-poc.yml` apontando para um SHA do central.
2. Conferir o build real da aplicação no runner e separar falha de build de resultado de segurança. A baseline sem achados apenas demonstra que o scan concluiu naquele escopo.
3. Executar os testes Node.js do processador com `node --test test/*.test.mjs` usando Node.js 24. Os testes não substituem execução do CodeQL nem teste funcional da aplicação.

## 2. Demonstrar detecção e correção

1. Abrir PR draft com caso controlado: SQL injection Java no Quarkus; XSS TypeScript no Angular.
2. Esperar o workflow concluir. Verificar job, regra, arquivo/linha e SARIF correspondente ao run. Um check pendente ou ausente não é aprovação.
3. Conferir a diferença entre head do PR, merge ref e SHA analisado. Consultas à API de alertas precisam usar o ref do PR quando o achado não existe na branch padrão.
4. Corrigir no **mesmo PR**, gerar novo commit, esperar novo scan e conferir novo SARIF. Os dois controles passaram de 1 achado para 0; o estado do alerta foi conferido separadamente na API.
5. Manter revisão humana e verificar efeitos funcionais. O desaparecimento do achado não comprova que a aplicação funciona nem que o scanner cobre todo o código.

No Angular, um conflito com `master` impediu novos checks após pushes. A execução só apareceu depois de resolver o conflito. Isso foi registrado como condição operacional, não como sucesso de segurança.

## 3. Examinar o ciclo de vida do alerta

Na branch padrão do fork Angular, um controle isolado produziu a sequência `open → fixed → open → dismissed → open → fixed` para o mesmo alerta. O descarte foi marcado como usado em teste e **não** foi tratado como correção. Uma exportação da API é um retrato do momento; não substitui o histórico de eventos.

## 4. Isolar os dois mecanismos de bloqueio

- **Check customizado:** manter o mesmo achado no PR Quarkus e mudar apenas `policy_mode` entre `observe`, `warn` e `block`. `observe` e `warn` deixaram o job verde; `block` o deixou vermelho. Sem regra de proteção, job vermelho não demonstra bloqueio de merge.
- **Ruleset nativo:** no fork Angular, usar `policy_mode: observe` para deixar o job customizado verde. Com o Ruleset temporário para CodeQL High ou superior, o check nativo falhou e o PR ficou `BLOCKED`; após correção, ficou `CLEAN`. Não houve merge. O Ruleset foi desativado e o PR voltou a draft.

## 5. Consumir o SARIF integral com Codex

A branch experimental do workflow passou a salvar o SARIF completo antes da etapa de política, com retenção de 14 dias. Em Quarkus e Angular, Codex acompanhou o mesmo PR, relacionou head/run/artifact, baixou o SARIF da execução, interpretou o achado, corrigiu o código e leu o **novo** SARIF após reanálise. Não foi criado um pacote JSON intermediário para o agente. Isso comprova o ciclo **com Codex**, não uma integração com Devin.

Condições negativas observadas: `QUEUED` não é aprovação; SARIF de head anterior é evidência obsoleta para a decisão atual; token fictício inválido retornou 401 e não zero achados. Os testes da action rejeitam SARIF ausente/inválido. Ainda faltam medição de latência de ingestão dos alertas, correlação automatizada head/run e teste funcional das correções.

Não refazer casos vulneráveis ou modificar Rulesets em repositórios fora do laboratório sem escopo e autorização específicos.
