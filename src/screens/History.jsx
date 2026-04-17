import { MOOD_OPTIONS } from '../data/constants'
import { formatDate, weekday } from '../utils/date'

export default function History({ entries, avgMood, moodDistribution, topThemes, onBack }) {
  const maxCount = Math.max(...moodDistribution.map(d => d.count), 1)

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '32px 24px 48px',
        background: 'var(--cream)',
        maxWidth: 480,
        margin: '0 auto',
        animation: 'fadeUp 0.5s ease',
      }}
    >
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <button onClick={onBack} style={backBtn}>←</button>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 26,
            fontWeight: 600,
            color: 'var(--ink)',
          }}
        >
          Histórico
        </h1>
      </div>

      {entries.length === 0 ? (
        <p
          style={{
            fontSize: 14,
            color: 'var(--ink-light)',
            textAlign: 'center',
            marginTop: 80,
            lineHeight: 1.6,
          }}
        >
          Nenhum check-in registrado ainda.
        </p>
      ) : (
        <>
          {/* Cards de estatísticas */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <StatCard label="Check-ins" value={entries.length} />
            <StatCard label="Humor médio" value={avgMood ? `${avgMood} / 5` : '—'} />
          </div>

          {/* Gráfico de distribuição de humor */}
          <div style={card}>
            <h3 style={sectionTitle}>Distribuição de humor</h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 8,
                height: 88,
              }}
            >
              {moodDistribution.map(d => {
                const opt = MOOD_OPTIONS.find(o => o.value === d.value)
                const barH = d.count > 0 ? Math.max((d.count / maxCount) * 72, 6) : 4
                return (
                  <div
                    key={d.value}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: barH,
                        borderRadius: 4,
                        background: d.count > 0 ? opt?.color : 'var(--mist)',
                        transition: 'height 0.5s ease',
                        opacity: d.count > 0 ? 1 : 0.4,
                      }}
                    />
                    <span style={{ fontSize: 18 }}>{opt?.emoji}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Temas frequentes */}
          {topThemes.length > 0 && (
            <div style={{ ...card, marginTop: 12 }}>
              <h3 style={sectionTitle}>Temas frequentes</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {topThemes.map(({ theme, count }) => (
                  <div
                    key={theme}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 20,
                      background: 'var(--blush)',
                      fontSize: 13,
                      color: 'var(--terracotta-dark)',
                    }}
                  >
                    {theme}{' '}
                    <span style={{ opacity: 0.65, fontSize: 12 }}>×{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de registros */}
          <h3 style={{ ...sectionTitle, marginTop: 28, marginBottom: 12 }}>Registros</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...entries].reverse().map(entry => {
              const opt = MOOD_OPTIONS.find(o => o.value === entry.mood)
              return (
                <div
                  key={entry.date}
                  style={{
                    background: 'var(--parchment)',
                    borderRadius: 14,
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 12,
                        color: 'var(--ink-light)',
                        textTransform: 'capitalize',
                        marginBottom: 4,
                      }}
                    >
                      {weekday(entry.date)} · {formatDate(entry.date)}
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        color: 'var(--ink)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {entry.bodyFeeling} · {entry.thoughtTheme}
                    </p>
                  </div>
                  <span style={{ fontSize: 26, flexShrink: 0 }}>{opt?.emoji}</span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        flex: 1,
        background: 'var(--parchment)',
        borderRadius: 16,
        padding: '20px 16px',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 30,
          fontWeight: 600,
          color: 'var(--terracotta)',
          marginBottom: 4,
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: 12, color: 'var(--ink-light)' }}>{label}</p>
    </div>
  )
}

const card = {
  background: 'var(--parchment)',
  borderRadius: 16,
  padding: '20px',
}

const sectionTitle = {
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--ink-light)',
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
  marginBottom: 14,
}

const backBtn = {
  width: 36,
  height: 36,
  borderRadius: 10,
  border: '1.5px solid var(--mist)',
  background: 'transparent',
  color: 'var(--ink)',
  fontSize: 16,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}
