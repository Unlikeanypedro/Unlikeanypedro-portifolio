import artfinder from '../assets/projects/image-1.png'

export const projects = [
  {
    id: 1,
    date: '2026-OO',
    name: { pt: 'HOOPE', en: 'HOOPE' },
    description: {
      pt: 'O objetivo do projeto é desenvolver uma plataforma digital que facilite o descarte correto de resíduos especiais e perigosos, como medicamentos vencidos, seringas, agulhas, pilhas, baterias e equipamentos eletrônicos. A solução pretende informar os usuários sobre as formas adequadas de armazenamento e descarte, além de disponibilizar um mapa com pontos de coleta próximos, tornando o processo mais acessível, prático e seguro.',
      en: 'The project aims to develop a digital platform that facilitates the proper disposal of special and hazardous waste, such as expired medications, syringes, needles, batteries, and electronic equipment. The solution seeks to inform users about appropriate storage and disposal methods and provide a map of nearby collection points, making the process more accessible, practical, and safe.',
    },
    techs: ['React','Springboot'],
    image: null,
  },
  {
    id: 2,
    date: '2026-06',
    name: { pt: 'Drecut: Fragmentos da verdade', en: 'Drecut: Truth pieces' },
    description: {
      pt: 'Projeto final da disciplina de Introdução a Algoritmos/Programação, desenvolvido com Python e Pygame. Um detetive procura pistas para resolver mistérios e encontrar um assassino.',
      en: 'Final project for the Introduction to Algorithms/Programming course, developed using Python and Pygame. A detective searches for clues to solve mysteries and find a murderer.',
    },
    techs: ['Python','Pygame'],
    image: null,
  },
  {
    id: 3,
    date: '2026-07',
    name: { pt: 'Solidarize', en: 'Solidarize' },
    description: {
      pt: 'O projeto tem como objetivo conectar pessoas interessadas em auxiliar as comunidades em situações de vulnerabilidade com as ONGs, sendo por meio de doações, trabalho voluntário ou suporte. O software será uma plataforma de comunidades, sendo utilizadas para avisos, busca de apoio e interações com os usuários',
      en: 'The project aims to connect people interested in assisting vulnerable communities with NGOs—whether through donations, volunteer work, or other forms of support. The software will serve as a community platform used for announcements, seeking support, and user interaction.',
    },
    techs: ['HTML', 'CSS', 'JavaScript'],
    repo: 'https://solidarize.onrender.com',
    image: null,
  },
  {
    id: 4,
    date: '2026-04',
    name: { pt: 'ArtFinder', en: 'ArtFinder' },
    description: {
      pt: 'Projeto criado para facilitar a busca e autenticaçõa de obras de arte, sendo um galeria online, pareada a um museu de artes',
      en: 'A project created to facilitate the search for and authentication of artworks, functioning as an online gallery paired with an art museum.',
    },
    techs: ['HTML', 'CSS', 'JavaScript'],
    repo: 'https://github.com/Unlikeanypedro/ArtFinder',
    image: artfinder,
  }
]
