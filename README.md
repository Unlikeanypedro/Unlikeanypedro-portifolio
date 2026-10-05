# Pedro Oliveira | Portfólio Profissional

> TODO: use o template oficial da disciplina e cole as seções abaixo dentro dele:
> https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/TEMPLATES/template_README.md

## Descrição
Website de portfólio profissional com as seções Sobre mim (PT/EN), Projetos (timeline), Experiências e Contato.

## Protótipos (Figma)
<!-- TODO: exporte os wireframes e salve em docs/wireframes/ -->
![Wireframe - Sobre mim](docs/wireframes/sobre.png)
![Wireframe - Projetos](docs/wireframes/projetos.png)
![Wireframe - Experiências](docs/wireframes/experiencias.png)
![Wireframe - Contato](docs/wireframes/contato.png)

## Tecnologias
React 19, Vite, React Router, React Hook Form, EmailJS, CSS puro.

## Como rodar localmente
```bash
npm install
cp .env.example .env   # preencha as chaves do EmailJS
npm run dev
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
