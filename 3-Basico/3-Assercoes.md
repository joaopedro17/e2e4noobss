# 3.3 - Asserções

Um teste que só clica não testa nada. A **asserção** é a parte que diz "isso tem que ser verdade agora".

No e2e, `expect` vem do pacote `e2e`:

```ts
import { expect } from 'e2e';
```

## Asserções em elementos (esperam sozinhas)

`expect(locator)` **tenta de novo** até passar ou até estourar o tempo (5 s por padrão). É isso que torna o teste estável sem `sleep`:

```ts
await expect(screen.getByText('Pedido confirmado')).toBeVisible();
await expect(screen.getByRole('dialog')).toBeHidden();
await expect(screen.getByTestId('todo-count')).toHaveText('1 item left');
await expect(screen.getByTestId('total')).toContainText('R$');
await expect(screen.getByRole('listitem')).toHaveCount(3);
await expect(screen.getByLabel('E-mail')).toHaveValue('ana@exemplo.com');
await expect(screen.getByRole('checkbox')).toBeChecked();
await expect(screen.getByRole('button', 'Enviar')).toBeEnabled();
await expect(screen.getByTestId('aba-pontos')).toBeSelected();
```

Precisa de mais tempo (uma tela que carrega devagar)? Passe o `timeout`:

```ts
await expect(screen.getByText('Bem-vindo')).toBeVisible({ timeout: 15_000 });
```

`.not` inverte qualquer uma: `await expect(screen.getByText('Erro')).not.toBeVisible();`

> Cuidado: uma busca que **não acha nada** faz `.not.toBeVisible()` passar. Se você escreveu o texto errado, o teste passa sem testar. Sempre que puder, confira algo que **deve** estar na tela.

## Asserções em valores (imediatas)

Para valores comuns, sem `await`:

```ts
const texto = await screen.getByTestId('total').textContent();
expect(texto).toBe('R$ 42,00');
expect(lista).toHaveLength(3);
expect(pedido).toMatchObject({ status: 'pago' });
```

## A lista toda de uma vez

```ts
await expect(screen.getByTestId('todo-title')).toHaveText(['Pão', 'Leite']); // exatamente esses, nessa ordem
```

## `await` sempre

Toda ação e toda asserção em elemento é assíncrona. Esquecer o `await` faz o teste falhar com `STEP_NOT_AWAITED` apontando a linha exata. Ainda bem.

Ir para: [3.4 Primeiro teste web](4-Primeiro-teste-web.md)
