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
    title: 'Styylus Barbearia',
    subtitle: 'React · TypeScript · Supabase',
    description:
      'Experiência de agendamento criada para uma barbearia de verdade: serviços, escolha de horário e uma comunicação mais direta, com dados organizados no Supabase e atenção às regras de acesso.',
    url: 'https://github.com/Kenedyvk/Styylus',
    skills: [
      {
        icon: 'reactjs',
        alt: 'React',
        name: 'React',
      },
      {
        icon: 'typescript',
        alt: 'TypeScript',
        name: 'TypeScript',
      },
      {
        icon: 'postgres',
        alt: 'PostgreSQL',
        name: 'Supabase',
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
    title: 'NexusChat',
    subtitle: 'Node.js · Fastify · Socket.IO',
    description:
      'Base funcional para comunicação interna de equipes, com conversas em tempo real, busca, agenda de reuniões, diretório de pessoas e validações para evitar conflitos de horário.',
    url: 'https://github.com/Kenedyvk/NexusChat',
    skills: [
      {
        icon: 'nodejs',
        alt: 'Node.js',
        name: 'Node.js',
      },
      {
        icon: 'javascript',
        alt: 'JavaScript',
        name: 'JavaScript',
      },
      {
        icon: 'docker',
        alt: 'Docker',
        name: 'Docker',
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
    title: 'SEFA — Central de oportunidades',
    subtitle: 'Next.js · React · TypeScript',
    description:
      'Projeto voltado a suporte técnico e empregabilidade, reunindo chamados, oportunidades e desenvolvimento de habilidades em uma interface simples para quem está entrando na área de tecnologia.',
    url: 'https://github.com/Kenedyvk/nextjs-boilerplate',
    skills: [
      {
        icon: 'reactjs',
        alt: 'React',
        name: 'React',
      },
      {
        icon: 'typescript',
        alt: 'TypeScript',
        name: 'TypeScript',
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
