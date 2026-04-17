export const theme = {
  colors: {
    cream: '#F5F0E8',
    parchment: '#EDE6D6',
    terracotta: '#C17B5C',
    terracottaDark: '#9E6047',
    sage: '#7A9E7E',
    sageLight: '#A8C5AC',
    moss: '#4A6741',
    ink: '#2C2416',
    inkLight: '#5C4F3A',
    mist: '#B8CEC0',
    blush: '#E8C4B0',
    gold: '#C9A96E',
  },
  fonts: {
    display: "'Playfair Display', serif",
    body: "'DM Sans', sans-serif",
  },
}

export const globalStyles = `
  :root {
    --cream: #F5F0E8;
    --parchment: #EDE6D6;
    --terracotta: #C17B5C;
    --terracotta-dark: #9E6047;
    --sage: #7A9E7E;
    --sage-light: #A8C5AC;
    --moss: #4A6741;
    --ink: #2C2416;
    --ink-light: #5C4F3A;
    --mist: #B8CEC0;
    --blush: #E8C4B0;
    --gold: #C9A96E;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: var(--cream);
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  input, textarea {
    font-family: inherit;
  }

  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.12); }
  }

  @keyframes pulse-ring {
    0% { transform: scale(0.85); opacity: 0.8; }
    100% { transform: scale(2); opacity: 0; }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideRight {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
`
