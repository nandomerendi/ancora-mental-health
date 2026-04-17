import { useState } from 'react'
import BreatheCircle from '../components/BreatheCircle'

export default function Onboarding({ onComplete }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (name.trim()) onComplete(name.trim())
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        background: 'var(--cream)',
        animation: 'fadeUp 0.6s ease',
      }}
    >
      <div style={{ animation: 'float 5s ease-in-out infinite' }}>
        <BreatheCircle size={100} />
      </div>

      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 44,
          fontWeight: 600,
          color: 'var(--ink)',
          marginTop: 32,
          marginBottom: 8,
          letterSpacing: '-0.5px',
        }}
      >
        Âncora
      </h1>

      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          color: 'var(--ink-light)',
          marginBottom: 48,
          textAlign: 'center',
          maxWidth: 280,
          lineHeight: 1.7,
        }}
      >
        Seu espaço de check-in diário de saúde mental.
      </p>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 320 }}>
        <label
          style={{
            display: 'block',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: 'var(--ink-light)',
            fontWeight: 500,
            marginBottom: 8,
          }}
        >
          Como você se chama?
        </label>

        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Seu nome"
          autoFocus
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 12,
            border: '1.5px solid var(--mist)',
            background: 'var(--parchment)',
            fontSize: 16,
            color: 'var(--ink)',
            outline: 'none',
            marginBottom: 20,
            transition: 'border-color 0.2s',
          }}
        />

        <button
          type="submit"
          disabled={!name.trim()}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 12,
            border: 'none',
            background: name.trim() ? 'var(--terracotta)' : 'var(--mist)',
            color: 'white',
            fontSize: 15,
            fontWeight: 500,
            cursor: name.trim() ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
          }}
        >
          Começar
        </button>
      </form>
    </div>
  )
}
