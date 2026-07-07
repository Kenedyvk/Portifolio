# DevRadar AI Fullstack

Plataforma fullstack para candidatos de tecnologia compararem suas habilidades com vagas do mercado e receberem um plano de evolução com projetos práticos.

## Ideia do produto

Muitos candidatos estudam sem saber exatamente o que falta para conseguir estágio ou vaga júnior. O DevRadar AI resolve isso cruzando:

- habilidades do candidato;
- requisitos de vagas;
- tecnologias mais cobradas;
- lacunas técnicas;
- plano de estudos e projetos para preencher essas lacunas.

## Por que esse projeto chama atenção?

Ele não é apenas uma tela bonita. É um produto com regra de negócio, banco, análise de dados e fluxo útil para recrutamento, estudantes e desenvolvedores iniciantes.

## Funcionalidades

- Cadastro de perfil técnico.
- Lista de oportunidades/vagas.
- Comparação automática de habilidades.
- Cálculo de score de compatibilidade.
- Geração de roadmap por lacuna.
- Dashboard com resultado do candidato.
- Supabase como banco e API.

## Stack

- Next.js
- TypeScript
- Supabase
- CSS Modules / CSS global
- PostgreSQL

## Como rodar

```bash
cd projects/devradar-ai-fullstack
npm install
cp .env.example .env.local
npm run dev
```

## Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica
```

## Próximos passos

- Adicionar login com Supabase Auth.
- Conectar scraping/API de vagas.
- Integrar IA para gerar roadmap automático.
- Criar ranking de habilidades mais pedidas.
- Adicionar exportação em PDF para o candidato.
