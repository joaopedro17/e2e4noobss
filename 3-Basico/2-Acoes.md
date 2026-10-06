# 3.2 - Ações

Achado o elemento, agimos sobre ele. Toda ação:

1. procura o elemento (exatamente um);
2. espera até ele estar pronto para receber a ação (até 30 s por padrão);
3. faz uma única coisa.

Por isso você **não precisa** colocar esperas antes de clicar. Se o botão demora a aparecer, a ação espera por ele.

## As mais usadas

```ts
await screen.getByRole('button', 'Entrar').tap();        // tocar/clicar (click() é sinônimo)
await screen.getByLabel('E-mail').fill('ana@exemplo.com'); // preencher um campo
await screen.getByLabel('E-mail').clear();                 // limpar
await screen.getByLabel('Busca').press('Enter');           // uma tecla
await screen.getByRole('checkbox').check();                // marcar (uncheck() desmarca)
await screen.getByText('Item').longPress();                // toque longo
await screen.getByText('Item').doubleTap();                // toque duplo
```

## fill x pressSequentially

`fill` coloca o valor de uma vez, sem eventos de teclado. Se o campo reage a cada tecla (autocompletar, máscara de CPF/telefone), use:

```ts
await screen.getByLabel('Telefone').pressSequentially('11987654321', { delay: 50 });
```

## Rolagem e gestos

```ts
// rola até o elemento aparecer (para baixo, por padrão)
await screen.scrollUntilVisible(screen.getByText('Termos de uso'));
await screen.scrollUntilVisible(screen.getByText('Topo'), { direction: 'up' });

// arrasta a tela: 'down' revela o que está abaixo (é a direção do conteúdo, não do dedo)
await screen.swipe({ direction: 'down' });
```

> Prefira `scrollUntilVisible` a swipes "na mão". Um swipe com porcentagem da tela que funcionava num aparelho rola demais ou de menos em outro tamanho de tela.

## Só no navegador / só no celular

Algumas ações não fazem sentido em todo lugar. No celular, `selectOption`, `setInputFiles` e `scrollIntoView` falham com `UNSUPPORTED_CAPABILITY`. Já o celular tem o fixture `device`:

```ts
await device.dismissKeyboard(); // esconder o teclado
await device.back();            // botão voltar do Android
await device.openLink('meuapp://pedidos/123'); // deep link
```

Ir para: [3.3 Asserções](3-Assercoes.md)
