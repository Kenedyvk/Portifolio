# RoomFlow Corporate

Protótipo front-end de um sistema corporativo para reserva de salas de reunião, solicitação de serviços de apoio e comunicação por WhatsApp.

## Funcionalidades incluídas

- Cadastro de reserva com responsável, telefone, data e horários.
- Três salas com capacidades diferentes.
- Validação da capacidade de participantes.
- Bloqueio de reservas com conflito de horário na mesma sala.
- Opção de videoconferência, plataforma, link e equipamentos.
- Solicitação de apoio da equipe de informática.
- Solicitação de apoio da copa e seleção dos itens necessários.
- Código único de confirmação da reserva.
- Painel com indicadores, salas disponíveis e próxima reunião.
- Histórico de reservas com cancelamento.
- Configuração dos números da copa e da informática.
- Mensagens prontas para usuário, copa e informática por links `wa.me`.
- Armazenamento das reservas no `localStorage` do navegador.

## Como executar

Não é necessário instalar dependências.

1. Abra a pasta `projects/roomflow-corporate`.
2. Abra o arquivo `index.html` no navegador.
3. Para uma experiência melhor, abra a pasta no VS Code e use a extensão Live Server.

## Como testar o WhatsApp

1. Vá até a seção **Destinatários do WhatsApp**.
2. Informe os telefones da copa e da informática com país, DDD e número, somente dígitos.
3. Crie uma reserva e informe também o telefone do responsável.
4. Após a confirmação, use os botões para abrir as mensagens preenchidas no WhatsApp.

Exemplo de número brasileiro:

```text
5561999999999
```

## Limitação desta versão

Esta é uma demonstração front-end. Ela abre o WhatsApp com a mensagem pronta, mas ainda exige que a pessoa clique em **Enviar**.

Para envio automático em produção será necessário implementar:

- back-end em Next.js/Node.js;
- banco PostgreSQL/Supabase;
- autenticação e perfis de acesso;
- WhatsApp Business Cloud API;
- templates de mensagens aprovados;
- consentimento dos destinatários;
- webhook para acompanhar respostas e status;
- variáveis de ambiente para proteger os tokens.

## Próxima versão sugerida

Migrar a interface para Next.js e TypeScript, criar tabelas para salas, reservas, solicitações de apoio e notificações, e integrar a Cloud API em rotas executadas somente no servidor.
