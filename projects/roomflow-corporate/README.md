# RoomFlow Corporate

Protótipo front-end de um sistema corporativo para reserva de salas de reunião, visualização em calendário, solicitação de serviços de apoio e comunicação por e-mail.

## Funcionalidades incluídas

- Calendário mensal com as reservas confirmadas.
- Navegação entre meses e destaque do dia atual.
- Clique em uma data para iniciar uma nova reserva.
- Cadastro de reserva com responsável, e-mail, data e horários.
- Três salas com capacidades diferentes.
- Validação da capacidade de participantes.
- Bloqueio de reservas com conflito de horário na mesma sala.
- Opção de videoconferência, plataforma, link e equipamentos.
- Solicitação de apoio da equipe de informática.
- Solicitação de apoio da copa e seleção dos itens necessários.
- Código único de confirmação da reserva.
- Painel com indicadores, salas disponíveis e próxima reunião.
- Histórico de reservas com cancelamento.
- Configuração dos e-mails da copa e da informática.
- Mensagens prontas para usuário, copa e informática.
- Abertura do rascunho no Gmail ou no cliente padrão, como o Zimbra.
- Armazenamento das reservas e configurações no `localStorage`.

## Como executar

Não é necessário instalar dependências.

1. Abra a pasta `projects/roomflow-corporate`.
2. Abra o arquivo `index.html` no navegador.
3. Para uma experiência melhor, abra a pasta no VS Code e use a extensão Live Server.

## Como testar os e-mails

1. Vá até a seção **Destinatários de e-mail**.
2. Informe os e-mails da copa e da informática.
3. Selecione o modo **Gmail** ou **Cliente padrão / Zimbra**.
4. Crie uma reserva e informe o e-mail do responsável.
5. Após a confirmação, use os botões para abrir os rascunhos de cada destinatário.

### Gmail

O sistema abre uma nova mensagem no Gmail com destinatário, assunto e corpo já preenchidos.

### Zimbra

O modo **Cliente padrão / Zimbra** utiliza um link `mailto:`. Para abrir diretamente no Zimbra, configure o Zimbra ou o navegador como aplicativo padrão para links de e-mail.

## Limitação desta versão

Esta é uma demonstração somente de front-end. Ela prepara e abre o rascunho, mas ainda exige que a pessoa clique em **Enviar**.

Para envio automático em produção será necessário implementar:

- back-end em Next.js/Node.js;
- banco PostgreSQL/Supabase;
- autenticação e perfis de acesso;
- Gmail API, OAuth e uma conta autorizada; ou
- SMTP do Zimbra fornecido pela organização;
- fila de notificações e registro de envio;
- variáveis de ambiente para proteger credenciais;
- tratamento de falhas e tentativas de reenvio.

## Arquivos principais

- `index.html`: interface, formulário, calendário e configurações.
- `style.css`: estilos gerais do protótipo.
- `calendar-email.css`: estilos do calendário e dos botões de e-mail.
- `app-email-calendar.js`: reservas, validações, calendário e preparação dos e-mails.

## Próxima versão sugerida

Migrar a interface para Next.js e TypeScript, criar tabelas para salas, reservas, solicitações de apoio e notificações, e integrar o Gmail ou o servidor SMTP do Zimbra em rotas executadas somente no servidor.
