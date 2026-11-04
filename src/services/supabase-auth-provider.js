const supabaseUrl = (import.meta.env?.VITE_SUPABASE_URL || '').replace(/\/+$/, '')
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || ''
const SESSION_STORAGE_KEY = 'fzl-disp:supabase-session:v1'

function readSession() {
  try {
    const raw = globalThis.localStorage?.getItem(SESSION_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeSession(session) {
  try {
    if (!session) globalThis.localStorage?.removeItem(SESSION_STORAGE_KEY)
    else globalThis.localStorage?.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  } catch {
    // ignore storage errors
  }
}

function mapSupabaseUser(user, fallbackName = '') {
  if (!user) return null
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || fallbackName || user.email || 'Aluno',
    createdAt: user.created_at,
  }
}

async function supabaseAuthRequest(path, { method = 'POST', body, token } = {}) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase não configurado')
  }
  const headers = {
    apikey: supabaseAnonKey,
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const res = await fetch(`${supabaseUrl}/auth/v1${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.msg || data.error_description || data.message || `Erro Supabase (${res.status})`)
  }
  return data
}

export async function syncAvailabilityToRemote(record) {
  const apiBaseUrl = (import.meta.env?.VITE_API_BASE_URL || '').replace(/\/+$/, '')
  const session = readSession()

  if (supabaseUrl && supabaseAnonKey) {
    const headers = {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${session?.access_token || supabaseAnonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    }
    await fetch(`${supabaseUrl}/rest/v1/student_availabilities`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        user_id: record.userId,
        name: record.name,
        email: record.email,
        registration_id: record.registrationId,
        course: record.course,
        cohort: record.cohort,
        modality_preference: record.modalityPreference,
        max_weekly_hours: record.maxWeeklyHours,
        notes: record.notes,
        slots: record.slots,
        updated_at: record.updatedAt,
      }),
    })
  } else if (apiBaseUrl) {
    await fetch(`${apiBaseUrl}/availabilities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify(record),
    })
  }
}

export const supabaseAuthProvider = {
  isConfigured() {
    return Boolean(supabaseUrl && supabaseAnonKey)
  },

  async signIn({ email, password }) {
    const data = await supabaseAuthRequest('/token?grant_type=password', {
      body: { email, password },
    })
    writeSession(data)
    return mapSupabaseUser(data?.user)
  },

  async signOut() {
    const session = readSession()
    if (session?.access_token) {
      await supabaseAuthRequest('/logout', { token: session.access_token }).catch(() => {})
    }
    writeSession(null)
  },

  async signUp({ name, email, password }) {
    const data = await supabaseAuthRequest('/signup', {
      body: { email, password, data: name ? { name } : undefined },
    })
    if (data?.access_token) writeSession(data)
    return mapSupabaseUser(data?.user || data, name)
  },

  async requestPasswordReset({ email, redirectTo }) {
    await supabaseAuthRequest(`/recover?redirect_to=${encodeURIComponent(redirectTo || '')}`, {
      body: { email },
    })
  },

  async changePassword({ newPassword }) {
    const session = readSession()
    if (!session?.access_token) throw new Error('Sessão expirada.')
    await supabaseAuthRequest('/user', {
      method: 'PUT',
      token: session.access_token,
      body: { password: newPassword },
    })
  },

  init({ setUser }) {
    const session = readSession()
    setUser(mapSupabaseUser(session?.user))
    const onStorage = (e) => {
      if (e.key === SESSION_STORAGE_KEY) {
        const next = readSession()
        setUser(mapSupabaseUser(next?.user))
      }
    }
    globalThis.addEventListener?.('storage', onStorage)
    return () => globalThis.removeEventListener?.('storage', onStorage)
  },

  async getAccessToken() {
    return readSession()?.access_token ?? null
  },
}
