// TODO: cadastre seus projetos. A página ordena do mais antigo ao mais recente pelo campo `date`.
// `image`: salve o arquivo em src/assets/projects/, importe aqui e use no campo:
//   import login from '../assets/projects/projeto1-login.gif'   ->   image: login
// Enquanto for null, aparece um bloco de placeholder.
export const projects = [
  {
    id: 1,
    date: '2025-03',
    name: { pt: 'Projeto 1 (nome)', en: 'Project 1 (name)' },
    description: {
      pt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    techs: ['React', 'Node.js'],
    repo: 'https://github.com/seu-usuario/projeto-1',
    image: null,
  },
  {
    id: 2,
    date: '2025-08',
    name: { pt: 'Projeto 2 (nome)', en: 'Project 2 (name)' },
    description: {
      pt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    techs: ['HTML', 'CSS', 'JavaScript'],
    repo: 'https://github.com/seu-usuario/projeto-2',
    image: null,
  },
]
