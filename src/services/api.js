/**
 * Camada de acesso a dados — tenta a API REST primeiro,
 * cai para localStorage se a API estiver offline.
 */

const API_URL = import.meta.env.VITE_API_URL || ''

// Token JWT do Supabase Auth (preenchido após login)
let _authToken = null

export function setAuthToken(token) {
  _authToken = token
}

function authHeaders() {
  return _authToken
    ? { Authorization: `Bearer ${_authToken}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' }
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw Object.assign(new Error(err.detail || res.statusText), { status: res.status })
  }
  return res.json()
}

// ------------------------------------------------------------------ //
// localStorage helpers (fallback offline)
// ------------------------------------------------------------------ //

const LS_KEYS = { ENTRIES: 'ancora_entries', USER: 'ancora_user' }

function lsGetEntries() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.ENTRIES) || '[]')
  } catch {
    return []
  }
}

function lsSaveEntry(entry) {
  const entries = lsGetEntries()
  const idx = entries.findIndex(e => e.date === entry.date)
  if (idx >= 0) entries[idx] = entry
  else entries.push(entry)
  localStorage.setItem(LS_KEYS.ENTRIES, JSON.stringify(entries))
}

function lsGetUser() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.USER) || 'null')
  } catch {
    return null
  }
}

function lsSaveUser(user) {
  localStorage.setItem(LS_KEYS.USER, JSON.stringify(user))
}

// ------------------------------------------------------------------ //
// Entries
// ------------------------------------------------------------------ //

export async function upsertEntry(entry) {
  if (!_authToken) {
    lsSaveEntry(entry)
    return entry
  }
  try {
    const saved = await apiFetch('/entries', {
      method: 'POST',
      body: JSON.stringify({
        mood: entry.mood,
        body_feeling: entry.bodyFeeling ?? entry.body_feeling ?? null,
        thought_theme: entry.thoughtTheme ?? entry.thought_theme ?? null,
        intention: entry.intention ?? null,
        note: entry.note ?? null,
      }),
    })
    // Mantém cache local sincronizado
    lsSaveEntry({ ...entry, ...saved })
    return saved
  } catch {
    lsSaveEntry(entry)
    return entry
  }
}

export async function getEntries({ limit = 30, offset = 0 } = {}) {
  if (!_authToken) return lsGetEntries()
  try {
    return await apiFetch(`/entries?limit=${limit}&offset=${offset}`)
  } catch {
    return lsGetEntries()
  }
}

export async function getTodayEntry() {
  if (!_authToken) {
    const today = new Date().toISOString().slice(0, 10)
    return lsGetEntries().find(e => e.date === today) || null
  }
  try {
    return await apiFetch('/entries/today')
  } catch (err) {
    if (err.status === 404) return null
    const today = new Date().toISOString().slice(0, 10)
    return lsGetEntries().find(e => e.date === today) || null
  }
}

// ------------------------------------------------------------------ //
// Insights
// ------------------------------------------------------------------ //

export async function getSummary() {
  if (!_authToken) return null
  try {
    return await apiFetch('/insights/summary')
  } catch {
    return null
  }
}

export async function getTrend() {
  if (!_authToken) return null
  try {
    return await apiFetch('/insights/trend')
  } catch {
    return null
  }
}

// ------------------------------------------------------------------ //
// Users
// ------------------------------------------------------------------ //

export async function createProfile({ name, email }) {
  if (!_authToken) {
    const user = { name, email, createdAt: new Date().toISOString() }
    lsSaveUser(user)
    return user
  }
  try {
    const profile = await apiFetch('/users/me', {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    })
    lsSaveUser(profile)
    return profile
  } catch {
    const user = { name, email, createdAt: new Date().toISOString() }
    lsSaveUser(user)
    return user
  }
}

export async function getProfile() {
  if (!_authToken) return lsGetUser()
  try {
    return await apiFetch('/users/me')
  } catch {
    return lsGetUser()
  }
}
