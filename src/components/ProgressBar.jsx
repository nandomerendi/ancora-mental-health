// Barra de progresso animada com rótulos dos steps
export default function ProgressBar({ current, total, labels }) {
  const pct = (current / total) * 100

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        {labels.map((label, i) => (
          <span
            key={label}
            style={{
              fontSize: 11,
              color:
                i < current
                  ? 'var(--terracotta)'
                  : i === current
                  ? 'var(--ink)'
                  : 'var(--ink-light)',
              fontWeight: i === current ? 500 : 400,
              transition: 'color 0.3s',
            }}
          >
            {label}
          </span>
        ))}
      </div>
      <div
        style={{
          height: 4,
          background: 'var(--parchment)',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: 'linear-gradient(90deg, var(--terracotta), var(--gold))',
            borderRadius: 4,
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  )
}
