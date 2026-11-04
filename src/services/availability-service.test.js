import { beforeEach, describe, expect, it } from 'vitest'
import { availabilityService, sanitizeSlotsMap } from './availability-service.js'

describe('availabilityService', () => {
  beforeEach(() => {
    const store = new Map()
    globalThis.localStorage = {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear(),
    }
  })

  it('seeds demo students on first load and filters them when includeDemo is false', () => {
    const withDemo = availabilityService.getAllRecords({ includeDemo: true })
    expect(withDemo.length).toBeGreaterThanOrEqual(5)
    expect(availabilityService.hasDemoStudents()).toBe(true)

    const withoutDemo = availabilityService.getAllRecords({ includeDemo: false })
    expect(withoutDemo.length).toBe(0)
  })

  it('sanitizes slots map to only keep available and preferred states', () => {
    const cleaned = sanitizeSlotsMap({
      'mon:08:00': 'available',
      'tue:19:00': 'preferred',
      'wed:10:00': 'unavailable',
      'fri:14:00': 'invalid',
    })
    expect(cleaned).toEqual({
      'mon:08:00': 'available',
      'tue:19:00': 'preferred',
    })
  })

  it('saves and retrieves availability record for an authenticated student', async () => {
    const user = { id: 'student-42', name: 'Lucas Pereira', email: 'lucas@aluno.edu.br' }
    const saved = await availabilityService.saveRecordForUser(user, {
      registrationId: '20269999',
      course: 'Engenharia de Software',
      cohort: 'Turma B — Graduação (Noturno)',
      modalityPreference: 'hibrido',
      maxWeeklyHours: 14,
      notes: 'Disponível nas noites de segunda e quarta.',
      slots: {
        'mon:19:00': 'preferred',
        'mon:20:00': 'available',
        'wed:19:00': 'preferred',
      },
    })

    expect(saved.userId).toBe('student-42')
    expect(saved.registrationId).toBe('20269999')
    expect(saved.isDemo).toBe(false)

    const fetched = availabilityService.getRecordForUser(user)
    expect(fetched).not.toBeNull()
    expect(fetched.slots).toEqual({
      'mon:19:00': 'preferred',
      'mon:20:00': 'available',
      'wed:19:00': 'preferred',
    })
  })

  it('computes heatmap aggregation and best common slots accurately', () => {
    const records = [
      {
        userId: 'u1',
        name: 'Aluno 1',
        slots: { 'tue:19:00': 'preferred', 'tue:20:00': 'available' },
      },
      {
        userId: 'u2',
        name: 'Aluno 2',
        slots: { 'tue:19:00': 'preferred', 'wed:08:00': 'available' },
      },
    ]

    const summary = availabilityService.computeHeatmap(records)
    expect(summary.totalStudents).toBe(2)
    expect(summary.heatmapData['tue:19:00'].count).toBe(2)
    expect(summary.heatmapData['tue:19:00'].preferredCount).toBe(2)
    expect(summary.bestSlots[0].key).toBe('tue:19:00')
    expect(summary.bestSlots[0].percentage).toBe(100)
  })

  it('exports CSV and JSON with student records', () => {
    const records = availabilityService.getAllRecords({ includeDemo: true })
    const csv = availabilityService.exportToCSV(records)
    expect(csv).toContain('Nome,Email,Matricula,Curso,Turma')
    expect(csv).toContain('Ana Beatriz Silva')

    const json = JSON.parse(availabilityService.exportToJSON(records))
    expect(json.totalStudents).toBe(records.length)
    expect(Array.isArray(json.records)).toBe(true)
  })
})
