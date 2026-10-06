# 4.5 - Cache de replay

Chamar um modelo de IA a cada execução custa dinheiro e tempo. O e2e resolve isso gravando o que deu certo.

## Como funciona

1. Um `agent.act` passa.
2. A asserção seguinte (`expect` num locator, `agent.assert`...) confirma que o resultado está certo.
3. O e2e grava os toques daquele passo em `.e2e/cache/`.
4. Na próxima execução, o passo é **repetido sem chamar o modelo**.
5. Se o app mudou e a gravação não serve mais, o agente assume de onde parou, ao vivo.

```ts
await agent.act('adicione "Pão" à lista');              // 1ª vez: modelo. Depois: replay
await expect(screen.getByText('Pão')).toBeVisible();    // é ESTA linha que libera a gravação
```

Sem a asserção logo depois, o passo **nunca** é gravado.

`agent.assert`, `agent.waitFor` e `agent.extract` **não** são gravados: julgamentos sempre rodam ao vivo.

## Modos

| Modo | Quando |
|---|---|
| `read-write` | padrão local: lê e grava |
| `read-only` | padrão no CI: só lê |
| `off` | `--no-cache` numa execução, ou `cache: 'off'` no config |

## Comandos

```bash
npx e2e cache ls      # o que está gravado
npx e2e cache stats   # quantos e quanto espaço
npx e2e cache clear   # apaga tudo (a próxima execução fica mais lenta, só isso)
```

## Compartilhando com o time e o CI

O `e2e init` coloca `.e2e/cache/` no `.gitignore`. Para o CI repetir os passos sem gastar modelo, **tire essa linha** e versione o cache.

Com o cache versionado, rode o CI com `--strict-cache`: uma gravação que não serve mais falha com `REPLAY_STALE` em vez de gastar modelo silenciosamente toda vez. Aí você grava de novo localmente e faz commit.

## Valores únicos

Se o passo cria algo com nome único (`Pedido 1712345678`), envolva em `unique()` para o cache continuar valendo:

```ts
import { unique } from 'e2e';
await agent.act('crie um pedido chamado {nome}', { params: { nome: unique(`Pedido ${Date.now()}`) } });
```

Ir para: [5.1 Aparelhos reais](../5-Avancado/1-Aparelhos-reais.md)
