# Disponibilidade de Alunos (`fzl-disponibilidade`)

Aplicação web progressiva (PWA) para coleta, visualização e cruzamento da **disponibilidade de dias e horários dos alunos**, construída sobre o monorepo [`fzl-fund-ui`](https://github.com/wagnermarques/fzl-fund-ui) integrado como submódulo Git (`fzl-fund-appshell--lit` + `@fzl/webcomponents-lit` + `@fzl/design-tokens`).

## Principais Funcionalidades

- **Autenticação Obrigatória (`authService` do AppShell)**:
  - Usa por padrão o `localProvider` do AppShell para desenvolvimento/demonstração (com botão de **Acesso Rápido em 1 clique** na tela inicial) e suporta **Supabase Auth** automaticamente quando `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configurados no `.env`.
- **Visão do Aluno (`#/minha-disponibilidade`)**:
  - Cadastro de Matrícula/RA, Curso/Disciplina, Turma/Grupo, Modalidade Preferida (`Presencial`, `Remoto`, `Híbrido`), Carga Horária Semanal Máxima e Observações.
  - **Grade Semanal Interativa (`<fzl-lit-availability-grid mode="edit">`)**:
    - Marcação por clique ou arraste (`pointerdown` + `pointerenter`) com 3 estados: **Disponível**, **Preferencial ★** e **Indisponível**.
    - Atalhos rápidos por turno (**☀️ Manhã 07h–12h**, **🌤️ Tarde 12h–18h**, **🌙 Noite 18h–22h**, **📅 Dias Úteis**, **🗑️ Limpar Tudo**) e clique no cabeçalho de dia (coluna inteira) ou faixa de horário (linha inteira).
- **Visão do Professor / Coordenador (`#/painel` e `#/alunos`)**:
  - **Mapa de Calor (`<fzl-lit-availability-grid mode="heatmap">`)** cruzando a disponibilidade de todos os alunos filtrados por Turma, Modalidade, Busca textual ou Apenas Horários Preferenciais ★.
  - **Inspeção de Horário**: Ao clicar em qualquer célula do mapa de calor, exibe a lista nominal de alunos disponíveis (destacando os que marcaram como ★ Preferencial) e indisponíveis naquele horário.
  - **Ranking dos Melhores Horários em Comum**: Top faixas horárias com maior quórum na turma.
  - **Lista de Alunos Respondentes (`<fzl-lit-card-list>`)**: Cards ordenáveis e filtráveis com visualização individual da grade semanal de cada aluno (`mode="readonly"`).
  - **Exportação**: Download imediato dos dados filtrados em **CSV** ou **JSON**.

## Como Executar

```bash
# 1. Instalar dependências (incluindo workspaces do submódulo fzl-fund-ui)
npm install

# 2. Rodar testes unitários
npm test

# 3. Iniciar servidor de desenvolvimento
npm run dev

# 4. Gerar build de produção (compila os Web Components + aplicação Vite)
npm run build
```
