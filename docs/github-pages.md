# Deploy no GitHub Pages

Este projeto mantém o build SSR atual, mas também tem um build estático para GitHub Pages.

## 1. Configurar o repositório no GitHub

No GitHub, abra o repositório e vá em:

Settings > Pages

Em **Build and deployment**, selecione:

- Source: `GitHub Actions`

## 2. Cadastrar variáveis e secrets

No GitHub, vá em:

Settings > Secrets and variables > Actions

Em **Variables**, cadastre:

- `VITE_SUPABASE_PROJECT_ID`: `bwslltcjdinhsqkmadfz`
- `VITE_SUPABASE_URL`: URL do seu projeto Supabase
- `VITE_APP_BASE_PATH`: caminho base do GitHub Pages

Para repositório normal, use:

```txt
/nome-do-repositorio
```

Exemplo:

```txt
/transcri-o-tela-amiga
```

Para repositório do tipo `usuario.github.io`, use:

```txt
/
```

Em **Secrets**, cadastre:

- `VITE_SUPABASE_PUBLISHABLE_KEY`: chave publishable/anon do Supabase

Essa chave é pública no frontend, mas deixar em secret evita expor no histórico do workflow.
Se você cadastrou essa chave em **Variables** em vez de **Secrets**, o workflow também aceita.

## 3. Configurar URLs no Supabase

No Supabase Dashboard, vá em:

Authentication > URL Configuration

Configure **Site URL**:

```txt
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO
```

Em **Redirect URLs**, adicione:

```txt
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/**
```

Se estiver usando repositório `usuario.github.io`, use:

```txt
https://SEU_USUARIO.github.io
https://SEU_USUARIO.github.io/**
```

## 4. Desativar confirmação por e-mail

Para manter o projeto totalmente gratuito sem domínio/SMTP, desative a confirmação de e-mail no Supabase:

Authentication > Sign In / Providers > Email

Desligue:

```txt
Confirm email
```

Com isso, novos usuários são confirmados automaticamente e não recebem e-mail de confirmação.

## 5. Publicar

Faça push na branch `main`.

O workflow `.github/workflows/deploy-github-pages.yml` vai:

1. Instalar dependências.
2. Gerar o build estático em `dist/pages`.
3. Criar fallback `404.html` para rotas internas.
4. Publicar no GitHub Pages.
