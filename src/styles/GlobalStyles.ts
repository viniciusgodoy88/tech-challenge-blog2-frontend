import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --fiap-pink: #ED145B;
    --fiap-pink-hover: #c40e48;
    --fiap-black: #0d0d0d;
    --fiap-dark-gray: #1a1a1a;
    --fiap-light-gray: #f4f4f6;
    --fiap-card-bg: #ffffff;
    --text-main: #1f2937;
    --text-muted: #6b7280;
    --border: #e5e7eb;
    --radius: 8px;
    --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  body {
    background-color: var(--fiap-light-gray);
    color: var(--text-main);
    line-height: 1.6;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    font-family: inherit;
    border: none;
  }
`;