# 📝 Tech Challenge - Blog Application (Frontend)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Supported-2496ed.svg)

Aplicação web desenvolvida como parte do **Tech Challenge (Fase 2)**. Trata-se de uma interface interativa para gerenciamento e publicação de artigos em um blog, consumindo a API Backend RESTful do projeto.

---

## 📌 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tech Stack](#-tech-stack)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução Local](#-instalação-e-execução-local)
  - [Opção 1: Via Node.js / npm](#opção-1-via-nodejs--npm)
  - [Opção 2: Via Docker / Docker Compose](#opção-2-via-docker--docker-compose)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Integração com Backend](#-integração-com-backend)
- [Contribuição e Autores](#-contribuição-e-autores)

---

## 🚀 Visão Geral

O **tech-challenge-blog2-frontend** foi construído com foco em **desempenho**, **usabilidade** e **clean code**. A interface permite que usuários visualizem posts, leiam artigos completos, criem novos conteúdos e gerenciem publicações existentes.

---

## ✨ Funcionalidades

- 📰 **Feed de Notícias / Posts**: Listagem paginada de artigos publicados.
- 🔍 **Busca e Filtros**: Pesquisa de posts por título, categoria ou autor.
- 📝 **Criação e Edição**: Formulário para redigir e atualizar postagens.
- 👤 **Autenticação de Usuário**: Login, cadastro e gestão de tokens JWT.
- 📱 **Design Responsivo**: Layout otimizado para desktop, tablets e smartphones.

---

## 🛠️ Tech Stack

- **Linguagem**: TypeScript
- **Biblioteca Principal**: React (Vite / Next.js ou Create React App)
- **Estilização**: Tailwind CSS / Styled Components / CSS Modules
- **Gerenciamento de Estado**: React Context API / Redux Toolkit / React Query (TanStack Query)
- **Requisições HTTP**: Axios
- **Conteinerização**: Docker & Nginx (para deploy/servir os estáticos)

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (Versão `>= 18.0.0`)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) *(opcional, caso queira rodar via containers)*
- API Backend em execução (verifique o repositório `tech-challenge-blog2-backend`)

---

## 🔧 Instalação e Execução Local

### Opção 1: Via Node.js / npm

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/viniciusgodoy88/tech-challenge-blog2-frontend.git](https://github.com/viniciusgodoy88/tech-challenge-blog2-frontend.git)
   cd tech-challenge-blog2-frontend
