import { LitElement, html, css } from 'lit'
import { authService, navigate } from 'fzl-fund-appshell--lit'
import {
  availabilityService,
  COHORT_OPTIONS,
  DEFAULT_DAYS,
  DEFAULT_SLOTS,
  MODALITY_OPTIONS,
} from '../services/availability-service.js'

export class TeacherDashboardView extends LitElement {
  static properties = {
    _user: { state: true },
    _records: { state: true },
    _cohortFilter: { state: true },
    _modalityFilter: { state: true },
    _searchQuery: { state: true },
    _preferredOnly: { state: true },
    _includeWeekend: { state: true },
    _includeDemo: { state: true },
    _selectedCellKey: { state: true },
  }

  static styles = css`
    :host {
      display: block;
      max-width: 1180px;
      margin: 0 auto;
      padding: 20px 16px 48px;
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-family: var(--fzl-font-sans, system-ui, sans-serif);
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
      font-size: 1.45rem;
    }

    .header-row p {
      margin: 0;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      font-size: 0.92rem;
    }

    .export-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
      margin-bottom: 20px;
    }

    .kpi-card {
      padding: 18px 20px;
      border-radius: 14px;
      background: var(--md-sys-color-surface, #ffffff);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      box-shadow: var(--fzl-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.06));
    }

    .kpi-label {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      margin-bottom: 6px;
    }

    .kpi-value {
      font-size: 1.55rem;
      font-weight: 700;
      color: var(--md-sys-color-primary, #006a6a);
      margin-bottom: 4px;
    }

    .kpi-sub {
      font-size: 0.84rem;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .filters-card {
      padding: 18px 20px;
      border-radius: 14px;
      background: var(--md-sys-color-surface-container-low, #f7f2fa);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      margin-bottom: 20px;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 14px;
      margin-bottom: 14px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .field label {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .field input,
    .field select {
      padding: 9px 12px;
      border-radius: 8px;
      border: 1px solid var(--md-sys-color-outline, #79747e);
      background: var(--md-sys-color-surface, #ffffff);
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-size: 0.9rem;
    }

    .toggles-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding-top: 10px;
      border-top: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    }

    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
    }

    .checkbox-label {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-size: 0.88rem;
      cursor: pointer;
      user-select: none;
    }

    .checkbox-label input {
      width: 17px;
      height: 17px;
      accent-color: var(--md-sys-color-primary, #006a6a);
    }

    .dashboard-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 20px;
      align-items: start;
    }

    @media (max-width: 980px) {
      .dashboard-layout {
        grid-template-columns: 1fr;
      }
    }

    .panel-card {
      padding: 20px 22px;
      border-radius: 14px;
      background: var(--md-sys-color-surface, #ffffff);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      box-shadow: var(--fzl-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.06));
      margin-bottom: 20px;
    }

    .panel-card h3 {
      margin: 0 0 6px;
      font-size: 1.08rem;
    }

    .panel-subtitle {
      margin: 0 0 14px;
      font-size: 0.85rem;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .inspector-empty {
      padding: 24px 16px;
      text-align: center;
      border-radius: 10px;
      background: var(--md-sys-color-surface-container-low, #f7f2fa);
      color: var(--md-sys-color-on-surface-variant, #49454f);
      font-size: 0.9rem;
    }

    .student-pill-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 10px;
      max-height: 260px;
      overflow-y: auto;
    }

    .student-pill {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      background: var(--md-sys-color-surface-container-low, #f7f2fa);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      font-size: 0.86rem;
    }

    .student-pill strong {
      display: block;
    }

    .student-pill small {
      color: var(--md-sys-color-on-surface-variant, #49454f);
      font-size: 0.76rem;
    }

    .star-tag {
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 0.74rem;
      font-weight: 700;
      background: rgba(245, 158, 11, 0.18);
      color: #b45309;
      white-space: nowrap;
    }

    .avail-tag {
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 0.74rem;
      font-weight: 600;
      background: rgba(16, 185, 129, 0.16);
      color: #047857;
      white-space: nowrap;
    }

    .ranking-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .ranking-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      background: var(--md-sys-color-surface-container-low, #f7f2fa);
      cursor: pointer;
      transition: transform 0.12s ease, border-color 0.12s ease;
    }

    .ranking-item:hover {
      transform: translateY(-1px);
      border-color: var(--md-sys-color-primary, #006a6a);
    }

    .ranking-item.active {
      border: 2px solid var(--md-sys-color-primary, #006a6a);
      background: rgba(0, 106, 106, 0.08);
    }

    .ranking-badge {
      font-weight: 700;
      font-size: 0.85rem;
      color: var(--md-sys-color-primary, #006a6a);
    }
  `

  constructor() {
    super()
    this._user = null
    this._records = []
    this._cohortFilter = 'all'
    this._modalityFilter = 'all'
    this._searchQuery = ''
    this._preferredOnly = false
    this._includeWeekend = true
    this._includeDemo = true
    this._selectedCellKey = 'tue:19:00'
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
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._unsubAuth?.()
    this._unsubData?.()
  }

  _getFilteredRecords() {
    const base = this._includeDemo ? this._records : this._records.filter((r) => !r.isDemo)
    const q = this._searchQuery.trim().toLowerCase()

    return base.filter((r) => {
      if (this._cohortFilter !== 'all' && r.cohort !== this._cohortFilter) return false
      if (this._modalityFilter !== 'all' && r.modalityPreference !== this._modalityFilter) return false
      if (q) {
        const matchName = r.name?.toLowerCase().includes(q)
        const matchCourse = r.course?.toLowerCase().includes(q)
        const matchReg = r.registrationId?.toLowerCase().includes(q)
        const matchEmail = r.email?.toLowerCase().includes(q)
        if (!matchName && !matchCourse && !matchReg && !matchEmail) return false
      }
      return true
    })
  }

  _downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  _handleExportCSV(records) {
    const csv = availabilityService.exportToCSV(records)
    this._downloadFile(csv, 'disponibilidade-alunos.csv', 'text/csv;charset=utf-8;')
  }

  _handleExportJSON(records) {
    const json = availabilityService.exportToJSON(records)
    this._downloadFile(json, 'disponibilidade-alunos.json', 'application/json')
  }

  render() {
    if (!this._user) {
      return html`
        <div class="auth-gate">
          <h2>🔒 Acesso Restrito a Usuários Autenticados</h2>
          <p>
            Faça login na sua conta para visualizar o mapa de calor de disponibilidade das turmas e cruzar horários.
          </p>
          <div style="display:flex; gap:12px; justify-content:center; margin-top:20px;">
            <fzl-lit-button variant="primary" @fzl-click=${() => navigate('conta/entrar')}>
              Entrar na Conta
            </fzl-lit-button>
            <fzl-lit-button variant="secondary" @fzl-click=${() => navigate('')}>
              Ir para Visão do Aluno
            </fzl-lit-button>
          </div>
        </div>
      `
    }

    const filteredRecords = this._getFilteredRecords()
    const stats = availabilityService.computeHeatmap(filteredRecords, {
      preferredOnly: this._preferredOnly,
      includeWeekend: this._includeWeekend,
    })

    const topSlot = stats.bestSlots[0] || null
    const selectedCell = this._selectedCellKey ? stats.heatmapData[this._selectedCellKey] : null
    const [selDayId, selSlotId] = (this._selectedCellKey || '').split(':')
    const selDayObj = DEFAULT_DAYS.find((d) => d.id === selDayId)
    const selSlotObj = DEFAULT_SLOTS.find((s) => s.id === selSlotId)

    return html`
      <div class="header-row">
        <div>
          <h2>📊 Mapa de Calor & Cruzamento de Horários</h2>
          <p>
            Identifique rapidamente os dias e horários com maior quórum de alunos disponíveis.
          </p>
        </div>

        <div class="export-actions">
          <fzl-lit-button variant="secondary" size="sm" @fzl-click=${() => navigate('alunos')}>
            👥 Lista de Alunos (${filteredRecords.length})
          </fzl-lit-button>
          <fzl-lit-button
            variant="secondary"
            size="sm"
            @fzl-click=${() => this._handleExportCSV(filteredRecords)}
          >
            ⬇️ Exportar CSV
          </fzl-lit-button>
          <fzl-lit-button
            variant="primary"
            size="sm"
            @fzl-click=${() => this._handleExportJSON(filteredRecords)}
          >
            ⬇️ Exportar JSON
          </fzl-lit-button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Alunos Filtrados</div>
          <div class="kpi-value">${stats.totalStudents}</div>
          <div class="kpi-sub">
            ${this._includeDemo ? 'Incluindo dados de demonstração' : 'Apenas cadastros reais'}
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-label">Melhor Horário Comum</div>
          <div class="kpi-value">
            ${topSlot ? `${topSlot.dayShortLabel} • ${topSlot.slotId}` : '—'}
          </div>
          <div class="kpi-sub">
            ${topSlot
              ? `${topSlot.count}/${topSlot.total} alunos (${topSlot.percentage}%) • ${topSlot.preferredCount} ★`
              : 'Sem horários compatíveis'}
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-label">Turno Mais Viável</div>
          <div class="kpi-value">${stats.bestPeriod ? stats.bestPeriod.label.split(' ')[0] : '—'}</div>
          <div class="kpi-sub">
            ${stats.bestPeriod
              ? `${stats.bestPeriod.label} (${stats.bestPeriod.totalMentions} marcações)`
              : 'Nenhuma marcação'}
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-label">Média de Horários / Aluno</div>
          <div class="kpi-value">${stats.avgSlotsPerStudent}h</div>
          <div class="kpi-sub">Disponibilidade média semanal informada</div>
        </div>
      </div>

      <div class="filters-card">
        <div class="filters-grid">
          <div class="field">
            <label for="f-cohort">Filtrar por Turma / Grupo</label>
            <select
              id="f-cohort"
              .value=${this._cohortFilter}
              @change=${(e) => {
                this._cohortFilter = e.target.value
              }}
            >
              <option value="all">Todas as Turmas (${this._records.length})</option>
              ${COHORT_OPTIONS.map((c) => html`<option value=${c}>${c}</option>`)}
            </select>
          </div>

          <div class="field">
            <label for="f-modality">Modalidade Preferida</label>
            <select
              id="f-modality"
              .value=${this._modalityFilter}
              @change=${(e) => {
                this._modalityFilter = e.target.value
              }}
            >
              <option value="all">Todas as Modalidades</option>
              ${MODALITY_OPTIONS.map((m) => html`<option value=${m.id}>${m.label}</option>`)}
            </select>
          </div>

          <div class="field">
            <label for="f-search">Buscar Aluno / Curso / Matrícula</label>
            <input
              id="f-search"
              type="search"
              placeholder="Ex.: Ana, Computação, 2026..."
              .value=${this._searchQuery}
              @input=${(e) => {
                this._searchQuery = e.target.value
              }}
            />
          </div>
        </div>

        <div class="toggles-row">
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                .checked=${this._preferredOnly}
                @change=${(e) => {
                  this._preferredOnly = e.target.checked
                }}
              />
              Considerar apenas horários <strong>Preferenciais ★</strong>
            </label>

            <label class="checkbox-label">
              <input
                type="checkbox"
                .checked=${this._includeWeekend}
                @change=${(e) => {
                  this._includeWeekend = e.target.checked
                }}
              />
              Incluir Sábado e Domingo
            </label>

            <label class="checkbox-label">
              <input
                type="checkbox"
                .checked=${this._includeDemo}
                @change=${(e) => {
                  this._includeDemo = e.target.checked
                }}
              />
              Exibir alunos de demonstração
            </label>
          </div>

          <fzl-lit-button
            variant="secondary"
            size="sm"
            @fzl-click=${() => {
              availabilityService.seedDemoStudents()
              this._includeDemo = true
            }}
          >
            🔄 Restaurar Alunos Demo
          </fzl-lit-button>
        </div>
      </div>

      <div class="dashboard-layout">
        <div class="panel-card">
          <h3>🔥 Grade de Mapa de Calor Semanal</h3>
          <p class="panel-subtitle">
            Clique em qualquer célula da grade para inspecionar quais alunos podem (ou não podem) naquele horário.
          </p>

          <fzl-lit-availability-grid
            mode="heatmap"
            .heatmapData=${stats.heatmapData}
            .includeWeekend=${this._includeWeekend}
            .selectedKey=${this._selectedCellKey}
            @fzl-cell-select=${(e) => {
              this._selectedCellKey = e.detail?.key || ''
            }}
          ></fzl-lit-availability-grid>
        </div>

        <div>
          <div class="panel-card">
            <h3>🔍 Inspeção do Horário</h3>
            ${selectedCell && selDayObj && selSlotObj
              ? html`
                  <p class="panel-subtitle">
                    <strong>${selDayObj.label}</strong> • ${selSlotObj.label}
                  </p>
                  <div style="margin-bottom: 12px; font-size: 0.9rem;">
                    <strong>${selectedCell.count} de ${selectedCell.total}</strong> aluno(s) disponível(is)
                    (${selectedCell.total > 0
                      ? Math.round((selectedCell.count / selectedCell.total) * 100)
                      : 0}%)
                    ${selectedCell.preferredCount > 0
                      ? html` • <span class="star-tag">★ ${selectedCell.preferredCount} preferencial</span>`
                      : ''}
                  </div>

                  <div style="font-size: 0.82rem; font-weight: 700; margin-top: 10px;">
                    ✓ Alunos Disponíveis (${selectedCell.availableStudents?.length || 0})
                  </div>
                  ${selectedCell.availableStudents?.length
                    ? html`
                        <div class="student-pill-list">
                          ${selectedCell.availableStudents.map((st) => {
                            const isPref = st.slots?.[this._selectedCellKey] === 'preferred'
                            return html`
                              <div class="student-pill">
                                <div>
                                  <strong>${st.name}</strong>
                                  <small>${st.course || st.cohort}</small>
                                </div>
                                ${isPref
                                  ? html`<span class="star-tag">★ Preferencial</span>`
                                  : html`<span class="avail-tag">Disponível</span>`}
                              </div>
                            `
                          })}
                        </div>
                      `
                    : html`<div class="inspector-empty" style="margin-top:8px;">
                        Nenhum aluno disponível neste horário.
                      </div>`}

                  ${selectedCell.unavailableStudents?.length
                    ? html`
                        <div style="font-size: 0.82rem; font-weight: 700; margin-top: 16px;">
                          ✕ Indisponíveis neste horário (${selectedCell.unavailableStudents.length})
                        </div>
                        <div class="student-pill-list" style="max-height: 150px;">
                          ${selectedCell.unavailableStudents.map(
                            (st) => html`
                              <div class="student-pill" style="opacity: 0.75;">
                                <div>
                                  <strong>${st.name}</strong>
                                  <small>${st.cohort}</small>
                                </div>
                              </div>
                            `,
                          )}
                        </div>
                      `
                    : ''}
                `
              : html`
                  <div class="inspector-empty">
                    Clique em qualquer célula do mapa de calor ao lado para ver a lista de alunos disponíveis.
                  </div>
                `}
          </div>

          <div class="panel-card">
            <h3>🏆 Melhores Horários em Comum</h3>
            <p class="panel-subtitle">Top horários com maior quórum na turma filtrada:</p>

            ${stats.bestSlots.length
              ? html`
                  <div class="ranking-list">
                    ${stats.bestSlots.slice(0, 6).map(
                      (slot, idx) => html`
                        <div
                          class="ranking-item ${this._selectedCellKey === slot.key ? 'active' : ''}"
                          @click=${() => {
                            this._selectedCellKey = slot.key
                          }}
                        >
                          <div>
                            <div style="font-weight: 600; font-size: 0.9rem;">
                              #${idx + 1} ${slot.dayLabel} • ${slot.slotLabel}
                            </div>
                            <div style="font-size: 0.78rem; color: var(--md-sys-color-on-surface-variant);">
                              ${slot.preferredCount} preferencial(is) ★
                            </div>
                          </div>
                          <div class="ranking-badge">
                            ${slot.count}/${slot.total} (${slot.percentage}%)
                          </div>
                        </div>
                      `,
                    )}
                  </div>
                `
              : html`<div class="inspector-empty">Nenhuma disponibilidade registrada.</div>`}
          </div>
        </div>
      </div>
    `
  }
}

if (!customElements.get('teacher-dashboard-view')) {
  customElements.define('teacher-dashboard-view', TeacherDashboardView)
}
