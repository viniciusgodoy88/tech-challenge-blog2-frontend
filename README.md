# 💻 Tech Challenge - Blog Frontend

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

## 📌 Sobre o Projeto

O **Tech Challenge Blog Frontend** é a interface web do sistema de gerenciamento de postagens e artigos desenvolvida como parte do projeto integrador **Tech Challenge (Fase 2)**.

A aplicação foi construída visando oferecer uma experiência moderna, responsiva, acessível e performática para leitura, criação, edição e interação com artigos do blog, integrando-se via API RESTful com o backend [tech-challenge-blog2](https://github.com/viniciusgodoy88/tech-challenge-blog2).

---

## 🛠️ Tecnologias e Ferramentas

O projeto utiliza as seguintes tecnologias no ecossistema Frontend:

- **[React](https://reactjs.org/)** — Biblioteca principal para construção da interface baseada em componentes.
- **[TypeScript](https://www.typescriptlang.org/)** — Adição de tipagem estática para maior segurança e produtividade no desenvolvimento.
- **[Vite](https://vitejs.dev/)** — Build tool rápida e leve para ambiente de desenvolvimento e empacotamento de produção.
- **[Tailwind CSS](https://tailwindcss.com/)** — Framework utilitário de CSS para estilização ágil e responsiva.
- **[React Router DOM](https://reactrouter.com/)** — Gerenciamento de rotas e navegação da SPA (Single Page Application).
- **[Axios](https://axios-http.com/)** — Cliente HTTP para integração e consumo da API REST Backend.
- **[Lucide React / React Icons](https://lucide.dev/)** — Biblioteca de ícones modernos para a interface.

---

## ⚙️ Funcionalidades

### 📖 Para Leitores
- [x] **Feed de Publicações:** Listagem paginada e ordenada dos artigos mais recentes.
- [x] **Visualização de Artigo:** Leitura detalhada com suporte a formato rico/Markdown.
- [x] **Busca e Filtros:** Pesquisa por palavras-chave, categorias e tags.
- [x] **Área de Comentários:** Visualização de interações dos leitores no final do artigo.

### ✍️ Para Autores / Administradores
- [x] **Autenticação:** Login seguro de usuários (JWT Token).
- [x] **Criação e Edição:** Editor visual/Markdown para elaboração de novas postagens.
- [x] **Gestão de Postagens:** Painel administrativo (Dashboard) para criar, atualizar e remover posts (CRUD).
- [x] **Gestão de Comentários:** Moderação e resposta aos comentários.

---

## 📁 Estrutura do Projeto

```text
tech-challenge-blog2-frontend/
├── public/                 # Arquivos estáticos (favicon, imagens públicas)
├── src/
│   ├── assets/             # Imagens, ícones e fontes locais
│   ├── components/         # Componentes reutilizáveis de UI
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── PostCard/
│   │   ├── Button/
│   │   └── Input/
│   ├── contexts/           # React Contexts (ex: AuthContext, ThemeContext)
│   ├── hooks/              # Custom Hooks React (ex: useAuth, useFetch)
│   ├── pages/              # Páginas da aplicação (Home, Post, Login, Dashboard)
│   ├── services/           # Configuração de clientes HTTP e endpoints (Axios)
│   ├── styles/             # Arquivos de estil
