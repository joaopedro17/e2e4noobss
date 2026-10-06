# 4.3 - Credenciais e segredos

Senha no código do teste vai parar no git, no log do CI, no print de falha. O e2e foi feito para que isso não aconteça.

## Declarando uma conta

No `e2e.config.ts`, a conta tem um nome; o **valor** vem do ambiente:

```ts
credentials: {
  demo: {
    username: process.env.E2E_USER_DEMO_USERNAME ?? '',
    password: () => process.env.E2E_USER_DEMO_PASSWORD ?? '',
  },
},
```

- A senha como **função** só é lida na hora de preencher. Assim comandos que não fazem login (`e2e list`, testes sem login) não falham quando a variável não está definida.
- Uma senha precisa ter pelo menos 6 caracteres; vazia dá `AUTH_CREDENTIAL_UNAVAILABLE` na hora do `fill`.
- `E2E_USER_<NOME>_USERNAME` e `E2E_USER_<NOME>_PASSWORD` sobrescrevem a conta sempre, mesmo sem você ler no config. `<NOME>` é o nome em maiúsculas.

## Usando no teste

```ts
import { credentials } from 'e2e';

test('login', async ({ app, screen }) => {
  const demo = credentials.user('demo');
  await app.open();
  await screen.getByLabel('E-mail').fill(demo.username);
  await screen.getByLabel('Senha').fill(demo.password); // um Secret, não uma string
  await screen.getByRole('button', 'Entrar').tap();
});
```

`demo.password` é um **Secret**: não dá para imprimir nem concatenar. Só `fill()` e `agent.act` aceitam. Ele aparece como `demo.password` nos relatórios.

Depois que um segredo é digitado, o e2e **para de tirar prints** naquele teste (e `app.screenshot()` passa a ser negado). Nada de senha vazando numa imagem.

## Outros segredos

Chave de API, token: use `secrets`.

```ts
secrets: { 'api-key': process.env.API_KEY ?? '' },
```

```ts
import { secrets } from 'e2e';
await screen.getByLabel('Token').fill(secrets.get('api-key'));
```

## O arquivo .env

O e2e **não lê** `.env` sozinho. Coloque no topo do `e2e.config.ts`:

```ts
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const envFile = fileURLToPath(new URL('.env', import.meta.url));
if (existsSync(envFile)) process.loadEnvFile(envFile);
```

E garanta no `.gitignore`:

```
.env
```

Versione um `.env.example` com os nomes das variáveis e valores vazios, para quem chegar depois saber o que preencher. No CI, as mesmas variáveis vêm dos segredos do pipeline (veja [5.3](../5-Avancado/3-CI-CD.md)).

## Sessões (só web)

No navegador dá para fazer login **uma vez** e reaproveitar em vários testes:

```ts
// tests/auth.setup.e2e.ts
test.setup('login como demo', { sessions: ['demo'] }, async ({ app, screen, session }) => {
  /* ...login... */
  await session.save('demo');
});

// em outro teste
test('painel', { session: 'demo' }, async ({ app }) => { /* já logado */ });
```

No celular isso **não existe**: cada teste faz seu login (por isso fluxos reutilizáveis, como no [4.1](1-Organizando-testes.md), valem tanto no mobile).

Ir para: [4.4 Agente de IA](4-Agente-de-ia.md)
