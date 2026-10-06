# 3.5 - Primeiro teste mobile

No celular a API é a mesma. O que muda é a configuração e a forma de abrir o app.

## Instalando o motor mobile

```bash
npm i -D @e2e-dev/mobile
```

## A configuração

O app é identificado pelo **bundle id** (iOS) ou **package** (Android), não por URL:

```ts
import type { E2EConfig } from 'e2e';
import { mobile } from '@e2e-dev/mobile';

const bundleId = 'com.exemplo.app';

export default {
  targets: [
    { name: 'ios', engine: mobile({ platform: 'ios', device: 'iPhone 17' }), app: { bundleId } },
    { name: 'android', engine: mobile({ platform: 'android' }), app: { bundleId } },
  ],
  workers: 1,
} satisfies E2EConfig;
```

- `device` escolhe o simulador pelo nome que aparece em `npx agent-device devices`. Sem `device`, o alvo usa **todos** os aparelhos ligados daquela plataforma, inclusive um iPhone de verdade conectado no cabo. Fixe o nome para não ter surpresa.
- `workers: 1`: um teste por aparelho.
- **O app precisa estar instalado** no simulador/emulador. O e2e não instala nada sozinho (para isso existe `app.appPath` + `device.installApp()`).

## Permissões

Para o sistema não interromper o teste com "Permitir acesso à localização?", defina as permissões de antemão. Elas valem a cada abertura do app:

```ts
app: {
  bundleId,
  permissions: { location: 'deny', camera: 'deny', notifications: 'deny' },
},
```

> Nem todo runtime de simulador aceita todas. Se aparecer `UNSUPPORTED_CAPABILITY ... notifications`, tire essa da lista e trate a tela no teste.

## O teste

```ts
import { test } from '@e2e-dev/mobile';
import { expect } from 'e2e';

test('abre na tela de boas-vindas', { requires: ['device'] }, async ({ app, screen }) => {
  await app.clearState(); // reinicia o app do zero: sem dados, sem login
  await expect(screen.getByText('Bem-vindo')).toBeVisible({ timeout: 15_000 });
  await screen.getByRole('button', 'Começar').tap();
  await expect(screen.getByText('Entre com seu e-mail')).toBeVisible();
});
```

- O `test` vem de `@e2e-dev/mobile` (ele conhece o fixture `device`).
- `requires: ['device']` faz o alvo web pular este teste em vez de falhar.
- `app.open()` abre o app **como ele está**; `app.clearState()` apaga os dados e abre do zero. No celular, um teste que não chama nenhum dos dois continua de onde o anterior parou.

## Rodando

```bash
npx e2e run tests/boas-vindas.e2e.ts --target ios
npx e2e run tests/boas-vindas.e2e.ts --target android
```

Na primeira vez no iOS o e2e compila um pequeno app auxiliar no simulador, então demora mais. Das próximas vezes é rápido.

## Diferenças entre iOS e Android no mesmo teste

O fixture `platform` diz onde o teste está rodando:

```ts
test('saudação', async ({ screen, platform }) => {
  const saudacao = platform === 'ios' ? 'Olá, Ana' : 'OLÁ, ANA';
  await expect(screen.getByText(saudacao)).toBeVisible();
});
```

Ou, quando a diferença é só maiúscula/minúscula, um `RegExp`: `screen.getByText(/^olá, ana$/i)`.

Ir para: [4.1 Organizando testes e Page Object](../4-Intermediario/1-Organizando-testes.md)
