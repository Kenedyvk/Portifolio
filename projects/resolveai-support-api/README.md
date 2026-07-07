# ResolveAI Support API

API backend para suporte técnico inteligente. A ideia é resolver uma dor real de lojas de informática, assistências técnicas e equipes de TI: receber chamados, classificar prioridade, organizar SLA e gerar uma primeira triagem automática.

## Por que esse projeto é forte para o mercado?

Muitas empresas ainda controlam suporte por WhatsApp, planilha ou conversa solta. Esse backend mostra domínio de API, banco, validação, segurança, status de atendimento e regra de negócio.

## Funcionalidades

- Cadastro de chamados técnicos.
- Classificação por categoria e prioridade.
- Status: aberto, em atendimento, resolvido e cancelado.
- Integração com Supabase/PostgreSQL.
- Validação de dados com Zod.
- Estrutura pronta para autenticação e painel administrativo.
- Endpoint de métricas para dashboard.

## Stack

- Node.js
- Express
- Supabase
- Zod
- Dotenv
- CORS

## Como rodar

```bash
cd projects/resolveai-support-api
npm install
cp .env.example .env
npm run dev
```

## Variáveis de ambiente

```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
PORT=3333
```

## Rotas

```http
GET /health
POST /tickets
GET /tickets
PATCH /tickets/:id/status
GET /metrics
```

## Próximos passos

- Adicionar autenticação JWT.
- Criar painel admin.
- Integrar WhatsApp.
- Adicionar IA para resumir problema e sugerir solução.
- Criar testes automatizados.
