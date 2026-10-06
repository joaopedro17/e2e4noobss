# 2.4 - Editor de textos e início

## Editor

Qualquer editor com suporte a TypeScript serve. Recomendamos o [VS Code](https://code.visualstudio.com): ele já entende TypeScript e mostra os erros de tipo enquanto você escreve, o que pega muito locator errado antes de rodar.

## Opção 1: usar o projeto deste curso

O jeito mais rápido de ver algo funcionando:

```bash
git clone https://github.com/joaopedro17/e2e4noobs.git
cd e2e4noobs
npm install
npx e2e run --target web
```

Você deve ver:

```
 ✓ |web| tests/todo.e2e.ts (2 tests)
   ✓ lista de tarefas > adiciona uma tarefa
   ✓ lista de tarefas > conclui uma tarefa
      Tests  2 passed (2)
```

## Opção 2: começar do zero

Numa pasta vazia (ou dentro do seu projeto):

```bash
npx e2e init
```

O assistente pergunta:

- **Engine**: Playwright (web) ou agent-device (mobile).
- **Modelo de IA**: escolha **None** por enquanto; configuramos isso no capítulo [4.4](../4-Intermediario/4-Agente-de-ia.md).
- Se quer instalar a **skill** (instruções para agentes de código como o Claude Code ou o Cursor) e registrar o **servidor MCP**. Vale aceitar: seu assistente de código passa a saber escrever testes e2e.

Ele cria:

```
e2e.config.ts           # configuração
tests/example.e2e.ts    # um teste de exemplo
.gitignore              # com as saídas do .e2e/
```

E acrescenta ao `package.json` o script `test:e2e`. Depois:

```bash
npm install
npx e2e run tests/example.e2e.ts
```

> `npx e2e init --yes` pula as perguntas e escolhe web. Para mobile, troque depois o pacote `@e2e-dev/web` por `@e2e-dev/mobile` no `package.json` e no `e2e.config.ts` (veja [3.5](../3-Basico/5-Primeiro-teste-mobile.md)).

## Um `tsconfig.json` para o editor

O e2e roda TypeScript sem compilar nada, mas o editor precisa de um `tsconfig.json` para autocompletar. Use este:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["e2e.config.ts", "tests/**/*.ts"]
}
```

E instale os tipos do Node: `npm i -D @types/node`. Para checar tudo de uma vez: `npx tsc -p .`

Ir para: [2.5 Dicas gerais](5-Dicas-gerais.md)
