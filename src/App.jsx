import { useState, useEffect } from 'react'
import { useUser } from './hooks/useUser'
import { useEntries } from './hooks/useEntries'
import { globalStyles } from './styles/theme'
import Onboarding from './screens/Onboarding'
import CheckIn from './screens/CheckIn'
import Completion from './screens/Completion'
import History from './screens/History'

// Injeta estilos globais (variáveis CSS + animações) no <head>
function GlobalStyles() {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = globalStyles
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])
  return null
}

export default function App() {
  const { user, createUser } = useUser()
  const { entries, todayEntry, addEntry, avgMood, moodDistribution, topThemes } = useEntries()
  const [screen, setScreen] = useState(null)

  // Determina a tela inicial com base no estado do usuário e do check-in de hoje
  useEffect(() => {
    if (!user) {
      setScreen('onboarding')
    } else if (todayEntry) {
      setScreen('completion')
    } else {
      setScreen('checkin')
    }
  }, [user, todayEntry])

  function handleOnboardingComplete(name) {
    createUser(name)
    setScreen('checkin')
  }

  function handleCheckInComplete(data) {
    addEntry(data)
    setScreen('completion')
  }

  if (!screen) return null

  return (
    <>
      <GlobalStyles />

      {screen === 'onboarding' && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {screen === 'checkin' && (
        <CheckIn userName={user?.name} onComplete={handleCheckInComplete} />
      )}

      {screen === 'completion' && todayEntry && (
        <Completion
          entry={todayEntry}
          userName={user?.name}
          onHistory={() => setScreen('history')}
          onNewDay={() => setScreen('checkin')}
        />
      )}

      {screen === 'history' && (
        <History
          entries={entries}
          avgMood={avgMood}
          moodDistribution={moodDistribution}
          topThemes={topThemes}
          onBack={() => setScreen(todayEntry ? 'completion' : 'checkin')}
        />
      )}
    </>
  )
}
