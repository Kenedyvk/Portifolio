import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[ResolveAI] Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

const ticketSchema = z.object({
  client_name: z.string().min(3, 'Nome precisa ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  category: z.enum(['suporte_tecnico', 'manutencao', 'desenvolvimento', 'orcamento', 'outro']).default('suporte_tecnico'),
  priority: z.enum(['baixa', 'media', 'alta', 'critica']).default('media'),
  title: z.string().min(5, 'Título muito curto'),
  description: z.string().min(10, 'Descrição muito curta')
});

const statusSchema = z.object({
  status: z.enum(['aberto', 'em_atendimento', 'resolvido', 'cancelado'])
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'ResolveAI Support API',
    timestamp: new Date().toISOString()
  });
});

app.post('/tickets', async (req, res) => {
  const parsed = ticketSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: parsed.error.flatten().fieldErrors
    });
  }

  const { data, error } = await supabase
    .from('support_tickets')
    .insert(parsed.data)
    .select('*')
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(data);
});

app.get('/tickets', async (req, res) => {
  const status = req.query.status;

  let query = supabase
    .from('support_tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

app.patch('/tickets/:id/status', async (req, res) => {
  const parsed = statusSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'Status inválido' });
  }

  const { data, error } = await supabase
    .from('support_tickets')
    .update({ status: parsed.data.status })
    .eq('id', req.params.id)
    .select('*')
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

app.get('/metrics', async (_req, res) => {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('status, priority, category');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const metrics = data.reduce(
    (acc, ticket) => {
      acc.total += 1;
      acc.by_status[ticket.status] = (acc.by_status[ticket.status] || 0) + 1;
      acc.by_priority[ticket.priority] = (acc.by_priority[ticket.priority] || 0) + 1;
      acc.by_category[ticket.category] = (acc.by_category[ticket.category] || 0) + 1;
      return acc;
    },
    { total: 0, by_status: {}, by_priority: {}, by_category: {} }
  );

  return res.json(metrics);
});

app.listen(port, () => {
  console.log(`[ResolveAI] API rodando em http://localhost:${port}`);
});
