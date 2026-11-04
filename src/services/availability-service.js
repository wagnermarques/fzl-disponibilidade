import { syncAvailabilityToRemote } from './supabase-auth-provider.js'

const STORAGE_KEY = 'fzl-disp:availabilities:v1'
const DEMO_SEEDED_KEY = 'fzl-disp:demo-seeded:v1'

export const DEFAULT_DAYS = [
  { id: 'mon', label: 'Segunda-feira', shortLabel: 'Seg', weekend: false },
  { id: 'tue', label: 'Terça-feira', shortLabel: 'Ter', weekend: false },
  { id: 'wed', label: 'Quarta-feira', shortLabel: 'Qua', weekend: false },
  { id: 'thu', label: 'Quinta-feira', shortLabel: 'Qui', weekend: false },
  { id: 'fri', label: 'Sexta-feira', shortLabel: 'Sex', weekend: false },
  { id: 'sat', label: 'Sábado', shortLabel: 'Sáb', weekend: true },
  { id: 'sun', label: 'Domingo', shortLabel: 'Dom', weekend: true },
]

export const DEFAULT_SLOTS = [
  { id: '07:00', label: '07:00 – 08:00', period: 'morning' },
  { id: '08:00', label: '08:00 – 09:00', period: 'morning' },
  { id: '09:00', label: '09:00 – 10:00', period: 'morning' },
  { id: '10:00', label: '10:00 – 11:00', period: 'morning' },
  { id: '11:00', label: '11:00 – 12:00', period: 'morning' },
  { id: '12:00', label: '12:00 – 13:00', period: 'afternoon' },
  { id: '13:00', label: '13:00 – 14:00', period: 'afternoon' },
  { id: '14:00', label: '14:00 – 15:00', period: 'afternoon' },
  { id: '15:00', label: '15:00 – 16:00', period: 'afternoon' },
  { id: '16:00', label: '16:00 – 17:00', period: 'afternoon' },
  { id: '17:00', label: '17:00 – 18:00', period: 'afternoon' },
  { id: '18:00', label: '18:00 – 19:00', period: 'evening' },
  { id: '19:00', label: '19:00 – 20:00', period: 'evening' },
  { id: '20:00', label: '20:00 – 21:00', period: 'evening' },
  { id: '21:00', label: '21:00 – 22:00', period: 'evening' },
]

export const COHORT_OPTIONS = [
  'Turma A — Graduação (Manhã/Tarde)',
  'Turma B — Graduação (Noturno)',
  'Pós-Graduação / Mestrado',
  'Orientação / Iniciação Científica',
  'Monitoria / Grupo de Estudos',
]

export const MODALITY_OPTIONS = [
  { id: 'presencial', label: 'Presencial' },
  { id: 'remoto', label: 'Remoto (Online)' },
  { id: 'hibrido', label: 'Híbrido / Flexível' },
]

export const PERIOD_LABELS = {
  morning: 'Manhã (07h–12h)',
  afternoon: 'Tarde (12h–18h)',
  evening: 'Noite (18h–22h)',
}

const DEMO_STUDENTS = [
  {
    userId: 'demo-student-1',
    name: 'Ana Beatriz Silva',
    email: 'ana.silva@aluno.edu.br',
    registrationId: '20261014',
    course: 'Ciência da Computação',
    cohort: 'Turma B — Graduação (Noturno)',
    modalityPreference: 'hibrido',
    maxWeeklyHours: 12,
    notes: 'Estagio até as 17h30; tenho preferência pelo período noturno nas terças e quintas.',
    isDemo: true,
    updatedAt: '2026-11-03T19:20:00.000Z',
    slots: {
      'mon:19:00': 'available',
      'mon:20:00': 'available',
      'mon:21:00': 'available',
      'tue:18:00': 'available',
      'tue:19:00': 'preferred',
      'tue:20:00': 'preferred',
      'tue:21:00': 'available',
      'wed:19:00': 'available',
      'wed:20:00': 'available',
      'thu:18:00': 'available',
      'thu:19:00': 'preferred',
      'thu:20:00': 'preferred',
      'thu:21:00': 'available',
      'sat:09:00': 'available',
      'sat:10:00': 'available',
    },
  },
  {
    userId: 'demo-student-2',
    name: 'Carlos Eduardo Santos',
    email: 'carlos.santos@aluno.edu.br',
    registrationId: '20261028',
    course: 'Engenharia de Software',
    cohort: 'Turma B — Graduação (Noturno)',
    modalityPreference: 'presencial',
    maxWeeklyHours: 10,
    notes: 'Disponível todas as noites de segunda a quinta e quarta à tarde.',
    isDemo: true,
    updatedAt: '2026-11-03T20:15:00.000Z',
    slots: {
      'mon:19:00': 'preferred',
      'mon:20:00': 'preferred',
      'tue:19:00': 'preferred',
      'tue:20:00': 'preferred',
      'tue:21:00': 'available',
      'wed:14:00': 'available',
      'wed:15:00': 'available',
      'wed:19:00': 'available',
      'wed:20:00': 'available',
      'thu:19:00': 'preferred',
      'thu:20:00': 'preferred',
      'thu:21:00': 'available',
    },
  },
  {
    userId: 'demo-student-3',
    name: 'Mariana Costa Oliveira',
    email: 'mariana.oliveira@aluno.edu.br',
    registrationId: '20261055',
    course: 'Estatística Multivariada',
    cohort: 'Pós-Graduação / Mestrado',
    modalityPreference: 'remoto',
    maxWeeklyHours: 8,
    notes: 'Prefiro encontros remotos pela manhã ou terça/quinta às 19h.',
    isDemo: true,
    updatedAt: '2026-11-04T09:40:00.000Z',
    slots: {
      'mon:08:00': 'preferred',
      'mon:09:00': 'preferred',
      'mon:10:00': 'available',
      'tue:19:00': 'preferred',
      'tue:20:00': 'preferred',
      'wed:08:00': 'available',
      'wed:09:00': 'available',
      'thu:19:00': 'preferred',
      'thu:20:00': 'preferred',
      'fri:08:00': 'available',
      'fri:09:00': 'available',
    },
  },
  {
    userId: 'demo-student-4',
    name: 'Rafael Almeida Lima',
    email: 'rafael.lima@aluno.edu.br',
    registrationId: '20261089',
    course: 'Ciência da Computação',
    cohort: 'Turma A — Graduação (Manhã/Tarde)',
    modalityPreference: 'presencial',
    maxWeeklyHours: 16,
    notes: 'Manhãs livres na segunda, quarta e sexta; também posso terça e quinta às 19h.',
    isDemo: true,
    updatedAt: '2026-11-04T10:05:00.000Z',
    slots: {
      'mon:08:00': 'preferred',
      'mon:09:00': 'preferred',
      'mon:10:00': 'available',
      'mon:11:00': 'available',
      'tue:14:00': 'available',
      'tue:15:00': 'available',
      'tue:19:00': 'available',
      'tue:20:00': 'available',
      'wed:08:00': 'preferred',
      'wed:09:00': 'preferred',
      'wed:10:00': 'available',
      'thu:14:00': 'available',
      'thu:15:00': 'available',
      'thu:19:00': 'available',
      'thu:20:00': 'available',
      'fri:08:00': 'available',
      'fri:09:00': 'available',
    },
  },
  {
    userId: 'demo-student-5',
    name: 'Juliana Ferreira Mendes',
    email: 'juliana.mendes@aluno.edu.br',
    registrationId: '20261102',
    course: 'Sistemas de Informação',
    cohort: 'Orientação / Iniciação Científica',
    modalityPreference: 'hibrido',
    maxWeeklyHours: 6,
    notes: 'Disponível para reuniões de orientação nas terças e quintas à noite ou quartas pela manhã.',
    isDemo: true,
    updatedAt: '2026-11-04T11:10:00.000Z',
    slots: {
      'tue:18:00': 'available',
      'tue:19:00': 'preferred',
      'tue:20:00': 'preferred',
      'wed:08:00': 'preferred',
      'wed:09:00': 'preferred',
      'wed:10:00': 'available',
      'thu:18:00': 'available',
      'thu:19:00': 'preferred',
      'thu:20:00': 'preferred',
      'sat:09:00': 'available',
      'sat:10:00': 'available',
    },
  },
]

const listeners = new Set()

function readStorage(key, fallback) {
  try {
    const raw = globalThis.localStorage?.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  try {
    if (value === null) globalThis.localStorage?.removeItem(key)
    else globalThis.localStorage?.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn('Falha ao gravar no localStorage:', err)
  }
}

function notifyListeners() {
  const all = availabilityService.getAllRecords()
  listeners.forEach((fn) => fn(all))
}

function ensureDemoSeeded() {
  const alreadySeeded = readStorage(DEMO_SEEDED_KEY, false)
  const existing = readStorage(STORAGE_KEY, null)
  if (!alreadySeeded && (!Array.isArray(existing) || existing.length === 0)) {
    writeStorage(STORAGE_KEY, DEMO_STUDENTS)
    writeStorage(DEMO_SEEDED_KEY, true)
  }
}

export function sanitizeSlotsMap(slots) {
  if (!slots || typeof slots !== 'object') return {}
  const clean = {}
  for (const [key, val] of Object.entries(slots)) {
    if (val === 'available' || val === 'preferred') {
      clean[key] = val
    }
  }
  return clean
}

export const availabilityService = {
  subscribe(callback) {
    ensureDemoSeeded()
    listeners.add(callback)
    callback(this.getAllRecords())
    return () => listeners.delete(callback)
  },

  getAllRecords({ includeDemo = true } = {}) {
    ensureDemoSeeded()
    const list = readStorage(STORAGE_KEY, [])
    const valid = Array.isArray(list) ? list : []
    return includeDemo ? valid : valid.filter((r) => !r.isDemo)
  },

  getRecordForUser(user) {
    if (!user) return null
    const all = this.getAllRecords({ includeDemo: true })
    return (
      all.find((r) => r.userId === user.id || (user.email && r.email?.toLowerCase() === user.email.toLowerCase())) ||
      null
    )
  },

  async saveRecordForUser(user, payload) {
    if (!user?.id) {
      throw new Error('É necessário estar autenticado para salvar sua disponibilidade.')
    }
    ensureDemoSeeded()
    const all = this.getAllRecords({ includeDemo: true })
    const existingIdx = all.findIndex(
      (r) => r.userId === user.id || (user.email && r.email?.toLowerCase() === user.email.toLowerCase()),
    )

    const record = {
      userId: user.id,
      name: String(payload.name || user.name || 'Aluno').trim(),
      email: String(payload.email || user.email || '').trim().toLowerCase(),
      registrationId: String(payload.registrationId ?? '').trim(),
      course: String(payload.course ?? '').trim(),
      cohort: String(payload.cohort || COHORT_OPTIONS[0]).trim(),
      modalityPreference: MODALITY_OPTIONS.some((m) => m.id === payload.modalityPreference)
        ? payload.modalityPreference
        : 'presencial',
      maxWeeklyHours: Math.max(1, Math.min(60, Number(payload.maxWeeklyHours) || 10)),
      notes: String(payload.notes ?? '').trim(),
      slots: sanitizeSlotsMap(payload.slots),
      isDemo: false,
      updatedAt: new Date().toISOString(),
    }

    const next = [...all]
    if (existingIdx >= 0) {
      next[existingIdx] = record
    } else {
      next.unshift(record)
    }

    writeStorage(STORAGE_KEY, next)
    notifyListeners()

    // Sincronização opcional com Supabase / API REST se configurado
    try {
      await syncAvailabilityToRemote(record)
    } catch (err) {
      console.warn('Aviso: salvo localmente, mas falha ao sincronizar com servidor remoto:', err)
    }

    return record
  },

  deleteRecord(userId) {
    const all = this.getAllRecords({ includeDemo: true })
    const next = all.filter((r) => r.userId !== userId)
    writeStorage(STORAGE_KEY, next)
    notifyListeners()
  },

  hasDemoStudents() {
    return this.getAllRecords({ includeDemo: true }).some((r) => r.isDemo)
  },

  seedDemoStudents() {
    const nonDemo = this.getAllRecords({ includeDemo: false })
    writeStorage(STORAGE_KEY, [...nonDemo, ...DEMO_STUDENTS])
    writeStorage(DEMO_SEEDED_KEY, true)
    notifyListeners()
  },

  clearDemoStudents() {
    const nonDemo = this.getAllRecords({ includeDemo: false })
    writeStorage(STORAGE_KEY, nonDemo)
    writeStorage(DEMO_SEEDED_KEY, true)
    notifyListeners()
  },

  /**
   * Calcula o mapa de calor (heatmap) e estatísticas agregadas para a lista de registros.
   */
  computeHeatmap(records = [], { preferredOnly = false, includeWeekend = true } = {}) {
    const totalStudents = records.length
    const days = includeWeekend ? DEFAULT_DAYS : DEFAULT_DAYS.filter((d) => !d.weekend)
    const heatmapData = {}
    const slotRanking = []

    const byPeriodCounts = { morning: 0, afternoon: 0, evening: 0 }
    const byDayCounts = {}
    for (const day of days) {
      byDayCounts[day.id] = 0
    }

    for (const day of days) {
      for (const slot of DEFAULT_SLOTS) {
        const key = `${day.id}:${slot.id}`
        const availableStudents = []
        const preferredStudents = []
        const unavailableStudents = []

        for (const rec of records) {
          const state = rec.slots?.[key]
          if (state === 'preferred') {
            availableStudents.push(rec)
            preferredStudents.push(rec)
          } else if (state === 'available' && !preferredOnly) {
            availableStudents.push(rec)
          } else {
            unavailableStudents.push(rec)
          }
        }

        const count = availableStudents.length
        const preferredCount = preferredStudents.length

        heatmapData[key] = {
          count,
          preferredCount,
          total: totalStudents,
          names: availableStudents.map((s) => s.name),
          preferredNames: preferredStudents.map((s) => s.name),
          availableStudents,
          preferredStudents,
          unavailableStudents,
        }

        if (count > 0) {
          byPeriodCounts[slot.period] = (byPeriodCounts[slot.period] || 0) + count
          byDayCounts[day.id] = (byDayCounts[day.id] || 0) + count

          slotRanking.push({
            key,
            dayId: day.id,
            dayLabel: day.label,
            dayShortLabel: day.shortLabel,
            slotId: slot.id,
            slotLabel: slot.label,
            period: slot.period,
            count,
            preferredCount,
            total: totalStudents,
            percentage: totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0,
            names: availableStudents.map((s) => s.name),
          })
        }
      }
    }

    slotRanking.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return b.preferredCount - a.preferredCount
    })

    const bestPeriodEntry = Object.entries(byPeriodCounts).sort((a, b) => b[1] - a[1])[0]
    const bestPeriod =
      bestPeriodEntry && bestPeriodEntry[1] > 0
        ? { id: bestPeriodEntry[0], label: PERIOD_LABELS[bestPeriodEntry[0]], totalMentions: bestPeriodEntry[1] }
        : null

    const totalSlotsMarked = records.reduce((acc, r) => acc + Object.keys(r.slots || {}).length, 0)
    const avgSlotsPerStudent = totalStudents > 0 ? Math.round((totalSlotsMarked / totalStudents) * 10) / 10 : 0

    return {
      heatmapData,
      bestSlots: slotRanking.slice(0, 10),
      totalStudents,
      bestPeriod,
      avgSlotsPerStudent,
      byPeriodCounts,
      byDayCounts,
    }
  },

  exportToCSV(records = []) {
    const headers = [
      'Nome',
      'Email',
      'Matricula',
      'Curso',
      'Turma',
      'Modalidade',
      'MaxHorasSemanais',
      'TotalHorariosMarcados',
      'HorariosPreferenciais',
      'HorariosDisponiveis',
      'Observacoes',
      'AtualizadoEm',
    ]

    const escapeCsv = (val) => {
      const str = String(val ?? '')
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    const rows = records.map((r) => {
      const entries = Object.entries(r.slots || {})
      const preferredList = entries
        .filter(([, v]) => v === 'preferred')
        .map(([k]) => k)
        .join('; ')
      const availableList = entries
        .filter(([, v]) => v === 'available' || v === 'preferred')
        .map(([k]) => k)
        .join('; ')

      return [
        r.name,
        r.email,
        r.registrationId,
        r.course,
        r.cohort,
        r.modalityPreference,
        r.maxWeeklyHours,
        entries.length,
        preferredList,
        availableList,
        r.notes,
        r.updatedAt,
      ]
        .map(escapeCsv)
        .join(',')
    })

    return [headers.join(','), ...rows].join('\n')
  },

  exportToJSON(records = []) {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        totalStudents: records.length,
        records,
      },
      null,
      2,
    )
  },
}
