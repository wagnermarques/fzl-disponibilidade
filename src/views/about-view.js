import { LitElement, html, css } from 'lit'
import { navigate } from 'fzl-fund-appshell--lit'

export class AboutView extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 860px;
      margin: 0 auto;
      padding: 24px 16px 48px;
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-family: var(--fzl-font-sans, system-ui, sans-serif);
      line-height: 1.6;
    }

    .card {
      padding: 24px 28px;
      border-radius: 16px;
      background: var(--md-sys-color-surface, #ffffff);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      margin-bottom: 20px;
      box-shadow: var(--fzl-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.06));
    }

    h2 {
      margin: 0 0 10px;
      font-size: 1.45rem;
    }

    h3 {
      margin: 0 0 8px;
      font-size: 1.12rem;
      color: var(--md-sys-color-primary, #006a6a);
    }

    ul {
      margin: 8px 0 0;
      padding-left: 20px;
    }

    li {
      margin-bottom: 6px;
    }

    code {
      padding: 2px 6px;
      border-radius: 5px;
      background: var(--md-sys-color-surface-container-low, #f7f2fa);
      font-size: 0.88em;
    }
  `

  render() {
    return html`
      <div class="card">
        <h2>ℹ️ Sobre o Aplicativo de Disponibilidade de Alunos</h2>
        <p>
          O <strong>fzl-disponibilidade</strong> coleta, organiza e cruza os dias e horários disponíveis
          dos alunos autenticados para auxiliar professores e coordenadores a definir horários de aulas,
          monitorias, orientações e reposições com o maior quórum possível.
        </p>

        <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:16px;">
          <fzl-lit-button variant="primary" @fzl-click=${() => navigate('')}>
            🗓️ Preencher Minha Disponibilidade
          </fzl-lit-button>
          <fzl-lit-button variant="secondary" @fzl-click=${() => navigate('painel')}>
            📊 Abrir Mapa de Calor
          </fzl-lit-button>
        </div>
      </div>

      <div class="card">
        <h3>🧩 Arquitetura com Submódulo Git (<code>fzl-fund-ui</code>)</h3>
        <p>
          Esta aplicação utiliza o monorepo <code>fzl-fund-ui</code> como submódulo Git, combinando o
          AppShell PWA e a biblioteca de Web Components multi-engine:
        </p>
        <ul>
          <li>
            <code>&lt;app-shell&gt;</code> (<code>fzl-fund-appshell--lit</code>): Autenticação integrada
            (<code>authService</code> / <code>localProvider</code> / Supabase), rotas, acessibilidade WCAG 2.1 AA,
            4 temas (Claro, Escuro, Alto Contraste) e suporte offline PWA.
          </li>
          <li>
            <code>&lt;fzl-lit-availability-grid&gt;</code> (<code>@fzl/webcomponents-lit</code>): Novo Web Component
            criado no <code>fzl-fund-ui</code> (também disponível em Vanilla ES6 como
            <code>&lt;fzl-es6-availability-grid&gt;</code>) com modos <code>edit</code>, <code>readonly</code> e
            <code>heatmap</code>, pintura por clique/arraste e atalhos rápidos por turno.
          </li>
          <li>
            <code>&lt;fzl-lit-card-list&gt;</code>, <code>&lt;fzl-lit-button&gt;</code> e
            <code>&lt;fzl-lit-crumb&gt;</code>: Componentes de listagem filtrável/ordenável, botões e navegação
            estrutural (breadcrumbs).
          </li>
        </ul>
      </div>
    `
  }
}

if (!customElements.get('about-view')) {
  customElements.define('about-view', AboutView)
}
