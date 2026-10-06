// Exemplo mobile para um app fictício: troque os textos e test ids pelos do
// seu app e defina APP_BUNDLE_ID no .env. No alvo web este teste é pulado.
import { test } from '@e2e-dev/mobile';
import { credentials, expect } from 'e2e';

test(
  'entra com a conta de teste',
  { tags: ['login', 'mobile'], requires: ['device'] },
  async ({ app, screen, platform }) => {
    const demo = credentials.user('demo');

    // Nada abre sozinho: clearState() reinicia o app do zero (só em simulador/emulador).
    await app.clearState();

    // Telas que às vezes aparecem viram um if, nunca um sleep.
    const notifications = screen.getByText('Ativar notificações');
    if (await notifications.isVisible()) {
      await screen.getByRole('button', 'Agora não').tap();
    }

    await screen.getByTestId('email-input').fill(demo.username);
    await screen.getByTestId('password-input').fill(demo.password);
    await screen.getByRole('button', 'Entrar').tap();

    // No iOS o título costuma vir como label; no Android, como texto.
    const welcome = platform === 'ios' ? screen.getByLabel('Bem-vindo') : screen.getByText('BEM-VINDO');
    await expect(welcome).toBeVisible({ timeout: 15_000 });
  },
);
