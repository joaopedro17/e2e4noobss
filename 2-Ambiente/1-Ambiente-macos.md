# 2.1 - Ambiente MacOS

O Mac é o único sistema que roda **todos** os alvos: web, Android e iOS. Simulador de iPhone só existe no macOS.

## Node.js

O e2e precisa do **Node.js 24.8 ou mais novo** (ou 22.22.3+ na linha 22).

A forma mais simples é pelo [Homebrew](https://brew.sh):

```bash
brew install node@24
node -v   # deve mostrar v24.x
```

Se você já usa um gerenciador de versões (nvm, fnm, volta), instale a 24 por ele.

## Web

Nada além do Node. Na primeira execução o e2e baixa o navegador sozinho. Se quiser baixar antes:

```bash
npx @e2e-dev/web install chromium
```

## iOS (simulador)

1. Instale o **Xcode** pela App Store e abra uma vez para ele terminar a instalação.
2. Em **Xcode → Settings → Components**, baixe um runtime de iOS (ex: iOS 26).
3. Confirme que os simuladores aparecem:

```bash
xcrun simctl list devices available | grep iPhone
```

## Android (emulador)

1. Instale o [Android Studio](https://developer.android.com/studio).
2. Em **More Actions → Virtual Device Manager**, crie um emulador (ex: Pixel com Android 16).
3. Coloque as ferramentas no `PATH`, no seu `~/.zshrc`:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"
```

4. Abra um terminal novo e confira: `adb devices`.

## Conferindo tudo

O motor mobile usa o **agent-device**, que tem um diagnóstico próprio:

```bash
npx agent-device doctor
```

Ele lista os aparelhos que encontrou e o que falta. Avisos sobre HarmonyOS ou Vega podem ser ignorados se você não testa nessas plataformas.

Ir para: [2.4 Editor de textos e início](4-Editor-e-inicio.md)
