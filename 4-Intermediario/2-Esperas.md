# 4.2 - Esperas e telas opcionais

O maior inimigo de um teste end-to-end é o tempo: a tela ainda não carregou, a animação não terminou, a API respondeu devagar. A tentação é colocar um `sleep`. **Não coloque.** Um `sleep` é lento quando o app está rápido e curto demais quando o app está lento.

## Quem já espera por você

| O quê | Espera até | Padrão |
|---|---|---|
| Ações (`tap`, `fill`...) | o elemento existir e estar pronto | 30 s (`actionTimeout`) |
| `expect(locator)` | a condição ficar verdadeira | 5 s (`assertionTimeout`) |
| `screen.scrollUntilVisible` | o elemento aparecer rolando | 30 s |
| O teste inteiro | — | 120 s (`timeout`) |

Ajuste no `e2e.config.ts` para o projeto todo, ou caso a caso:

```ts
await expect(screen.getByText('Pagamento aprovado')).toBeVisible({ timeout: 30_000 });
await screen.getByRole('button', 'Pagar').tap({ timeout: 60_000 });
test('fluxo longo', { timeout: 600_000 }, async () => { /* ... */ });
```

## O que NÃO espera: leituras

`isVisible()`, `textContent()`, `count()` respondem **na hora**, com o que está na tela agora:

```ts
const n = await screen.getByRole('listitem').count(); // pode ser 0 se a lista ainda carrega
```

Para um valor que ainda vai mudar, use um matcher (`await expect(...).toHaveCount(3)`) ou `expect.poll`:

```ts
await expect.poll(() => api.buscarPedido(id).then(p => p.status), { timeout: 10_000 }).toBe('pago');
```

## Telas que às vezes aparecem

Pop-up de cookies, pedido de notificação, tooltip de novidade: aparecem numa execução e não em outra. Trate com `if`:

```ts
const cookies = screen.getByRole('button', 'Aceitar cookies');
if (await cookies.isVisible()) {
  await cookies.tap();
}
```

`isVisible()` não espera; ele olha a tela **agora**. Se a tela opcional demora a surgir, o `if` passa reto antes dela aparecer. Para isso, espere por **qualquer uma** de várias telas e trate a que vier:

```ts
import { expect } from 'e2e';
import type { Locator } from 'e2e';

/** Espera até uma das telas aparecer e diz qual; undefined se nenhuma veio a tempo. */
export async function primeiraVisivel<K extends string>(
  candidatos: Record<K, Locator>,
  timeout: number,
): Promise<K | undefined> {
  let achou: K | undefined;
  try {
    await expect
      .poll(async () => {
        for (const [nome, locator] of Object.entries(candidatos) as [K, Locator][]) {
          if (await locator.isVisible()) return (achou = nome);
        }
        return undefined;
      }, { timeout })
      .toBeDefined();
  } catch {
    return undefined;
  }
  return achou;
}
```

Usando, num onboarding que pode mostrar notificações, localização, ou ir direto para a home:

```ts
for (;;) {
  const tela = await primeiraVisivel({
    home: screen.getByTestId('home'),
    notificacoes: screen.getByText('Ativar notificações'),
    localizacao: screen.getByText('Ativar localização'),
  }, 30_000);

  if (tela === undefined) throw new Error('Nenhuma tela esperada apareceu');
  if (tela === 'home') break;
  await screen.getByRole('button', 'Agora não').tap();
}
```

Isso é mais robusto que uma sequência de "espere 10 s por notificações; espere 10 s por localização": não importa a ordem nem quais aparecem, e não perde tempo esperando telas que não vêm.

> Um bônus: o `expect.poll` continua tentando mesmo quando uma leitura dá erro. Num WebView que ainda está carregando, a leitura da tela às vezes falha em vez de responder "ainda não"; o `poll` absorve isso.

Ir para: [4.3 Credenciais e segredos](3-Credenciais-e-segredos.md)
