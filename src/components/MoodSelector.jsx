import { MOOD_OPTIONS } from '../data/constants'

// Seletor de humor com 5 botões visuais
export default function MoodSelector({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
      {MOOD_OPTIONS.map((opt, i) => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '14px 12px',
              borderRadius: 16,
              border: `2px solid ${selected ? opt.color : 'transparent'}`,
              background: selected ? `${opt.color}22` : 'var(--parchment)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              animation: `fadeUp 0.35s ease ${i * 0.05}s both`,
              minWidth: 68,
            }}
          >
            <span style={{ fontSize: 26 }}>{opt.emoji}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: selected ? 500 : 400,
                color: selected ? opt.color : 'var(--ink-light)',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
