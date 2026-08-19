import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-json-ld',
  templateUrl: './json-ld.component.html',
  standalone: true,
  styleUrls: ['./json-ld.component.scss'],
})
export class JsonLdComponent implements OnInit {
  jsonLD!: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    const json = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': 'https://kenedyvk.github.io/Portifolio/#sobre',

      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://kenedyvk.github.io/Portifolio/',
      },

      name: 'Vinicius Kenedy',
      alternateName: 'Kenedyvk',
      jobTitle: 'Desenvolvedor Web Júnior',

      description:
        'Portfólio de Vinicius Kenedy, estudante de Análise e Desenvolvimento de Sistemas e desenvolvedor web em formação, com conhecimentos em Python, JavaScript, HTML5, CSS3, SQL, Docker, Git e tecnologias web.',

      about:
        'Vinicius Kenedy é estudante de Análise e Desenvolvimento de Sistemas na UNINTER, com foco em desenvolvimento web. Possui conhecimentos em Python, JavaScript, HTML5, CSS3, SQL, MySQL, SQL Server, Docker, Git, GitHub e Redes de Computadores. Também possui experiência com suporte técnico, manutenção de computadores, atendimento ao usuário e resolução de problemas.',

      nationality: 'Brasileiro',

      alumniOf: [
        {
          '@type': 'CollegeOrUniversity',
          name: 'UNINTER - Centro Universitário Internacional',
          sameAs: 'https://www.uninter.com/',
        },
      ],

      gender: 'Masculino',

      url: 'https://kenedyvk.github.io/Portifolio/',

      image: 'https://avatars.githubusercontent.com/u/180127887?v=4',

      email: 'mailto:viniciuskennedy3@gmail.com',

      sameAs: [
        'https://github.com/Kenedyvk',
        'https://www.linkedin.com/in/viniciuskennedy-17808a206',
        'https://kenedyvk.github.io/Portifolio/',
      ],

      knowsAbout: [
        'Desenvolvimento Web',
        'Python',
        'JavaScript',
        'HTML5',
        'CSS3',
        'SQL',
        'MySQL',
        'SQL Server',
        'Docker',
        'Git',
        'GitHub',
        'Redes de Computadores',
        'Suporte Técnico',
        'Manutenção de Computadores',
        'APIs',
        'Desenvolvimento de Sistemas',
      ],

      hasOccupation: [
        {
          '@type': 'Occupation',
          name: 'Desenvolvedor Web em formação',
          occupationLocation: {
            '@type': 'Country',
            name: 'Brasil',
          },
          skills: [
            'Python',
            'JavaScript',
            'HTML5',
            'CSS3',
            'SQL',
            'MySQL',
            'SQL Server',
            'Docker',
            'Git',
            'GitHub',
          ],
          description:
            'Desenvolvedor web em formação com foco na construção de aplicações, APIs e soluções digitais, buscando oportunidade como estagiário ou desenvolvedor web júnior.',
        },
        {
          '@type': 'Occupation',
          name: 'Suporte Técnico de TI',
          occupationLocation: {
            '@type': 'Country',
            name: 'Brasil',
          },
          skills: [
            'Suporte Técnico',
            'Manutenção de Computadores',
            'Atendimento ao Usuário',
            'Redes de Computadores',
            'Resolução de Problemas',
          ],
          description:
            'Experiência com suporte técnico, manutenção de computadores, atendimento ao usuário e resolução de problemas relacionados a tecnologia da informação.',
        },
      ],

      seeks: {
        '@type': 'Demand',
        name: 'Oportunidade profissional em Desenvolvimento de Software',
        description:
          'Busca oportunidades como estagiário ou Desenvolvedor Web Júnior para aplicar conhecimentos em projetos reais e continuar evoluindo profissionalmente.',
      },
    };

    this.jsonLD = this.getSafeHTML(json);
  }

  getSafeHTML(value: object): SafeHtml {
    const json = JSON.stringify(value, null, 2);
    const html =
      '<script type="application/ld+json">' +
      json +
      '</script>';

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}