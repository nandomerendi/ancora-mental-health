// Chaves utilizadas no localStorage
const KEYS = {
  USER:    'ancora_user',
  ENTRIES: 'ancora_entries',
}

// Persiste o usuário
export function saveUser(user) {
  localStorage.setItem(KEYS.USER, JSON.stringify(user))
}

// Recupera o usuário salvo, ou null se não existir
export function getUser() {
  const raw = localStorage.getItem(KEYS.USER)
  return raw ? JSON.parse(raw) : null
}

// Salva ou atualiza um check-in (chave única: date)
export function saveEntry(entry) {
  const entries = getEntries()
  const idx = entries.findIndex(e => e.date === entry.date)
  if (idx >= 0) {
    entries[idx] = entry
  } else {
    entries.push(entry)
  }
  localStorage.setItem(KEYS.ENTRIES, JSON.stringify(entries))
}

// Retorna todos os check-ins em ordem cronológica
export function getEntries() {
  const raw = localStorage.getItem(KEYS.ENTRIES)
  return raw ? JSON.parse(raw) : []
}
