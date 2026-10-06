# 2.2 - Ambiente Windows

No Windows você testa **web** e **Android**. Simulador de iPhone não existe fora do macOS; para iOS, use um Mac (local ou em CI).

## Node.js

O e2e precisa do **Node.js 24.8 ou mais novo**.

Pelo terminal (PowerShell):

```powershell
winget install OpenJS.NodeJS
```

Ou baixe o instalador em [nodejs.org](https://nodejs.org) (versão 24 ou mais nova). Feche e abra o terminal e confira:

```powershell
node -v
npm -v
```

> Se o PowerShell bloquear o `npx` com erro de "execution policy", rode uma vez:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

## Web

Nada além do Node. O navegador é baixado na primeira execução, ou antes com:

```powershell
npx @e2e-dev/web install chromium
```

## Android (emulador)

1. Instale o [Android Studio](https://developer.android.com/studio).
2. Em **More Actions → Virtual Device Manager**, crie um emulador.
3. Adicione as ferramentas às variáveis de ambiente (Configurações → Sistema → Sobre → Configurações avançadas → Variáveis de Ambiente):
   - `ANDROID_HOME` = `%LOCALAPPDATA%\Android\Sdk`
   - No `Path`, acrescente `%ANDROID_HOME%\platform-tools` e `%ANDROID_HOME%\emulator`
4. Abra um terminal novo e confira: `adb devices`.

## Conferindo tudo

```powershell
npx agent-device doctor
```

Ir para: [2.4 Editor de textos e início](4-Editor-e-inicio.md)
