# Piloto P

Este é o ponto central de planejamento para levar a PoC CodeQL do laboratório aos repositórios reais. O repositório `ssdlc-codeql-poc` mantém o workflow reutilizável e seu processamento; os repositórios de exemplo Quarkus e Angular são consumidores. A documentação local da primeira rodada preserva seu histórico e evidências, mas não substitui este plano do piloto.

**Estado:** planejamento. Nenhum repositório corporativo foi selecionado ou alterado por este diretório. O Fortify continua sendo o controle vigente durante a avaliação paralela.

## Relação entre as peças

```text
ssdlc-codeql-poc (central)
├── .github/workflows/codeql-reusable.yml  workflow reutilizável atual
├── actions/codeql-summary/               resumo e avaliação experimental
└── piloto-p/README.md                     planejamento do piloto

codeql-poc-quarkus                          consumidor de laboratório
codeql-poc-angular                          consumidor de laboratório
documentação local anterior                 histórico/evidências do laboratório
```

Os repositórios reais ainda não foram identificados aqui. Eles serão consumidores **candidatos**, não cópias deste repositório central. Antes de transportar o workflow, validar onde ficará sua versão no ambiente-alvo, quem poderá chamá-la e quais adaptações de Actions, runners, rede, dependências e certificados serão necessárias.

## Ordem de validação

1. **Inventariar e escolher repositórios reais por stack.** Registrar repositório, responsável, linguagem, build, workflow de entrada e referência usada, runner, dependências internas e autorização para o piloto. Não inventar nomes nem usar repositórios de configuração como substitutos de repositórios de código.
2. **Portar o workflow em modo de observação.** Partir do workflow já testado neste repositório, fixado por SHA. Adaptar os perfis corporativos sem presumir que o workflow atual, limitado a `java` e `angular`, já cobre as demais stacks. Manter Fortify em paralelo no mesmo commit para comparação.
3. **Validar SAST por arquétipo.** Java/Quarkus; Angular/TypeScript; Node.js/npm; Go; Python/PySpark; Rust. Para cada um, registrar build, conclusão da análise, cobertura observada, SARIF/alertas, tempo, custo e diferenças diante do Fortify. Shell/scripts e workflows GitHub Actions exigem avaliação separada de cobertura; não marcar como cobertos por CodeQL sem teste.
4. **Validar a experiência no PR.** Num repositório piloto autorizado, testar CodeQL em PR e um Ruleset controlado com os atributos acordados com os responsáveis pela segurança e pela plataforma CI/CD. Confirmar a diferença entre achado, check e bloqueio de merge; reanalisar o mesmo PR após correção. Não aplicar regra à organização inteira nesta etapa.
5. **Comparar as duas opções de decisão.** (A) Ruleset no PR; (B) resultado do CodeQL traduzido para o contrato existente do security gate. Verificar qual opção garante rastreabilidade do commit aprovado até a release, sem decidir a política definitiva nesta PoC.

## Registro mínimo por repositório

| Campo | Preenchimento esperado |
|---|---|
| Identificação | URL interna, time responsável, tipo: código ou Ops |
| Stack e build | Linguagem, framework, versão, comando, dependências internas |
| CI existente | Workflow de entrada, ref/tag/branch, runner, jobs de segurança |
| Execução CodeQL | PR/commit, run, perfil, conclusão, duração, SARIF/alertas |
| Comparação | Resultado Fortify no mesmo commit, diferenças e limitações |
| Decisão | Observação, Ruleset testado, gate testado, pendências e responsável |

Guardar URLs internas, inventário nominal e relatórios corporativos apenas em local aprovado pela empresa. Este repositório pessoal não deve receber código ou achados internos do ambiente-alvo.

## Critério para avançar

- [ ] Existe ao menos um repositório real autorizado para cada arquétipo aplicável.
- [ ] A execução e a evidência de cada stack foram registradas, inclusive falhas técnicas e lacunas de cobertura.
- [ ] O teste de PR/Ruleset foi feito com escopo restrito e resultado reproduzível.
- [ ] As opções Ruleset e security gate foram comparadas com o fluxo real de release.
- [ ] Os responsáveis pela segurança e pela plataforma CI/CD validaram a decisão antes de qualquer mudança no bloqueio vigente.
