# 5.3 - Integração com CI/CD

Teste que só roda na sua máquina não protege ninguém. No CI ele roda a cada pull request.

## O que muda no CI

Quando a variável `CI` existe (todo serviço de CI define), o e2e muda os padrões sozinho:

- `retries: 1` e `workers: 1`;
- cache de replay só leitura;
- `test.only` esquecido no código faz a execução falhar (`ONLY_IN_CI`).

Para simular localmente: `CI=1 npx e2e run`.

## Web no GitHub Actions

`.github/workflows/e2e.yml`
```yaml
name: e2e
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
jobs:
  web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npx @e2e-dev/web install chromium --with-deps
      - run: npx e2e run --target web --reporter list,junit
        env:
          E2E_USER_DEMO_USERNAME: ${{ secrets.E2E_USER_DEMO_USERNAME }}
          E2E_USER_DEMO_PASSWORD: ${{ secrets.E2E_USER_DEMO_PASSWORD }}
          # AI_GATEWAY_API_KEY: ${{ secrets.AI_GATEWAY_API_KEY }}  # se usar o agente
      - if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: e2e-report
          path: .e2e/
```

Pontos importantes:

- Instale o navegador num passo **separado**, para o download não contar no tempo do teste.
- Envie `.e2e/` como artefato **mesmo quando falha** (`!cancelled()`): é lá que estão os prints e a árvore da tela.
- `--reporter list,junit` gera `.e2e/junit.xml`, que a maioria dos serviços (GitHub, Azure DevOps, GitLab, Jenkins) transforma num painel de testes.

## Mobile no CI

O job faz quatro coisas: **compilar** o app para simulador/emulador, **ligar** o aparelho, **instalar** o app e **rodar** o e2e.

| | iOS | Android |
|---|---|---|
| Máquina | macOS com Xcode | Linux com KVM |
| Build | `.app` Release de simulador (sem assinatura) | `.apk` Release |
| Aparelho | simulador ligado | emulador ligado |

```bash
# iOS (macOS)
xcrun simctl install booted caminho/MeuApp.app
npx e2e run --target ios --reporter list,junit

# Android (Linux com KVM)
adb install -r caminho/app.apk
npx e2e run --target android --reporter list,junit
```

Cuidados:

- **Build Release.** Um build debug de React Native/Expo busca o JavaScript no Metro, que não existe no CI; o app abre numa tela de erro.
- **Um job por plataforma.** Mac hospedado é Apple Silicon e não roda emulador Android.
- **Fixe a versão do iOS do simulador.** A árvore de acessibilidade muda entre versões do iOS; uma atualização da imagem do CI pode quebrar um locator sem você mudar nada.
- **Guarde em cache a pasta `~/.agent-device`**: é onde fica o runner do iOS, compilado na primeira execução.
- Sem Mac no CI? O pacote `@e2e-dev/eas` aluga simuladores da Expo (EAS): `mobile({ platform: 'ios', device: easSimulators({ buildId }) })`.

## Segredos

Credenciais e chaves de modelo vêm dos **segredos do pipeline**, nunca do repositório. As variáveis são as mesmas do `.env` local (`E2E_USER_<NOME>_USERNAME`, `E2E_USER_<NOME>_PASSWORD`, a chave do modelo).

> Não exponha a chave do modelo a pull requests de forks: o código do PR roda com acesso a ela.

## Códigos de saída

| Código | Significa |
|---|---|
| 0 | tudo passou (ou flaky, ou pulado) |
| 1 | algum teste falhou |
| 2 | erro de configuração, CLI ou credencial: **não adianta repetir** |
| 3 | falha de ambiente (aparelho, app, modelo): vale repetir o job |

Ir para: [5.4 Debug e relatórios](4-Debug-e-relatorios.md)
