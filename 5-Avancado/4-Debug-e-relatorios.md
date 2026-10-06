# 5.4 - Debug e relatórios

Teste falhou. E agora?

## 1. Leia o erro no terminal

```
 FAIL  |android| tests/login.e2e.ts > entra com a conta de teste
LOCATOR_NOT_FOUND: locator matched no nodes within getByText("CONTINUAR")
 ❯ tests/support/flows.ts:73:3
 ❯ on screen #n1090 button "Continuar"
 ❯ screen .e2e/artifacts/.../failure/screen.txt
```

O **código** já diz muito:

| Código | Significa | Primeira coisa a tentar |
|---|---|---|
| `LOCATOR_NOT_FOUND` | não achou o elemento a tempo | o texto/id está certo? Olhe o `screen.txt` |
| `LOCATOR_AMBIGUOUS` | achou mais de um | `.first()`, `.nth()`, `filter()` |
| `ASSERTION_FAILED` | a asserção não bateu | compare *expected* x *observed* |
| `STEP_NOT_AWAITED` | faltou um `await` | a linha está no erro |
| `UNSUPPORTED_CAPABILITY` | a ação não existe nesse alvo | `requires: [...]` no teste, ou trate |
| `AUTH_CREDENTIAL_UNAVAILABLE` | a senha não chegou | variável de ambiente / `.env` |
| `ENGINE_FAILURE` | o aparelho/navegador falhou | leia a dica (*Hint*) da mensagem |

Repare na linha `on screen`: quando não acha o que você pediu, o e2e sugere o elemento mais parecido que **existe**. No exemplo acima, o botão se chama `Continuar`, não `CONTINUAR`.

## 2. Abra a árvore da tela

`.e2e/artifacts/<alvo>/<teste>/.../failure/screen.txt` é a tela no momento da falha, com papel, nome, test id e estado de cada elemento:

```
#n1347 textbox "E-mail" value="E-mail *" [focused]
#n1350 textbox "Senha" value=<secure> purpose=password [secure]
#n1353 button "CONTINUAR" [focused]
```

É aqui que você descobre o nome real de um elemento.

## 3. Veja acontecer

```bash
npx e2e run tests/login.e2e.ts --headed     # navegador visível
npx e2e run tests/login.e2e.ts --video      # grava um vídeo (MP4 no celular, com os toques)
```

## 4. Agente: o que o modelo viu

```bash
npx e2e run tests/checkout.e2e.ts --debug     # tabela de passos, chamadas e custo
npx e2e run tests/checkout.e2e.ts --ai-trace  # cada chamada ao modelo em .e2e/ai-trace.json
```

## 5. Explore ao vivo com seu assistente de código

`npx e2e mcp` liga um servidor MCP que deixa um agente de código (Claude Code, Cursor...) abrir o app, ler a tela e testar locators antes de escrever o teste. O `e2e init` já registra esse servidor no projeto.

## Relatórios

Toda execução grava `.e2e/report.json` (todos os passos e artefatos). Outros formatos:

```bash
npx e2e run --reporter list,junit      # + .e2e/junit.xml (para o CI)
npx e2e run --reporter list,markdown   # + .e2e/summary.md e uma página por falha
```

O `summary.md` é ótimo para colar num pull request.

## Antes de culpar o app

Muitas falhas não são bug do app:

- **Dados de teste mudaram.** Um teste que confere o nível da conta ("Ouro") quebra quando a conta sobe de nível. Prefira conferir que o elemento existe (`getByTestId(/^tier-image-/)`) a conferir um valor que muda.
- **Aparelho diferente.** Outro tamanho de tela, outra versão do sistema, outra fabricante.
- **Ambiente fora do ar.** O login demora ou não carrega.

---

Parabéns, você chegou ao fim do e2e4noobs! Se algo ficou confuso, abra uma [issue](https://github.com/joaopedro17/e2e4noobs/issues). E se quiser ajudar, leia o [CONTRIBUTING.md](../CONTRIBUTING.md).

Voltar para: [README](../README.md)
