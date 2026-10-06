# 3.4 - Primeiro teste web

Vamos juntar locators, ações e asserções num teste de verdade, contra o [TodoMVC](https://demo.playwright.dev/todomvc) público do Playwright. Ele já está no projeto deste curso.

## A configuração

`e2e.config.ts` diz onde está o app:

```ts
import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';

export default {
  targets: [
    { name: 'web', engine: web(), app: { url: 'https://demo.playwright.dev/todomvc' } },
  ],
} satisfies E2EConfig;
```

> Testando um app que roda na sua máquina? O e2e pode subir o servidor sozinho e derrubar no fim:
>
> ```ts
> app: {
>   url: 'http://127.0.0.1:3000',
>   command: { executable: 'npm', args: ['run', 'dev'], log: '.e2e/logs/app.log' },
> },
> ```

## O teste

`tests/todo.e2e.ts`:

```ts
import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('adiciona uma tarefa', async ({ app, screen }) => {
  // 1. abrir: nada abre sozinho
  await app.open();

  // 2. agir
  const campo = screen.getByPlaceholder('What needs to be done?');
  await campo.fill('Estudar e2e');
  await campo.press('Enter');

  // 3. conferir
  await expect(screen.getByTestId('todo-title')).toHaveText(['Estudar e2e']);
  await expect(screen.getByTestId('todo-count')).toHaveText('1 item left');
});
```

Repare:

- O `test` vem de `@e2e-dev/web` (ele conhece o fixture `browser`); o `expect` vem de `e2e`.
- Todo teste começa do zero, com o navegador limpo: por isso `app.open()` primeiro.
- O arquivo termina em `.e2e.ts` e mora em `tests/`, onde o e2e procura por padrão.

## Rodando

```bash
npx e2e run tests/todo.e2e.ts
```

Quer **ver** o navegador trabalhando?

```bash
npx e2e run tests/todo.e2e.ts --headed
```

## Quando falha

Troque `'1 item left'` por `'2 items left'` e rode de novo. O e2e mostra:

```
 FAIL  |web| tests/todo.e2e.ts > adiciona uma tarefa
ASSERTION_FAILED: expect.toHaveText failed
locator: getByTestId("todo-count")
expected: text "2 items left"
observed: text "1 item left" (match count 1)
 ❯ at https://demo.playwright.dev/todomvc/#/
 ❯ screen .e2e/artifacts/web/.../failure/screen.txt
```

O código do erro, o esperado, o encontrado, onde o app estava e o caminho da árvore da tela no momento da falha. Abra esse `screen.txt`: ele mostra todos os elementos com papel, nome e test id.

Ir para: [3.5 Primeiro teste mobile](5-Primeiro-teste-mobile.md)
