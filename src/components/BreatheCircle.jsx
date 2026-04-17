import { theme } from '../styles/theme'

// Círculo animado de respiração com anel de pulso
export default function BreatheCircle({ size = 120, color = theme.colors.sage }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `2px solid ${color}`,
          animation: 'pulse-ring 3s ease-out infinite',
        }}
      />
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle at 40% 35%, ${color}99, ${color}44)`,
          animation: 'breathe 4s ease-in-out infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.34,
        }}
      >
        🌿
      </div>
    </div>
  )
}
