import { LitElement, html, css } from 'lit'
import { authService, navigate, notificationService } from 'fzl-fund-appshell--lit'
import {
  availabilityService,
  COHORT_OPTIONS,
  MODALITY_OPTIONS,
} from '../services/availability-service.js'

export class StudentAvailabilityView extends LitElement {
  static properties = {
    _user: { state: true },
    _registrationId: { state: true },
    _course: { state: true },
    _cohort: { state: true },
    _modalityPreference: { state: true },
    _maxWeeklyHours: { state: true },
    _notes: { state: true },
    _slots: { state: true },
    _includeWeekend: { state: true },
    _lastSavedAt: { state: true },
    _dirty: { state: true },
    _saving: { state: true },
    _feedback: { state: true },
    _demoLoading: { state: true },
  }

  static styles = css`
    :host {
      display: block;
      max-width: 1120px;
      margin: 0 auto;
      padding: 20px 16px 48px;
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-family: var(--fzl-font-sans, system-ui, sans-serif);
    }

    .auth-gate {
      max-width: 580px;
      margin: 36px auto;
      padding: 32px 28px;
      border-radius: 16px;
      background: var(--md-sys-color-surface-container-low, #f7f2fa);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      text-align: center;
      box-shadow: var(--fzl-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.08));
    }

    .auth-gate-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin: 0 auto 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--md-sys-color-primary-container, #b2dfdb);
      color: var(--md-sys-color-on-primary-container, #003737);
      font-size: 32px;
    }

    .auth-gate h2 {
      margin: 0 0 10px;
      font-size: 1.5rem;
    }

    .auth-gate p {
      margin: 0 0 24px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      line-height: 1.55;
    }

    .auth-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      margin-bottom: 16px;
    }

    .demo-divider {
      margin: 20px 0 14px;
      font-size: 0.85rem;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .banner-card {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 20px 24px;
      border-radius: 14px;
      background: var(--md-sys-color-surface-container-low, #f7f2fa);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      margin-bottom: 20px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--md-sys-color-primary, #006a6a);
      color: var(--md-sys-color-on-primary, #ffffff);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.15rem;
      flex-shrink: 0;
    }

    .user-meta h2 {
      margin: 0 0 4px;
      font-size: 1.2rem;
    }

    .user-meta p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .status-badges {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .badge-saved {
      background: rgba(16, 185, 129, 0.15);
      color: #047857;
      border: 1px solid rgba(16, 185, 129, 0.35);
    }

    .badge-pending {
      background: rgba(245, 158, 11, 0.16);
      color: #b45309;
      border: 1px solid rgba(245, 158, 11, 0.35);
    }

    .section-card {
      padding: 22px 24px;
      border-radius: 14px;
      background: var(--md-sys-color-surface, #ffffff);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      margin-bottom: 20px;
      box-shadow: var(--fzl-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.06));
    }

    .section-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
    }

    .section-header h3 {
      margin: 0;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-subtitle {
      margin: 4px 0 0;
      font-size: 0.875rem;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .field label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .field input,
    .field select,
    .field textarea {
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--md-sys-color-outline, #79747e);
      background: var(--md-sys-color-surface, #ffffff);
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-family: inherit;
      font-size: 0.95rem;
    }

    .field input:focus,
    .field select:focus,
    .field textarea:focus {
      outline: 2px solid var(--md-sys-color-primary, #006a6a);
      border-color: transparent;
    }

    .toggle-row {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      user-select: none;
    }

    .toggle-row input {
      width: 18px;
      height: 18px;
      accent-color: var(--md-sys-color-primary, #006a6a);
    }

    .footer-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 24px;
      border-radius: 14px;
      background: var(--md-sys-color-surface-container-low, #f7f2fa);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    }

    .footer-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
    }

    .feedback-toast {
      padding: 12px 16px;
      border-radius: 10px;
      margin-bottom: 16px;
      font-weight: 500;
      font-size: 0.92rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .feedback-success {
      background: rgba(16, 185, 129, 0.14);
      color: #065f46;
      border: 1px solid rgba(16, 185, 129, 0.4);
    }

    .feedback-error {
      background: rgba(220, 38, 38, 0.12);
      color: #991b1b;
      border: 1px solid rgba(220, 38, 38, 0.35);
    }
  `

  constructor() {
    super()
    this._user = null
    this._registrationId = ''
    this._course = ''
    this._cohort = COHORT_OPTIONS[0]
    this._modalityPreference = 'presencial'
    this._maxWeeklyHours = 12
    this._notes = ''
    this._slots = {}
    this._includeWeekend = true
    this._lastSavedAt = null
    this._dirty = false
    this._saving = false
    this._feedback = null
    this._demoLoading = false
    this._unsubAuth = null
  }

  connectedCallback() {
    super.connectedCallback()
    this._unsubAuth = authService.subscribe((user) => {
      this._user = user
      if (user) {
        this._loadStudentData(user)
      }
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._unsubAuth?.()
  }

  _loadStudentData(user) {
    const rec = availabilityService.getRecordForUser(user)
    if (rec) {
      this._registrationId = rec.registrationId || ''
      this._course = rec.course || ''
      this._cohort = rec.cohort || COHORT_OPTIONS[0]
      this._modalityPreference = rec.modalityPreference || 'presencial'
      this._maxWeeklyHours = rec.maxWeeklyHours || 12
      this._notes = rec.notes || ''
      this._slots = { ...(rec.slots || {}) }
      this._lastSavedAt = rec.updatedAt || null
      this._dirty = false
    } else {
      this._registrationId = ''
      this._course = ''
      this._cohort = COHORT_OPTIONS[0]
      this._modalityPreference = 'presencial'
      this._maxWeeklyHours = 12
      this._notes = ''
      this._slots = {}
      this._lastSavedAt = null
      this._dirty = false
    }
  }

  async _handleQuickDemoLogin() {
    this._demoLoading = true
    this._feedback = null
    try {
      const demoEmail = 'aluno.demo@escola.edu.br'
      const demoPass = 'demo1234'
      let user = null
      try {
        user = await authService.signIn({ email: demoEmail, password: demoPass })
      } catch {
        user = await authService.signUp({
          name: 'Aluno Demonstração',
          email: demoEmail,
          password: demoPass,
        })
      }
      if (user && !availabilityService.getRecordForUser(user)) {
        await availabilityService.saveRecordForUser(user, {
          registrationId: '20261234',
          course: 'Engenharia de Software',
          cohort: COHORT_OPTIONS[1],
          modalityPreference: 'hibrido',
          maxWeeklyHours: 12,
          notes: 'Disponível principalmente à noite (Seg a Qui) e sábado pela manhã.',
          slots: {
            'mon:19:00': 'available',
            'mon:20:00': 'available',
            'tue:19:00': 'preferred',
            'tue:20:00': 'preferred',
            'thu:19:00': 'preferred',
            'thu:20:00': 'preferred',
            'sat:09:00': 'available',
            'sat:10:00': 'available',
          },
        })
        this._loadStudentData(user)
      }
    } catch (err) {
      this._feedback = { type: 'error', message: err.message || 'Falha ao iniciar conta de demonstração.' }
    } finally {
      this._demoLoading = false
    }
  }

  _onGridChange(e) {
    const nextValue = e.detail?.value || {}
    this._slots = { ...nextValue }
    this._dirty = true
  }

  async _handleSave() {
    if (!this._user) return
    this._saving = true
    this._feedback = null
    try {
      const saved = await availabilityService.saveRecordForUser(this._user, {
        name: this._user.name,
        email: this._user.email,
        registrationId: this._registrationId,
        course: this._course,
        cohort: this._cohort,
        modalityPreference: this._modalityPreference,
        maxWeeklyHours: this._maxWeeklyHours,
        notes: this._notes,
        slots: this._slots,
      })
      this._lastSavedAt = saved.updatedAt
      this._dirty = false
      const totalMarked = Object.keys(saved.slots || {}).length
      this._feedback = {
        type: 'success',
        message: `Disponibilidade salva com sucesso! (${totalMarked} horários registrados)`,
      }
      notificationService?.notify?.({
        title: 'Disponibilidade atualizada',
        body: `Seus ${totalMarked} horários disponíveis foram salvos com sucesso.`,
      })
    } catch (err) {
      this._feedback = {
        type: 'error',
        message: err.message || 'Não foi possível salvar sua disponibilidade.',
      }
    } finally {
      this._saving = false
    }
  }

  _handleExportMySchedule() {
    const data = {
      student: {
        name: this._user?.name,
        email: this._user?.email,
        registrationId: this._registrationId,
        course: this._course,
        cohort: this._cohort,
        modalityPreference: this._modalityPreference,
        maxWeeklyHours: this._maxWeeklyHours,
      },
      notes: this._notes,
      slots: this._slots,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `minha-disponibilidade-${this._registrationId || 'aluno'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  _renderUnauthenticated() {
    return html`
      <div class="auth-gate">
        <div class="auth-gate-icon">📅</div>
        <h2>Disponibilidade de Dias e Horários</h2>
        <p>
          Olá, aluno(a)! Para preencher ou atualizar seus dias e horários disponíveis para aulas,
          orientações ou monitorias, é necessário entrar com a sua conta.
        </p>

        <div class="auth-actions">
          <fzl-lit-button variant="primary" size="lg" @fzl-click=${() => navigate('conta/entrar')}>
            Entrar na Minha Conta
          </fzl-lit-button>
          <fzl-lit-button variant="secondary" size="lg" @fzl-click=${() => navigate('conta/criar')}>
            Criar Conta de Aluno
          </fzl-lit-button>
        </div>

        <div class="demo-divider">— ou teste agora mesmo no modo demonstração —</div>

        <fzl-lit-button
          variant="secondary"
          size="md"
          ?disabled=${this._demoLoading}
          @fzl-click=${this._handleQuickDemoLogin}
        >
          ⚡ Entrar com Conta de Demonstração (1 clique)
        </fzl-lit-button>

        ${this._feedback
          ? html`<div class="feedback-toast feedback-error" style="margin-top:16px;">
              ${this._feedback.message}
            </div>`
          : ''}
      </div>
    `
  }

  render() {
    if (!this._user) {
      return this._renderUnauthenticated()
    }

    const initials = (this._user.name || 'A')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('')

    const slotEntries = Object.entries(this._slots || {})
    const totalAvailable = slotEntries.length
    const totalPreferred = slotEntries.filter(([, v]) => v === 'preferred').length

    return html`
      ${this._feedback
        ? html`
            <div
              class="feedback-toast ${this._feedback.type === 'error'
                ? 'feedback-error'
                : 'feedback-success'}"
              role="status"
            >
              <span>${this._feedback.message}</span>
              <fzl-lit-button
                variant="secondary"
                size="sm"
                @fzl-click=${() => {
                  this._feedback = null
                }}
              >
                Fechar
              </fzl-lit-button>
            </div>
          `
        : ''}

      <div class="banner-card">
        <div class="user-info">
          <div class="avatar">${initials}</div>
          <div class="user-meta">
            <h2>${this._user.name}</h2>
            <p>${this._user.email}</p>
          </div>
        </div>

        <div class="status-badges">
          ${this._lastSavedAt && !this._dirty
            ? html`<span class="badge badge-saved">
                ✓ Salvo em ${new Date(this._lastSavedAt).toLocaleString('pt-BR')}
              </span>`
            : html`<span class="badge badge-pending">
                ● ${this._dirty ? 'Alterações não salvas' : 'Aguardando envio'}
              </span>`}
          <fzl-lit-button variant="secondary" size="sm" @fzl-click=${() => navigate('painel')}>
            📊 Ver Mapa de Calor da Turma
          </fzl-lit-button>
        </div>
      </div>

      <section class="section-card" aria-labelledby="sec-academic">
        <div class="section-header">
          <div>
            <h3 id="sec-academic">🎓 1. Dados Acadêmicos e Preferências</h3>
            <p class="section-subtitle">
              Informe sua turma, matrícula e preferência de modalidade para facilitar a organização dos horários.
            </p>
          </div>
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="inp-matricula">Matrícula / RA</label>
            <input
              id="inp-matricula"
              type="text"
              placeholder="Ex.: 20261042"
              .value=${this._registrationId}
              @input=${(e) => {
                this._registrationId = e.target.value
                this._dirty = true
              }}
            />
          </div>

          <div class="field">
            <label for="inp-course">Curso / Disciplina</label>
            <input
              id="inp-course"
              type="text"
              placeholder="Ex.: Ciência da Computação"
              .value=${this._course}
              @input=${(e) => {
                this._course = e.target.value
                this._dirty = true
              }}
            />
          </div>

          <div class="field">
            <label for="sel-cohort">Turma / Grupo</label>
            <select
              id="sel-cohort"
              .value=${this._cohort}
              @change=${(e) => {
                this._cohort = e.target.value
                this._dirty = true
              }}
            >
              ${COHORT_OPTIONS.map(
                (c) => html`<option value=${c} ?selected=${this._cohort === c}>${c}</option>`,
              )}
            </select>
          </div>

          <div class="field">
            <label for="sel-modality">Modalidade Preferida</label>
            <select
              id="sel-modality"
              .value=${this._modalityPreference}
              @change=${(e) => {
                this._modalityPreference = e.target.value
                this._dirty = true
              }}
            >
              ${MODALITY_OPTIONS.map(
                (m) =>
                  html`<option value=${m.id} ?selected=${this._modalityPreference === m.id}>
                    ${m.label}
                  </option>`,
              )}
            </select>
          </div>

          <div class="field">
            <label for="inp-hours">Carga Horária Semanal Máx. (h)</label>
            <input
              id="inp-hours"
              type="number"
              min="1"
              max="60"
              .value=${String(this._maxWeeklyHours)}
              @input=${(e) => {
                this._maxWeeklyHours = Number(e.target.value) || 10
                this._dirty = true
              }}
            />
          </div>
        </div>
      </section>

      <section class="section-card" aria-labelledby="sec-grid">
        <div class="section-header">
          <div>
            <h3 id="sec-grid">🗓️ 2. Grade Semanal de Disponibilidade</h3>
            <p class="section-subtitle">
              Selecione o pincel (<strong>Disponível</strong> ou <strong>Preferencial ★</strong>), clique ou arraste
              pelas células, ou use os atalhos por turno (Manhã, Tarde, Noite) e cabeçalhos de dia/horário.
            </p>
          </div>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._includeWeekend}
              @change=${(e) => {
                this._includeWeekend = e.target.checked
              }}
            />
            Exibir Sábado e Domingo
          </label>
        </div>

        <fzl-lit-availability-grid
          mode="edit"
          .value=${this._slots}
          .includeWeekend=${this._includeWeekend}
          show-quick-actions
          @fzl-availability-change=${this._onGridChange}
        ></fzl-lit-availability-grid>
      </section>

      <section class="section-card" aria-labelledby="sec-notes">
        <div class="section-header">
          <div>
            <h3 id="sec-notes">💬 3. Observações ou Restrições de Horário</h3>
            <p class="section-subtitle">
              Opcional: detalhe restrições de deslocamento, trabalho/estágio ou preferências específicas.
            </p>
          </div>
        </div>

        <div class="field">
          <textarea
            rows="3"
            placeholder="Ex.: Saio do estágio às 18h; nas terças e quintas consigo chegar às 18h30."
            .value=${this._notes}
            @input=${(e) => {
              this._notes = e.target.value
              this._dirty = true
            }}
          ></textarea>
        </div>
      </section>

      <div class="footer-bar">
        <div>
          <strong>Resumo atual:</strong> ${totalAvailable} horário(s) marcado(s), sendo
          <strong>${totalPreferred}</strong> preferencial(is) ★
        </div>

        <div class="footer-actions">
          <fzl-lit-button variant="secondary" size="md" @fzl-click=${this._handleExportMySchedule}>
            ⬇️ Exportar Meu Horário (JSON)
          </fzl-lit-button>
          <fzl-lit-button
            variant="primary"
            size="lg"
            ?disabled=${this._saving}
            @fzl-click=${this._handleSave}
          >
            ${this._saving ? 'Salvando...' : '💾 Salvar Minha Disponibilidade'}
          </fzl-lit-button>
        </div>
      </div>
    `
  }
}

if (!customElements.get('student-availability-view')) {
  customElements.define('student-availability-view', StudentAvailabilityView)
}
