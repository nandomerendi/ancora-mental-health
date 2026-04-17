import { useState } from 'react'
import { getEntries, saveEntry } from '../utils/storage'
import { today } from '../utils/date'

export function useEntries() {
  const [entries, setEntries] = useState(() => getEntries())

  const todayEntry = entries.find(e => e.date === today()) || null

  function addEntry(entry) {
    const newEntry = { ...entry, date: today() }
    saveEntry(newEntry)
    setEntries(getEntries())
  }

  // Média de humor com uma casa decimal
  const avgMood = entries.length
    ? (entries.reduce((sum, e) => sum + e.mood, 0) / entries.length).toFixed(1)
    : null

  // Contagem por valor de humor para o gráfico de barras
  const moodDistribution = [1, 2, 3, 4, 5].map(v => ({
    value: v,
    count: entries.filter(e => e.mood === v).length,
  }))

  // Top 4 temas de pensamento mais registrados
  const themeCounts = {}
  entries.forEach(e => {
    if (e.thoughtTheme) {
      themeCounts[e.thoughtTheme] = (themeCounts[e.thoughtTheme] || 0) + 1
    }
  })
  const topThemes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([theme, count]) => ({ theme, count }))

  return { entries, todayEntry, addEntry, avgMood, moodDistribution, topThemes }
}
