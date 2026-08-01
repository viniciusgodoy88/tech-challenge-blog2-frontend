import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --fiap-pink: #ED145B;
    --fiap-pink-hover: #c40e48;
    --fiap-black: #0d0d11;
    --fiap-card-bg: rgba(24, 24, 27, 0.75);
    --border-color: rgba(255, 255, 255, 0.08);
    --text-primary: #f8fafc;
    --text-muted: #94a3b8;
    --radius: 12px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  body {
    background-color: var(--fiap-black);
    color: var(--text-primary);
    min-height: 100vh;
    /* Fundo suave com focos ambientais interativos de luz */
    background-image: 
      radial-gradient(circle at 15% 20%, rgba(237, 20, 91, 0.12) 0%, transparent 45%),
      radial-gradient(circle at 85% 80%, rgba(2, 132, 199, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(237, 20, 91, 0.04) 0%, transparent 60%);
    background-attachment: fixed;
    overflow-x: hidden;
  }

  /* Scrollbar elegante */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #0d0d11;
  }
  ::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--fiap-pink);
  }
`;