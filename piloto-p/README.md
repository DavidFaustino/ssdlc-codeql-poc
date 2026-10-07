# Piloto P

Este é o ponto central de planejamento para levar a PoC CodeQL do laboratório aos repositórios reais. O repositório `ssdlc-codeql-poc` mantém o workflow reutilizável e seu processamento; os repositórios de exemplo Quarkus e Angular são consumidores. A documentação local da primeira rodada preserva seu histórico e evidências, mas não substitui este plano do piloto.

**Estado:** planejamento. Nenhum repositório corporativo foi selecionado ou alterado por este diretório. O Fortify continua sendo o controle vigente durante a avaliação paralela.

## Abra primeiro

- [Plano de validação](plano-validacao.md): ordem, testes por stack e critérios de aceite.
- [Integração do workflow](integracao-workflow.md): o que já existe e o que precisa ser adaptado.
- [Registro do piloto](registro-piloto.md): seleção de repositórios, execuções e evidências, ainda sem dados corporativos.

## Relação entre as peças

```text
ssdlc-codeql-poc (central)
├── .github/workflows/codeql-reusable.yml  workflow reutilizável atual
├── actions/codeql-summary/               resumo e avaliação experimental
└── piloto-p/                               planejamento do piloto
    ├── README.md
    ├── plano-validacao.md
    ├── integracao-workflow.md
    └── registro-piloto.md

codeql-poc-quarkus                          consumidor de laboratório
codeql-poc-angular                          consumidor de laboratório
documentação local anterior                 histórico/evidências do laboratório
```

Os repositórios reais ainda não foram identificados aqui. Eles serão consumidores **candidatos**, não cópias deste repositório central. Antes de transportar o workflow, validar onde ficará sua versão no ambiente-alvo, quem poderá chamá-la e quais adaptações de Actions, runners, rede, dependências e certificados serão necessárias.

O fluxo é: selecionar repositórios reais, adaptar o workflow, validar SAST por stack, testar PR/Ruleset e comparar Ruleset com o gate atual. O [plano](plano-validacao.md) contém os critérios e o [registro](registro-piloto.md) separa previsão de resultado observado.

Não colocar URLs internas, inventário nominal, código ou achados corporativos neste repositório pessoal. O registro público usa identificadores genéricos; as evidências restritas ficam em local aprovado pela empresa.
