# Resend + Supabase Auth

Este projeto usa o Resend como SMTP para os e-mails do Supabase Auth.

## Variáveis necessárias

Configure no ambiente local ou no seu provedor de deploy:

```sh
RESEND_API_KEY="re_..."
SUPABASE_ACCESS_TOKEN="sbp_..."
SUPABASE_PROJECT_REF="bwslltcjdinhsqkmadfz"
SUPABASE_SMTP_FROM_EMAIL="no-reply@seudominio.com"
SUPABASE_SMTP_SENDER_NAME="SmartFlowFinance"
```

O `SUPABASE_SMTP_FROM_EMAIL` precisa usar um domínio verificado no Resend.

## Aplicar no Supabase hospedado

```sh
npm run supabase:configure-resend
```

Depois confira no Dashboard do Supabase:

Authentication > Email > SMTP Settings

Credenciais usadas:

- Host: `smtp.resend.com`
- Port: `465`
- Username: `resend`
- Password: `RESEND_API_KEY`
