// Opções de humor: 1 = muito difícil, 5 = muito bem
export const MOOD_OPTIONS = [
  { value: 1, label: 'Muito difícil', emoji: '😔', color: '#C17B5C' },
  { value: 2, label: 'Difícil',       emoji: '😕', color: '#C9A96E' },
  { value: 3, label: 'Neutro',        emoji: '😐', color: '#B8CEC0' },
  { value: 4, label: 'Bem',           emoji: '🙂', color: '#A8C5AC' },
  { value: 5, label: 'Muito bem',     emoji: '😊', color: '#7A9E7E' },
]

// Sensações corporais disponíveis no step 2
export const BODY_FEELINGS = [
  'Leveza', 'Tensão', 'Cansaço', 'Agitação',
  'Calma', 'Dor', 'Dormência', 'Acolhimento',
]

// Temas de pensamento dominante para o step 3
export const THOUGHT_THEMES = [
  'Futuro', 'Passado', 'Trabalho', 'Relações',
  'Eu mesmo', 'Saúde', 'Propósito', 'Finanças',
]

// Sugestões de intenção para o step 4
export const INTENTION_SUGGESTIONS = [
  'Ser gentil comigo',
  'Descansar quando precisar',
  'Fazer uma pausa consciente',
  'Conectar com alguém querido',
  'Mover o corpo',
  'Respirar com atenção',
  'Deixar ir o que não controlo',
  'Celebrar um pequeno progresso',
]

// Rótulos exibidos na ProgressBar
export const STEP_LABELS = ['Humor', 'Corpo', 'Pensamento', 'Intenção']
