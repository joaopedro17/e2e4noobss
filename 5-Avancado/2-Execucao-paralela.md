# 5.2 - Execução paralela e sharding

Uma suíte grande demora. Há três formas de dividir o trabalho.

## Workers: vários testes ao mesmo tempo na mesma máquina

```ts
export default {
  workers: 4,
  // ...
} satisfies E2EConfig;
```

Ou numa execução: `npx e2e run --workers 4`.

- **Web**: cada worker abre seu próprio navegador. Funciona direto.
- **Mobile**: **um worker por aparelho**. Dois testes no mesmo simulador brigam pela tela. Para paralelizar, dê uma lista de aparelhos (um *pool*):

```ts
{ name: 'ios', engine: mobile({ platform: 'ios', device: ['iPhone 17', 'iPhone 17 Pro'] }), app: { bundleId } },
```

O padrão é metade dos núcleos da máquina localmente e **1 no CI**.

## Grupos em série

Às vezes uma sequência de testes depende da anterior (cria → edita → apaga). Marque o grupo como serial: eles rodam em ordem, no mesmo worker, compartilhando o estado do app:

```ts
describe('ciclo de vida do pedido', { serial: true }, () => {
  test('cria', async () => { /* ... */ });
  test('edita', async () => { /* ... */ });
  test('apaga', async () => { /* ... */ });
});
```

Use com moderação: testes independentes são mais fáceis de depurar e paralelizar.

## Sharding: várias máquinas

`--shard` divide a suíte em fatias, uma por job de CI:

```bash
npx e2e run --shard 1/3   # job 1
npx e2e run --shard 2/3   # job 2
npx e2e run --shard 3/3   # job 3
```

## Retries e testes instáveis

```bash
npx e2e run --retries 2
```

No CI o padrão já é 1 retry. Um teste que falha e depois passa aparece como **flaky** no relatório: ele passou, mas está pedindo atenção. Para caçar instabilidade:

```bash
npx e2e run tests/checkout.e2e.ts --repeat-each 10 --no-cache
```

## Rodando só o que falhou

```bash
npx e2e run --last-failed
```

Ir para: [5.3 Integração com CI/CD](3-CI-CD.md)
