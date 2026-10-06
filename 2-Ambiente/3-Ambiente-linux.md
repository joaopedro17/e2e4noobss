# 2.3 - Ambiente Linux

No Linux você testa **web** e **Android**. Para iOS é preciso um Mac.

## Node.js

O e2e precisa do **Node.js 24.8 ou mais novo**. O jeito mais fácil é o [nvm](https://github.com/nvm-sh/nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
# abra um terminal novo
nvm install 24
node -v
```

## Web

O navegador precisa de algumas bibliotecas do sistema. O próprio e2e instala tudo (pode pedir `sudo`):

```bash
npx @e2e-dev/web install chromium --with-deps
```

## Android (emulador)

1. Instale o [Android Studio](https://developer.android.com/studio) e crie um emulador no **Virtual Device Manager**.
2. No `~/.bashrc` (ou `~/.zshrc`):

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"
```

3. O emulador precisa de aceleração por hardware (KVM). Confira com `ls /dev/kvm`; se não existir, habilite a virtualização na BIOS.
4. Terminal novo, e: `adb devices`.

## Conferindo tudo

```bash
npx agent-device doctor
```

Ir para: [2.4 Editor de textos e início](4-Editor-e-inicio.md)
