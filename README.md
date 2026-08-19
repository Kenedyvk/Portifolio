# Portfólio — Vinicius Kenedy

Este é o meu portfólio profissional. A ideia foi reunir em um só lugar um pouco da minha trajetória, as tecnologias que venho estudando e os projetos que desenvolvi enquanto avanço na área de tecnologia.

🔗 **Acesse a versão publicada:** [kenedyvk.github.io/Portifolio](https://kenedyvk.github.io/Portifolio/)

## O que você encontra no site

- apresentação e objetivo profissional;
- habilidades técnicas;
- experiências profissionais;
- projetos com acesso aos repositórios;
- blog integrado ao Sanity;
- formas de contato.

O site foi pensado para funcionar bem no computador e no celular. Também inclui animações leves, navegação por seções e uma versão estática preparada para o GitHub Pages.

## Tecnologias

- Angular 21
- TypeScript e SCSS
- Angular Material
- Sanity CMS
- GitHub Actions e GitHub Pages

## Como executar localmente

```bash
npm ci
npm start
```

Depois, abra `http://localhost:4200`.

Para gerar a versão de produção usada no GitHub Pages:

```bash
npm run build -- --base-href /Portifolio/
```

## Configuração do Sanity

Os arquivos reais de ambiente não são versionados. Use `src/environments/environment.example.ts` como referência e crie:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

O workflow de publicação gera ambientes seguros com valores de fallback para que o portfólio continue compilando mesmo sem uma conexão ativa com o CMS.

## Por que fiz este projeto

Eu queria uma apresentação que fosse além de um currículo em PDF. O portfólio me permite mostrar o que estou aprendendo, registrar minha evolução e tornar meus projetos mais fáceis de conhecer.

Se quiser trocar uma ideia sobre o projeto, pode me chamar pelo [LinkedIn](https://www.linkedin.com/in/viniciuskennedy-17808a206).
