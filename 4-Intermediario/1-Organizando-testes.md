# 4.1 - Organizando testes e Page Object

Nessa seção os testes começam a crescer, e a organização passa a importar tanto quanto o que eles testam.

## describe, hooks e tags

```ts
import { describe, beforeEach, afterEach, test } from '@e2e-dev/web';
import { expect } from 'e2e';

describe('carrinho', { tags: ['carrinho', 'smoke'] }, () => {
  beforeEach(async ({ app }) => {
    await app.open();          // roda antes de cada teste do grupo
  });

  afterEach(async ({ app }) => {
    // roda depois de cada teste, mesmo quando ele falha
  });

  test('adiciona item', async ({ screen }) => { /* ... */ });
  test('remove item', { tags: ['regressao'] }, async ({ screen }) => { /* ... */ });
});
```

- `describe` agrupa; o corpo dele é **síncrono** (sem `async`).
- **Tags** somam: `remove item` tem `carrinho`, `smoke` e `regressao`. Rode por tag com `npx e2e run --tag smoke`.
- Outras opções úteis num teste ou grupo: `timeout`, `retries`, `skip`, `platforms: ['ios']` (só nesse alvo), `requires: ['device']` ou `requires: ['browser']` (pula onde não dá).

## Page Object Model (POM)

O Page Object separa **como achar e mexer na tela** de **o que o teste confere**. Se o layout mudar, você corrige num lugar só.

Em e2e, um Page Object é uma classe que recebe o `screen`:

`tests/support/todo-page.ts`
```ts
import type { Screen } from 'e2e';

export class TodoPage {
  constructor(private readonly screen: Screen) {}

  // Locators
  input() {
    return this.screen.getByPlaceholder('What needs to be done?');
  }

  items() {
    return this.screen.getByTestId('todo-title');
  }

  counter() {
    return this.screen.getByTestId('todo-count');
  }

  // Ações
  async add(title: string) {
    await this.input().fill(title);
    await this.input().press('Enter');
  }

  async complete(title: string) {
    const item = this.screen.getByTestId('todo-item').filter({ hasText: title });
    await item.getByRole('checkbox').check();
  }
}
```

`tests/todo.e2e.ts`
```ts
import { describe, beforeEach, test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { TodoPage } from './support/todo-page.ts';

describe('lista de tarefas', { tags: ['todo', 'smoke'], requires: ['browser'] }, () => {
  beforeEach(async ({ app }) => {
    await app.open();
  });

  test('conclui uma tarefa', async ({ screen }) => {
    const todo = new TodoPage(screen);

    await todo.add('Lavar a louça');
    await todo.complete('Lavar a louça');

    await expect(todo.counter()).toHaveText('0 items left');
  });
});
```

Repare:

- Os locators são **métodos**, não propriedades guardadas. Um locator é só uma busca, barato de criar, e sempre lê a tela atual.
- As **asserções ficam no teste**, não na página. A página sabe mexer; o teste sabe o que espera.
- Arquivos de apoio ficam em `tests/support/` e **não** terminam em `.e2e.ts`, então o e2e não tenta rodá-los como teste.
- No import, use a extensão `.ts` (`./support/todo-page.ts`).

## Fluxos reutilizáveis

Nem tudo é "uma página". Um passo que vários testes repetem (abrir o app e passar pelo onboarding, fazer login) vira uma função:

```ts
// tests/support/flows.ts
export async function entrarComoConvidado(screen: Screen) {
  await screen.getByRole('button', 'Começar').tap();
  await screen.getByRole('button', 'Continuar como convidado').tap();
  await expect(screen.getByTestId('btn-entrar')).toBeVisible();
}
```

## Fixtures próprios

Quando todo teste de um arquivo precisa do mesmo objeto, `test.extend` cria um fixture:

```ts
import { test as base } from '@e2e-dev/web';
import { TodoPage } from './support/todo-page.ts';

const test = base.extend<{ todo: TodoPage }>({
  todo: async ({ screen }, use) => {
    await use(new TodoPage(screen)); // o que vier depois do use() é limpeza
  },
});

test('adiciona', async ({ app, todo }) => {
  await app.open();
  await todo.add('Pão');
});
```

## Organizando pastas

Agrupe por área; dá para rodar uma pasta inteira:

```
tests/
├── support/          # page objects e fluxos (não são testes)
├── convidado/
├── autenticado/
└── carrinho/
```

```bash
npx e2e run tests/autenticado --target android
```

Ir para: [4.2 Esperas e telas opcionais](2-Esperas.md)
