# Portfólio Cyberpunk - Vinicius Kenedy

Site de portfólio pessoal com identidade visual cyberpunk, criado para apresentar perfil profissional, serviços, projetos e formas de contato de **Vinicius Kenedy**.

Além da landing page principal em HTML, CSS e JavaScript, o repositório agora inclui três projetos de mercado para fortalecer o portfólio como desenvolvedor back-end e fullstack.

## Projetos em destaque

### 1. ResolveAI Support API

API backend para suporte técnico inteligente.

**Problema que resolve:** muitas assistências técnicas, lojas de informática e pequenas equipes de TI ainda controlam chamados por WhatsApp, planilhas ou mensagens soltas.

**O que o projeto mostra:**

- Criação de API REST.
- Validação de dados.
- Integração com Supabase/PostgreSQL.
- Controle de status de chamados.
- Métricas para dashboard.
- Base para autenticação e painel administrativo.

**Pasta:** `projects/resolveai-support-api`

**Stack:** Node.js, Express, Supabase, Zod.

---

### 2. DevRadar AI Fullstack

Aplicação fullstack para comparar habilidades de candidatos com vagas e gerar plano de evolução.

**Problema que resolve:** muitos estudantes e candidatos de tecnologia não sabem exatamente o que falta estudar para conseguir estágio ou vaga júnior.

**O que o projeto mostra:**

- Interface moderna com Next.js.
- Regra de negócio para comparação de habilidades.
- Score de compatibilidade com vaga.
- Roadmap baseado nas lacunas técnicas.
- Estrutura pronta para Supabase, autenticação e IA.

**Pasta:** `projects/devradar-ai-fullstack`

**Stack:** Next.js, TypeScript, Supabase, PostgreSQL.

---

### 3. RoomFlow Corporate

Protótipo de sistema corporativo para reserva de salas de reunião, serviços de apoio e comunicação por WhatsApp.

**Problema que resolve:** empresas frequentemente organizam salas, quantidade de participantes, videoconferência, copa e suporte de informática por mensagens separadas, aumentando o risco de conflito e esquecimento.

**O que o projeto mostra:**

- Formulário completo de reserva de sala.
- Validação de capacidade e conflito de horários.
- Opções de videoconferência e equipamentos.
- Solicitações para copa e informática.
- Mensagens de WhatsApp preparadas para cada destinatário.
- Dashboard, histórico e cancelamento de reservas.
- Persistência local para demonstração sem instalação.

**Pasta:** `projects/roomflow-corporate`

**Stack da demonstração:** HTML5, CSS3, JavaScript, LocalStorage e links `wa.me`.

## Tecnologias do portfólio principal

- HTML5
- CSS3
- JavaScript
- Google Fonts
- Boxicons

## Estrutura do projeto

```bash
Portifolio/
├── img/
├── index.html
├── style.css
├── script.js
├── README.md
└── projects/
    ├── resolveai-support-api/
    ├── devradar-ai-fullstack/
    └── roomflow-corporate/
```

## Seções do site

- **Home:** apresentação de Vinicius Kenedy.
- **About:** perfil profissional, stack e experiência.
- **Services:** serviços oferecidos.
- **Portfolio:** cards com projetos.
- **Contact:** formulário estilizado como terminal.

## Como executar o portfólio principal

```bash
git clone https://github.com/Kenedyvk/Portifolio.git
cd Portifolio
```

Depois abra o arquivo `index.html` no navegador ou use a extensão **Live Server** no VS Code.

## Como executar a API backend

```bash
cd projects/resolveai-support-api
npm install
cp .env.example .env
npm run dev
```

## Como executar o projeto fullstack

```bash
cd projects/devradar-ai-fullstack
npm install
cp .env.example .env.local
npm run dev
```

## Como executar o RoomFlow

```bash
cd projects/roomflow-corporate
```

Abra o arquivo `index.html` no navegador ou use o Live Server. Os detalhes e as limitações do protótipo estão no README da pasta.

## Melhorias futuras

- Adicionar links reais para GitHub, LinkedIn e currículo.
- Atualizar os cards do portfólio com os projetos.
- Criar deploy da API e do fullstack.
- Migrar o RoomFlow para Next.js, Supabase e WhatsApp Business Cloud API.
- Integrar WhatsApp no ResolveAI.
- Integrar IA real no DevRadar.
- Melhorar SEO e acessibilidade.
- Adicionar testes automatizados.

## Autor

Desenvolvido por **Vinicius Kenedy**.

## Licença

Este projeto está sob a licença MIT.
