interface Project {
  title: string;
  subtitle: string;
  description: string;
  url?: string;
  skills: {
    icon: string;
    alt: string;
    name?: string;
  }[];
  size: 'featured' | 'standard' | 'placeholder';
}

export const PROJECTS: Project[] = [
  {
    title: 'AgSUS - Sistema de Estudos',
    subtitle: 'HTML · CSS · JavaScript · IA',
    description:
      'Sistema de estudos desenvolvido para o processo seletivo AgSUS, com painel do edital, organização de conteúdos, dados estruturados em JSON e chat de suporte com funcionamento offline e integração opcional com IA.',
    url: 'https://github.com/Kenedyvk/AGSUS',
    skills: [
      {
        icon: 'html5',
        alt: 'HTML5',
        name: 'HTML5',
      },
      {
        icon: 'css3',
        alt: 'CSS3',
        name: 'CSS3',
      },
      {
        icon: 'javascript',
        alt: 'JavaScript',
        name: 'JavaScript',
      },
      {
        icon: 'github',
        alt: 'GitHub',
        name: 'GitHub',
      },
    ],
    size: 'featured',
  },

  {
    title: 'MM Eventos',
    subtitle: 'HTML · CSS · JavaScript',
    description:
      'Projeto web voltado à apresentação e divulgação de eventos, desenvolvido com tecnologias front-end e publicado no GitHub.',
    url: 'https://github.com/Kenedyvk/vivamm.com.br',
    skills: [
      {
        icon: 'html5',
        alt: 'HTML5',
        name: 'HTML5',
      },
      {
        icon: 'css3',
        alt: 'CSS3',
        name: 'CSS3',
      },
      {
        icon: 'javascript',
        alt: 'JavaScript',
        name: 'JavaScript',
      },
    ],
    size: 'standard',
  },

  {
    title: 'Portfólio Desenvolvedor',
    subtitle: 'Angular · TypeScript · SCSS',
    description:
      'Meu portfólio profissional, desenvolvido em Angular, com interface responsiva, animações, apresentação de habilidades, experiência profissional, projetos e canais de contato.',
    url: 'https://github.com/Kenedyvk/Portifolio',
    skills: [
      {
        icon: 'angular',
        alt: 'Angular',
        name: 'Angular',
      },
      {
        icon: 'typescript',
        alt: 'TypeScript',
        name: 'TypeScript',
      },
      {
        icon: 'scss',
        alt: 'SCSS',
        name: 'SCSS',
      },
      {
        icon: 'git',
        alt: 'Git',
        name: 'Git',
      },
    ],
    size: 'standard',
  },

  {
    title: 'Next.js - Estudos',
    subtitle: 'Next.js · React · JavaScript',
    description:
      'Projeto utilizado para estudos e experimentação com Next.js e React, explorando a estrutura de aplicações web modernas e desenvolvimento front-end.',
    url: 'https://github.com/Kenedyvk/nextjs-boilerplate',
    skills: [
      {
        icon: 'reactjs',
        alt: 'React',
        name: 'React',
      },
      {
        icon: 'javascript',
        alt: 'JavaScript',
        name: 'JavaScript',
      },
      {
        icon: 'github',
        alt: 'GitHub',
        name: 'GitHub',
      },
    ],
    size: 'standard',
  },
];