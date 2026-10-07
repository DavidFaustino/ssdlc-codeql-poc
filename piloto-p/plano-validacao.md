# Plano de validação

**Objetivo:** avaliar CodeQL SAST em repositórios reais de todas as stacks identificadas, antes de escolher como o resultado influenciará o bloqueio. Esta página é um checklist, não um relato de testes executados.

## 1. Seleção dos repositórios

- [ ] Identificar ao menos um repositório de **código** representativo para cada arquétipo aplicável. Não confundir repositório de código com repositório de configuração/deploy.
- [ ] Confirmar proprietário, permissão para executar o piloto, linguagem efetiva, build, dependências internas e runner atual.
- [ ] Registrar o workflow de entrada e a referência usada pelo repositório (tag, SHA ou branch). Verificar se o caminho de segurança realmente é chamado.
- [ ] Escolher um commit/PR rastreável para comparar CodeQL e Fortify no **mesmo código**.
- [ ] Definir onde guardar evidência e prazo de retenção; não copiar código ou achados internos para este repositório pessoal.

O [registro do piloto](registro-piloto.md) contém os campos a preencher. Nenhum repositório real foi selecionado ainda.

## 2. Adaptação controlada

- [ ] Confirmar licença, Code Scanning habilitado, permissões de Actions e acesso ao workflow reutilizável.
- [ ] Copiar ou disponibilizar uma versão aprovada do workflow no ambiente-alvo, fixada por SHA. Não apontar um repositório corporativo diretamente para um workflow pessoal sem aprovação.
- [ ] Conferir runner, rede, certificados, proxy, dependências e limite de tempo de cada stack.
- [ ] Começar com resultado **observável e não bloqueante**. Fortify segue operando como controle vigente.
- [ ] Garantir que falha técnica do scan, SARIF ausente e zero achados apareçam como estados diferentes.

## 3. Matriz de stacks

| Arquétipo | O que comprovar no piloto | Estado |
|---|---|---|
| Java/Quarkus | Build Maven real; versão JDK; análise Java/Kotlin; módulos efetivamente analisados | Não iniciado |
| Angular/TypeScript | Instalação e build; análise JS/TS; arquivos e dependências presentes no PR | Não iniciado |
| Node.js/npm | Serviço ou biblioteca Node real, separado do caso Angular; análise JS/TS | Não iniciado |
| Go | Módulos, build/testes e análise Go no runner aprovado | Não iniciado |
| Python/PySpark | Ambiente Python, dependências e tipo de código analisado; cobertura efetiva do PySpark | Não iniciado |
| Rust | Toolchain, dependências e suporte do CodeQL na configuração corporativa | Não iniciado |
| Shell e workflows Actions | Tratar como lacuna/avaliação própria; não inferir cobertura da matriz acima | Não iniciado |

Para cada execução: guardar identificador do repositório no local autorizado, SHA, PR, run, versão do workflow, configuração de queries, resultado técnico, duração, saída SARIF, achados relevantes e resultado Fortify no mesmo SHA. Distinguir **scanner concluiu** de **cobertura suficiente** e de **política aprovada**.

## 4. PR e Ruleset

- [ ] Escolher um repositório piloto autorizado; usar PR não mesclado e achados existentes ou caso de teste aprovado, sem introduzir vulnerabilidade em código de produção.
- [ ] Definir com segurança/plataforma os atributos do Ruleset: escopo, branch-alvo, severidade, achado novo ou existente, tratamento de falha técnica, exceção, bypass e responsáveis.
- [ ] Executar CodeQL no PR; relacionar alerta, check e análise ao SHA do commit analisado.
- [ ] Confirmar visualmente o estado do PR **com e sem** condição bloqueante, sem aplicar o Ruleset à organização toda.
- [ ] Corrigir no mesmo PR, executar novamente e verificar se o alerta da revisão atual desapareceu. Registrar quem revisou.

## 5. Duas rotas de decisão — ainda sem escolha

| Rota | Pergunta a responder |
|---|---|
| Ruleset no PR | O bloqueio de merge cobre o critério de SAST desejado, com exceção e auditoria adequadas? |
| Security gate existente | O gate consegue consumir o resultado CodeQL, distinguir falha técnica de achados e provar que a release veio do SHA analisado? |

- [ ] Comparar as rotas usando o fluxo real PR → merge → release → imagem, inclusive releases sem PR direto e reexecuções.
- [ ] Confirmar qual evidência deve acompanhar a release e por quanto tempo.
- [ ] Registrar vantagens, lacunas e custo operacional das duas rotas antes de recomendar uma.
- [ ] Solicitar decisão formal dos responsáveis antes de alterar bloqueio ou retirar Fortify.

**Saída do piloto:** matriz preenchida por stack, evidência reproduzível, lacunas explícitas e recomendação fundamentada. Sucesso do scan não significa aprovação da substituição do controle vigente.
