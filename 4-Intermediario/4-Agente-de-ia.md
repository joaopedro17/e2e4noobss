# 4.4 - Agente de IA

Até aqui tudo foi determinístico: você disse exatamente o que tocar. O fixture `agent` permite dar um **objetivo** e deixar um modelo de IA decidir os toques lendo a tela.

## Configurando um modelo

O agente usa qualquer modelo do [AI SDK](https://ai-sdk.dev/providers) que suporte *tool calls*. Algumas opções:

| Opção | Como autenticar |
|---|---|
| Assinatura ChatGPT Plus/Pro | `npx e2e login openai` |
| GitHub Copilot | `npx e2e login github-copilot` |
| Vercel AI Gateway | variável `AI_GATEWAY_API_KEY` |
| OpenRouter | variável `OPENROUTER_API_KEY` |
| Modelo local (Ollama, LM Studio...) | URL do servidor |

Exemplo com o AI Gateway:

```ts
import { gateway } from 'ai';

export default {
  targets: [/* ... */],
  agents: {
    default: {
      model: gateway('openai/gpt-6-luna-fast'),
      system: 'Você é um QA cuidadoso. Confira cada resultado na tela.',
    },
  },
} satisfies E2EConfig;
```

No mobile, adicione as ferramentas do aparelho para o agente poder trocar de app, arrastar e responder alertas do sistema:

```ts
import { mobileTools } from '@e2e-dev/mobile/tools';

const ios = mobile({ platform: 'ios' });
// ...
agents: { default: { model: gateway('openai/gpt-6-luna-fast'), tools: mobileTools(ios) } },
```

> Use chave de API (não assinatura) no CI.

## act: um objetivo

```ts
await agent.act('adicione o produto "Camiseta azul" ao carrinho');
await expect(screen.getByTestId('cart-count')).toHaveText('1'); // confira logo depois!
```

Valores vão em `params`, nunca no meio do texto:

```ts
await agent.act('busque por {termo}', { params: { termo: 'tênis' } });

const demo = credentials.user('demo');
await agent.act('entre com as credenciais fornecidas', {
  params: { email: demo.username, senha: demo.password }, // o modelo vê só o nome do segredo
});
```

## assert, waitFor, extract: uma pergunta

```ts
await agent.assert('o carrinho mostra um selo de frete grátis');            // olha uma vez e julga

await agent.waitFor('o relatório terminou e apareceu um link de download', { // fica olhando
  timeout: 120_000,
});

import { z } from 'zod';
const dados = await agent.extract('o nome e o preço de cada item do carrinho', {
  schema: z.object({ itens: z.array(z.object({ nome: z.string(), preco: z.string() })) }),
});
expect(dados.itens).toHaveLength(1);
```

## Escrevendo bons objetivos

- **Um objetivo por `act`.** "Adicione ao carrinho e finalize a compra" são dois.
- **Use as palavras da tela.** `'abra a aba Faturamento'`, não `'vá para a parte de pagar'`.
- **Não descreva mecânica.** Esperar, rolar e tentar de novo é com o runner.
- **Confira o resultado logo depois** com `expect` ou `agent.assert`. Além de testar, é essa conferência que permite o [cache de replay](5-Cache-de-replay.md) gravar o passo.
- **Ensine o vocabulário do app** com `context` no agente: `context: 'Um "pedido" é uma reserva de mesa. A aba Conta fica no canto inferior direito.'`

## Quando usar o agente

| Use determinístico (`screen`) | Use o agente (`agent`) |
|---|---|
| Abrir o app, asserções finais | Um trecho de toques que quebra a cada mudança de layout |
| Valores exatos (uma senha, um CPF) | Navegar até "algum lugar" sem se importar com o caminho |
| Testes que rodam centenas de vezes por dia | Verificações visuais difíceis de expressar com locators |

A regra do curso: **abertura e asserções finais determinísticas, agente no meio quando compensar.**

Ir para: [4.5 Cache de replay](5-Cache-de-replay.md)
