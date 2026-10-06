import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { mobile } from '@e2e-dev/mobile';

// Variáveis locais (veja .env.example). O e2e não lê o .env sozinho.
const envFile = fileURLToPath(new URL('.env', import.meta.url));
if (existsSync(envFile)) process.loadEnvFile(envFile);

// O app mobile que você quer testar. Sem ele, só o alvo web existe.
const bundleId = process.env.APP_BUNDLE_ID;

export default {
  targets: [
    // Web: o TodoMVC público do Playwright, para começar sem app nenhum.
    { name: 'web', engine: web(), app: { url: 'https://demo.playwright.dev/todomvc' } },

    // Mobile: um simulador iOS e um emulador (ou celular) Android.
    ...(bundleId
      ? [
          { name: 'ios', engine: mobile({ platform: 'ios', device: process.env.IOS_SIMULATOR ?? 'iPhone 17' }), app: { bundleId } },
          { name: 'android', engine: mobile({ platform: 'android' }), app: { bundleId } },
        ]
      : []),
  ],
  workers: 1,
  // Contas de teste: o valor vem do ambiente, nunca do código.
  credentials: {
    demo: {
      username: process.env.E2E_USER_DEMO_USERNAME ?? '',
      password: () => process.env.E2E_USER_DEMO_PASSWORD ?? '',
    },
  },
} satisfies E2EConfig;
