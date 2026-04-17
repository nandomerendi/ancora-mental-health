import BreatheCircle from '../components/BreatheCircle'
import { MOOD_OPTIONS } from '../data/constants'
import { formatDate } from '../utils/date'

export default function Completion({ entry, userName, onHistory, onNewDay }) {
  const moodOpt = MOOD_OPTIONS.find(m => m.value === entry.mood)

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        background: 'var(--cream)',
        animation: 'fadeUp 0.6s ease',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      {/* Círculo animado */}
      <div style={{ animation: 'float 4s ease-in-out infinite' }}>
        <BreatheCircle size={110} />
      </div>

      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 28,
          fontWeight: 600,
          color: 'var(--ink)',
          marginTop: 32,
          marginBottom: 6,
          textAlign: 'center',
        }}
      >
        Check-in concluído
      </h2>

      <p
        style={{
          fontSize: 13,
          color: 'var(--ink-light)',
          marginBottom: 32,
          textAlign: 'center',
        }}
      >
        {formatDate(entry.date)}
      </p>

      {/* Resumo do check-in */}
      <div
        style={{
          width: '100%',
          maxWidth: 360,
          background: 'var(--parchment)',
          borderRadius: 20,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          marginBottom: 32,
        }}
      >
        <SummaryRow label="Humor" value={`${moodOpt?.emoji} ${moodOpt?.label}`} />
        <SummaryRow label="Corpo" value={entry.bodyFeeling} />
        <SummaryRow label="Pensamento" value={entry.thoughtTheme} />
        <SummaryRow label="Intenção" value={entry.intention} />
        {entry.note && <SummaryRow label="Nota" value={entry.note} />}
      </div>

      {/* Ações */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          width: '100%',
          maxWidth: 360,
        }}
      >
        <button onClick={onHistory} style={primaryBtn}>
          Ver histórico
        </button>
        <button onClick={onNewDay} style={secondaryBtn}>
          Novo check-in amanhã
        </button>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 16,
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: 'var(--ink-light)',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          minWidth: 80,
          paddingTop: 2,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 14,
          color: 'var(--ink)',
          textAlign: 'right',
          flex: 1,
          lineHeight: 1.4,
        }}
      >
        {value}
      </span>
    </div>
  )
}

const primaryBtn = {
  padding: '16px',
  borderRadius: 12,
  border: 'none',
  background: 'var(--terracotta)',
  color: 'white',
  fontSize: 15,
  fontWeight: 500,
  cursor: 'pointer',
}

const secondaryBtn = {
  padding: '16px',
  borderRadius: 12,
  border: '1.5px solid var(--mist)',
  background: 'transparent',
  color: 'var(--ink-light)',
  fontSize: 14,
  cursor: 'pointer',
}
