// Retorna a data atual no formato YYYY-MM-DD (chave de um check-in)
export function today() {
  return new Date().toISOString().slice(0, 10)
}

// Formata YYYY-MM-DD para exibição em pt-BR (ex: "16 de abril de 2026")
export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

// Retorna o dia da semana abreviado em pt-BR (ex: "qua.")
export function weekday(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'short' })
}
