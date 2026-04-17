import { useState } from 'react'
import ProgressBar from '../components/ProgressBar'
import MoodSelector from '../components/MoodSelector'
import { BODY_FEELINGS, THOUGHT_THEMES, INTENTION_SUGGESTIONS, STEP_LABELS } from '../data/constants'

const TOTAL_STEPS = 4

// Grade de chips clicáveis para seleção única
function ChipGrid({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
      {options.map((opt, i) => {
        const selected = value === opt
        return (
          <button
            key={opt}
            onClick={() => onChange(selected ? null : opt)}
            style={{
              padding: '10px 18px',
              borderRadius: 24,
              border: `1.5px solid ${selected ? 'var(--terracotta)' : 'var(--mist)'}`,
              background: selected ? 'var(--blush)' : 'var(--parchment)',
              color: selected ? 'var(--terracotta-dark)' : 'var(--ink-light)',
              fontSize: 13,
              fontWeight: selected ? 500 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s',
              animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export default function CheckIn({ userName, onComplete }) {
  const [step, setStep] = useState(0)
  const [mood, setMood] = useState(null)
  const [bodyFeeling, setBodyFeeling] = useState(null)
  const [thoughtTheme, setThoughtTheme] = useState(null)
  const [intention, setIntention] = useState(null)
  const [intentionNote, setIntentionNote] = useState('')

  // Verifica se o step atual está completo para habilitar o botão
  const canNext = [
    mood !== null,
    bodyFeeling !== null,
    thoughtTheme !== null,
    intention !== null || intentionNote.trim() !== '',
  ][step]

  function next() {
    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1)
    } else {
      onComplete({
        mood,
        bodyFeeling,
        thoughtTheme,
        intention: intention || intentionNote.trim(),
        note: intentionNote.trim(),
      })
    }
  }

  const stepContent = [
    // Step 0 — Humor
    <div key="mood" style={{ animation: 'fadeUp 0.4s ease' }}>
      <h2 style={titleStyle}>Como está seu humor hoje?</h2>
      <p style={subtitleStyle}>Escolha o que mais representa como você se sente agora.</p>
      <MoodSelector value={mood} onChange={setMood} />
    </div>,

    // Step 1 — Corpo
    <div key="body" style={{ animation: 'fadeUp 0.4s ease' }}>
      <h2 style={titleStyle}>O que você sente no corpo?</h2>
      <p style={subtitleStyle}>Escolha a sensação que mais se destaca.</p>
      <ChipGrid options={BODY_FEELINGS} value={bodyFeeling} onChange={setBodyFeeling} />
    </div>,

    // Step 2 — Pensamento
    <div key="thought" style={{ animation: 'fadeUp 0.4s ease' }}>
      <h2 style={titleStyle}>Qual é o pensamento dominante?</h2>
      <p style={subtitleStyle}>Sobre o que sua mente tem girado mais?</p>
      <ChipGrid options={THOUGHT_THEMES} value={thoughtTheme} onChange={setThoughtTheme} />
    </div>,

    // Step 3 — Intenção
    <div key="intention" style={{ animation: 'fadeUp 0.4s ease' }}>
      <h2 style={titleStyle}>Qual é a sua intenção para hoje?</h2>
      <p style={subtitleStyle}>Escolha uma sugestão ou escreva a sua.</p>
      <ChipGrid options={INTENTION_SUGGESTIONS} value={intention} onChange={setIntention} />
      <textarea
        value={intentionNote}
        onChange={e => setIntentionNote(e.target.value)}
        placeholder="Ou escreva livremente…"
        rows={3}
        style={{
          width: '100%',
          marginTop: 16,
          padding: '12px 14px',
          borderRadius: 12,
          border: '1.5px solid var(--mist)',
          background: 'var(--parchment)',
          fontSize: 14,
          color: 'var(--ink)',
          resize: 'none',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
      />
    </div>,
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 24px',
        background: 'var(--cream)',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      {/* Cabeçalho com saudação e barra de progresso */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 16 }}>
          Olá, {userName} 🌿
        </p>
        <ProgressBar current={step} total={TOTAL_STEPS} labels={STEP_LABELS} />
      </div>

      {/* Conteúdo do step atual */}
      <div style={{ flex: 1 }}>{stepContent[step]}</div>

      {/* Botões de navegação */}
      <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={backBtnStyle}>
            Voltar
          </button>
        )}
        <button
          onClick={next}
          disabled={!canNext}
          style={{
            ...nextBtnStyle,
            flex: 1,
            background: canNext ? 'var(--terracotta)' : 'var(--mist)',
            cursor: canNext ? 'pointer' : 'not-allowed',
          }}
        >
          {step === TOTAL_STEPS - 1 ? 'Concluir' : 'Continuar'}
        </button>
      </div>
    </div>
  )
}

const titleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: 24,
  fontWeight: 600,
  color: 'var(--ink)',
  marginBottom: 8,
  lineHeight: 1.3,
}

const subtitleStyle = {
  fontSize: 14,
  color: 'var(--ink-light)',
  marginBottom: 24,
  lineHeight: 1.6,
}

const backBtnStyle = {
  padding: '16px 20px',
  borderRadius: 12,
  border: '1.5px solid var(--mist)',
  background: 'transparent',
  color: 'var(--ink-light)',
  fontSize: 14,
  cursor: 'pointer',
}

const nextBtnStyle = {
  padding: '16px',
  borderRadius: 12,
  border: 'none',
  color: 'white',
  fontSize: 15,
  fontWeight: 500,
  transition: 'background 0.2s',
}
