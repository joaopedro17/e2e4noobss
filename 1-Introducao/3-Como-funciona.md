## 1.3 Como o e2e funciona

Antes de instalar qualquer coisa, vale entender as peças. Todo projeto e2e tem só três coisas:

```
meu-projeto/
├── e2e.config.ts      # onde está o app e em quais "alvos" ele roda
├── tests/
│   └── login.e2e.ts   # os testes: todo arquivo terminado em .e2e.ts
└── .e2e/              # saída: relatório, prints, vídeos (gerado, não edite)
```

## Alvo (target) e motor (engine)

Um **alvo** é "onde o teste roda". Cada alvo tem um **motor**, que é quem sabe dirigir aquela plataforma:

| Motor | Pacote | Dirige |
|---|---|---|
| `web()` | `@e2e-dev/web` | Chromium, Firefox ou WebKit (via Playwright) |
| `mobile({ platform: 'ios' })` | `@e2e-dev/mobile` | Simulador iOS ou iPhone real |
| `mobile({ platform: 'android' })` | `@e2e-dev/mobile` | Emulador Android ou celular real |

O mesmo arquivo de teste roda em todos os alvos configurados. Você escolhe um com `--target`:

```bash
npx e2e run --target web
npx e2e run --target android
```

## Fixtures: as ferramentas que o teste recebe

Um teste é uma função que recebe ferramentas prontas. As principais:

| Fixture | Para quê |
|---|---|
| `app` | Abrir, reiniciar e limpar o app (`app.open()`, `app.clearState()`) |
| `screen` | Achar elementos e agir neles (`screen.getByText('Salvar').tap()`) |
| `expect` | Conferir o resultado (`await expect(...).toBeVisible()`) |
| `agent` | Passos guiados por IA (`agent.act`, `agent.assert`) |
| `browser` | Coisas que só o navegador tem (URL, cookies, rotas) |
| `device` | Coisas que só o celular tem (teclado, permissões, rede) |

```ts
test('exemplo', async ({ app, screen }) => {
  await app.open();
  await screen.getByRole('button', 'Começar').tap();
  await expect(screen.getByText('Bem-vindo')).toBeVisible();
});
```

## Determinístico x agente

Existem dois jeitos de dirigir o app, e você pode misturar os dois no mesmo teste:

- **Determinístico**: `screen` e `expect`. Você diz exatamente qual elemento tocar. Rápido, grátis, previsível.
- **Agente**: `agent.act('objetivo')`. Um modelo de IA lê a tela e decide os toques. Mais resistente a mudanças de layout, custa chamadas de modelo (até o replay entrar em cena).

A regra de ouro do curso: **abertura e asserções finais sempre determinísticas**; o agente entra onde uma sequência de toques quebra com frequência.

Ir para: [Configuração de ambientes Mac](../2-Ambiente/1-Ambiente-macos.md)
Ir para: [Configuração de ambientes Windows](../2-Ambiente/2-Ambiente-windows.md)
Ir para: [Configuração de ambientes Linux](../2-Ambiente/3-Ambiente-linux.md)
