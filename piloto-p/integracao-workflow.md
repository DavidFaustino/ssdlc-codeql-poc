# Integração do workflow

## Base existente neste repositório

- [Workflow reutilizável](../.github/workflows/codeql-reusable.yml): aceita hoje apenas `profile=java|angular`; usa runner GitHub-hosted, Maven para Java e npm para Angular.
- [Action de resumo](../actions/codeql-summary/action.yml): processa o SARIF e produz um resultado experimental `observe|warn|block`. Essa lógica de laboratório **não é a política corporativa aprovada**.
- [Testes locais](../test/): verificam o processador. Os forks Quarkus e Angular demonstraram a chamada reutilizável, não cobertura das outras stacks.
- A branch experimental `poc/sarif-artifact` acrescenta o upload do SARIF completo antes da avaliação de política. Esta mudança **não está em `main`**; reconciliar as versões antes de transportar o workflow.

## Contrato a confirmar antes de copiar

| Ponto | Pergunta técnica | Evidência necessária |
|---|---|---|
| Chamada | Qual repositório corporativo hospedará o reutilizável? Quem pode chamá-lo? | Política de Actions e chamada por SHA testada |
| Eventos | O scan roda em PR, push, release ou mais de um? | Workflow chamador e run por evento |
| Permissões | Quais permissões mínimas permitem checkout, Code Scanning e artifact? | Permissões efetivas do job/token |
| Build | Quais comandos e dependências variam por stack/repositório? | Build reproduzido no runner aprovado |
| SARIF | Onde fica o arquivo completo, quem pode baixá-lo e por quanto tempo? | Artifact e análise vinculados ao SHA |
| Gate | Qual é o contrato atual de entrada/saída e quem decide? | Exemplo sanitizado do JSON e comportamento com falha técnica |
| Coexistência | CodeQL e Fortify analisam o mesmo commit? | Dois runs e SHAs comparáveis |

## Alterações previstas, não implementadas

1. Separar configuração de **linguagem CodeQL** da configuração de **build**; `angular` e `node` podem compartilhar JS/TS, mas têm rotinas diferentes.
2. Adicionar perfis somente depois de testar cada arquétipo. Evitar um comando genérico que marque scan como sucesso quando o build necessário falhou.
3. Tornar a publicação do SARIF completo e do resumo explícita, com retenção e permissão acordadas. Dados internos não devem ser copiados para este repositório pessoal.
4. Preservar a política vigente: o modo `block` da action é experimental. O piloto começa em observação e testa Ruleset e gate em escopo controlado.
5. Remover identificadores de ambiente do workflow antes de disponibilizar uma versão genérica. Hoje a categoria do CodeQL no workflow contém um identificador de laboratório.

Não editar o workflow central nem criar callers corporativos a partir deste documento; cada mudança exige repositório-alvo, owners e revisão definidos.
