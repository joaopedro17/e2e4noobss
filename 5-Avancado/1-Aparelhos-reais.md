# 5.1 - Aparelhos reais

Simulador e emulador resolvem a maior parte dos testes, mas um bug de câmera, de Bluetooth, de desempenho ou de uma fabricante específica só aparece no aparelho de verdade. O e2e dirige celulares reais pelo mesmo motor mobile: muda a preparação, não o teste.

## Android físico

1. No celular: **Configurações → Sobre o telefone →** toque 7 vezes em **Número da versão** para liberar as opções de desenvolvedor.
2. **Opções do desenvolvedor → Depuração USB**: ligue.
3. Conecte no cabo e aceite o aviso "Permitir depuração USB?".
4. Confira: `adb devices` deve listar o aparelho como `device` (não `unauthorized`).

Pronto. Na configuração, o alvo `android` sem `device` usa qualquer aparelho conectado; para fixar um, use o nome que `npx agent-device devices` mostra:

```ts
{ name: 'android', engine: mobile({ platform: 'android', device: 'SM A166M' }), app: { bundleId } },
```

> Celulares de fabricantes têm diálogos próprios, como o Samsung Pass oferecendo salvar a senha depois do login. Trate como [tela opcional](../4-Intermediario/2-Esperas.md).

## iPhone físico

O iPhone dá mais trabalho, porque o e2e precisa **instalar um app auxiliar** (o *runner* de XCTest do agent-device) no aparelho, e o iOS só instala app **assinado**. É uma configuração de uma vez só.

### 1. Liberar as ferramentas de desenvolvedor

No Mac:

```bash
sudo DevToolsSecurity -enable
```

No iPhone: **Ajustes → Privacidade e Segurança → Modo de Desenvolvedor** ligado (o iPhone reinicia). O aparelho precisa estar pareado com o Mac ("Confiar neste computador").

### 2. Ter uma conta de desenvolvedor no Xcode

1. Entre uma vez em [developer.apple.com/account](https://developer.apple.com/account) com seu Apple ID e aceite o contrato. Isso cria o seu **Personal Team** gratuito (sem isso, o Xcode mostra *"Failed to retrieve development teams"*).
2. **Xcode → Settings → Accounts → +** e adicione o Apple ID.
3. Selecione o time → **Manage Certificates → + → Apple Development**.

### 3. Descobrir o Team ID (cuidado com a pegadinha)

```bash
security find-identity -v -p codesigning
#  1) A1B2... "Apple Development: voce@exemplo.com (9ZXY87WV65)"
```

O código entre parênteses **não é o Team ID**: é o id do certificado. O Team ID é o campo OU do certificado:

```bash
security find-certificate -c "Apple Development" -p | openssl x509 -noout -subject
# subject= ... OU=ABCDE12345 ...   <- este é o Team ID
```

### 4. Configurar o runner

No `.env`:

```
AGENT_DEVICE_IOS_TEAM_ID=ABCDE12345
AGENT_DEVICE_IOS_BUNDLE_ID=com.seunome.agentdevice.runner
```

O bundle id é qualquer nome único seu. Depois de mudar essas variáveis, reinicie o processo do agent-device, que guarda o ambiente antigo:

```bash
npx agent-device daemon stop
```

### 5. Registrar o iPhone no seu time (só na primeira vez)

Se o erro for *"Your team has no devices from which to generate a provisioning profile"*, o iPhone ainda não está registrado no time. O Xcode faz isso sozinho quando você compila algo para o aparelho; para o runner, compile uma vez com o registro ligado:

```bash
cd node_modules/agent-device/dist/apple/runner/AgentDeviceRunner
xcodebuild build-for-testing -project AgentDeviceRunner.xcodeproj -scheme AgentDeviceRunner \
  -destination "id=<UDID do iPhone>" \
  -allowProvisioningUpdates -allowProvisioningDeviceRegistration \
  CODE_SIGN_STYLE=Automatic DEVELOPMENT_TEAM=<seu Team ID> \
  AGENT_DEVICE_IOS_RUNNER_APP_BUNDLE_ID=com.seunome.agentdevice.runner \
  AGENT_DEVICE_IOS_RUNNER_TEST_BUNDLE_ID=com.seunome.agentdevice.runner.uitests
```

O UDID sai de `xcrun xctrace list devices`. Ao ver `TEST BUILD SUCCEEDED`, está resolvido.

### 6. O alvo

```ts
const iosDevice = process.env.IOS_DEVICE; // ex: "iPhone de Ana", como em `npx agent-device devices`

targets: [
  { name: 'ios', engine: mobile({ platform: 'ios', device: 'iPhone 17' }), app: { bundleId, permissions } },
  ...(iosDevice ? [{ name: 'ios-device', engine: mobile({ platform: 'ios', device: iosDevice }), app: { bundleId } }] : []),
],
```

Repare que o alvo físico **não tem `permissions`**: em iPhone real, permissões, `app.clearState()` e `device.clearKeychain()` só funcionam em simulador.

### Diagnosticando

Quando algo falha na preparação, peça os detalhes ao próprio agent-device:

```bash
npx agent-device open com.exemplo.app --platform ios --device "iPhone de Ana"
npx agent-device snapshot --debug    # mostra o motivo (ex: signing_provisioning_profile_missing)
npx agent-device close
```

| Mensagem | O que fazer |
|---|---|
| Developer mode is disabled for Apple development tools | `sudo DevToolsSecurity -enable` no Mac |
| xcodebuild build-for-testing failed / provisioning profile | Passos 2 a 5 |
| A árvore da tela vem vazia / print todo preto | O iPhone bloqueou. Desbloqueie e ponha **Bloqueio Automático: Nunca** enquanto testa |

## Um teste para simulador e aparelho real

Num aparelho real não dá para limpar o app. Em vez de duplicar testes, detecte isso: `app.clearState()` falha com `UNSUPPORTED_CAPABILITY` num iPhone físico.

```ts
export async function abrirDoZero(app: App) {
  try {
    await app.clearState();       // simulador / emulador: app zerado
  } catch (error) {
    if ((error as { code?: string }).code !== 'UNSUPPORTED_CAPABILITY') throw error;
    await app.open();             // iPhone real: abre como está
  }
}
```

No aparelho real, deixe o app **deslogado e no estado inicial** antes de rodar (ou reinstale).

```bash
npx e2e run tests --target ios          # simulador
npx e2e run tests --target ios-device   # iPhone real
```

Ir para: [5.2 Execução paralela e sharding](2-Execucao-paralela.md)
