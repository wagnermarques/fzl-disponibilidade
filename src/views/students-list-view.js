import { LitElement, html, css } from 'lit'
import { authService, navigate } from 'fzl-fund-appshell--lit'
import { availabilityService, MODALITY_OPTIONS } from '../services/availability-service.js'

export class StudentsListView extends LitElement {
  static properties = {
    _user: { state: true },
    _records: { state: true },
    _selectedStudent: { state: true },
  }

  static styles = css`
    :host {
      display: block;
      max-width: 1140px;
      margin: 0 auto;
      padding: 20px 16px 48px;
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-family: var(--fzl-font-sans, system-ui, sans-serif);
    }

    .header-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 20px;
    }

    .header-row h2 {
      margin: 0 0 4px;
      font-size: 1.4rem;
    }

    .header-row p {
      margin: 0;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      font-size: 0.92rem;
    }

    .detail-drawer {
      margin-top: 24px;
      padding: 22px 24px;
      border-radius: 16px;
      background: var(--md-sys-color-surface, #ffffff);
      border: 2px solid var(--md-sys-color-primary, #006a6a);
      box-shadow: var(--fzl-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.08));
    }

    .detail-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
    }

    .detail-header h3 {
      margin: 0 0 4px;
      font-size: 1.2rem;
    }

    .detail-meta {
      font-size: 0.88rem;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .notes-box {
      padding: 12px 16px;
      border-radius: 10px;
      background: var(--md-sys-color-surface-container-low, #f7f2fa);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      margin-bottom: 16px;
      font-size: 0.9rem;
    }

    .auth-gate {
      max-width: 560px;
      margin: 36px auto;
      padding: 32px 28px;
      border-radius: 16px;
      background: var(--md-sys-color-surface-container-low, #f7f2fa);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      text-align: center;
    }
  `

  constructor() {
    super()
    this._user = null
    this._records = []
    this._selectedStudent = null
    this._unsubAuth = null
    this._unsubData = null
  }

  connectedCallback() {
    super.connectedCallback()
    this._unsubAuth = authService.subscribe((u) => {
      this._user = u
    })
    this._unsubData = availabilityService.subscribe((records) => {
      this._records = records
      if (this._selectedStudent) {
        this._selectedStudent =
          records.find((r) => r.userId === this._selectedStudent.userId) || null
      }
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._unsubAuth?.()
    this._unsubData?.()
  }

  _toCardItems() {
    return this._records.map((r) => {
      const entries = Object.entries(r.slots || {})
      const totalSlots = entries.length
      const prefSlots = entries.filter(([, v]) => v === 'preferred').length
      const modalityLabel =
        MODALITY_OPTIONS.find((m) => m.id === r.modalityPreference)?.label || r.modalityPreference

      return {
        id: r.userId,
        title: r.name,
        subtitle: `${r.course || 'Curso não informado'} • Matrícula: ${r.registrationId || '—'}`,
        description: `${r.notes || 'Sem observações adicionais.'} (${totalSlots} horários disponíveis, ${prefSlots} preferenciais ★)`,
        category: r.cohort,
        status: `${modalityLabel} • Máx ${r.maxWeeklyHours}h/sem`,
        priority: prefSlots >= 4 ? 'high' : totalSlots >= 6 ? 'medium' : 'low',
        date: r.updatedAt ? new Date(r.updatedAt).toISOString().slice(0, 10) : '',
        actionLabel: 'Ver Grade Semanal',
        _raw: r,
      }
    })
  }

  _handleCardSelect(e) {
    const item = e.detail?.item
    if (item?._raw) {
      this._selectedStudent = item._raw
      setTimeout(() => {
        this.renderRoot.querySelector('#student-detail-panel')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 50)
    }
  }

  render() {
    if (!this._user) {
      return html`
        <div class="auth-gate">
          <h2>🔒 Acesso Restrito</h2>
          <p>Entre na sua conta para visualizar a lista de alunos e suas grades individuais.</p>
          <fzl-lit-button variant="primary" @fzl-click=${() => navigate('conta/entrar')}>
            Entrar na Conta
          </fzl-lit-button>
        </div>
      `
    }

    const cardItems = this._toCardItems()

    return html`
      <div class="header-row">
        <div>
          <h2>👥 Alunos Respondentes (${cardItems.length})</h2>
          <p>
            Filtre, ordene e clique em qualquer aluno para inspecionar sua grade individual de disponibilidade.
          </p>
        </div>

        <div style="display:flex; gap:10px;">
          <fzl-lit-button variant="secondary" size="sm" @fzl-click=${() => navigate('painel')}>
            📊 Voltar ao Mapa de Calor
          </fzl-lit-button>
          <fzl-lit-button variant="primary" size="sm" @fzl-click=${() => navigate('')}>
            ✏️ Minha Disponibilidade
          </fzl-lit-button>
        </div>
      </div>

      <fzl-lit-card-list
        .items=${cardItems}
        layout="grid"
        allow-sort
        allow-filter
        empty-text="Nenhum aluno respondeu ainda."
        @fzl-card-click=${this._handleCardSelect}
        @fzl-card-action=${this._handleCardSelect}
      ></fzl-lit-card-list>

      ${this._selectedStudent
        ? html`
            <div id="student-detail-panel" class="detail-drawer">
              <div class="detail-header">
                <div>
                  <h3>🗓️ Grade de ${this._selectedStudent.name}</h3>
                  <div class="detail-meta">
                    ${this._selectedStudent.email} • Matrícula:
                    <strong>${this._selectedStudent.registrationId || '—'}</strong> •
                    ${this._selectedStudent.cohort}
                  </div>
                </div>
                <fzl-lit-button
                  variant="secondary"
                  size="sm"
                  @fzl-click=${() => {
                    this._selectedStudent = null
                  }}
                >
                  ✕ Fechar Grade
                </fzl-lit-button>
              </div>

              ${this._selectedStudent.notes
                ? html`<div class="notes-box">
                    <strong>Observações do aluno:</strong> ${this._selectedStudent.notes}
                  </div>`
                : ''}

              <fzl-lit-availability-grid
                mode="readonly"
                .value=${this._selectedStudent.slots || {}}
                include-weekend
              ></fzl-lit-availability-grid>
            </div>
          `
        : ''}
    `
  }
}

if (!customElements.get('students-list-view')) {
  customElements.define('students-list-view', StudentsListView)
}
