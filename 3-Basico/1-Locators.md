# 3.1 - Locators

A primeira coisa que precisamos aprender é achar elementos corretamente. Para tocar num botão, o teste precisa primeiro saber **qual** botão.

No e2e você acha elementos pelo `screen`. Cada `screen.getBy...()` devolve um **locator**: uma busca guardada, que só é executada quando você age ou confere algo nela.

```ts
const salvar = screen.getByRole('button', 'Salvar'); // nada acontece ainda
await salvar.tap();                                   // agora ele procura e toca
```

## As buscas, da melhor para a pior

### getByRole: o papel do elemento

A primeira escolha. Busca pelo que o elemento **é** (botão, link, campo, checkbox...) e pelo seu nome acessível.

**Elemento**
```html
<button>Salvar</button>
```

**Seleção**
```ts
screen.getByRole('button', 'Salvar');
screen.getByRole('checkbox');                 // sem nome, se só existir um
screen.getByRole('heading', 'Pedidos', { level: 1 });
```

### getByLabel: campos pelo rótulo

**Elemento**
```html
<label for="email">E-mail</label>
<input id="email" type="email">
```

**Seleção**
```ts
screen.getByLabel('E-mail');
```

### getByPlaceholder: campos pelo texto de dica

```html
<input placeholder="O que precisa ser feito?">
```

```ts
screen.getByPlaceholder('O que precisa ser feito?');
```

### getByText: pelo texto visível

```ts
screen.getByText('Pedido confirmado');
```

### getByTestId: o último recurso

Busca por um id colocado de propósito para testes. Na web lê o atributo `data-testid`; no celular lê o `testID` do React Native (o *accessibility identifier* no iOS e o *resource id* no Android).

```html
<span data-testid="todo-count">1 item left</span>
```

```ts
screen.getByTestId('todo-count');
```

É estável, mas não diz nada sobre o que o usuário vê. Use quando o elemento não tem papel nem texto bons.

## A regra do texto exato

Diferente de outras ferramentas, o e2e compara o texto **inteiro, exatamente**, depois de ignorar espaços extras:

```ts
screen.getByText('Salvar');            // NÃO acha "Salvar alterações"
screen.getByText(/Salvar/);            // RegExp: acha qualquer texto que contenha Salvar
screen.getByText(/^salvar$/i);         // RegExp: texto inteiro, sem diferenciar maiúsculas
screen.getByText('salvar', { exact: false }); // pedaço do texto, sem diferenciar maiúsculas
```

## A regra do "exatamente um"

Toda ação e asserção exige que a busca encontre **um** elemento. Achou dois? O teste falha na hora com `LOCATOR_AMBIGUOUS`, em vez de tocar no primeiro e torcer. Para estreitar:

```ts
screen.getByRole('listitem').first();
screen.getByRole('listitem').nth(2);                       // o terceiro (começa em 0)
screen.getByTestId('todo-item').filter({ hasText: 'Pão' }); // o item que contém "Pão"
screen.getByTestId('todo-item').filter({ hasText: 'Pão' }).getByRole('checkbox'); // dentro dele
```

## Particularidades do celular

- **iOS e Android expõem textos de jeitos diferentes.** O mesmo botão pode aparecer como `"Continuar"` (rótulo de acessibilidade, comum no iOS) e `"CONTINUAR"` (texto renderizado em caixa alta, comum no Android). Um `RegExp` com `/i` resolve os dois de uma vez.
- **No iOS, uma `View` simples do React Native não tem filhos na árvore.** Buscar algo "dentro" dela não acha nada; dê `testID` aos filhos.
- **Abas do React Native no iOS** aparecem com papel `other`. Busque pelo test id ou rótulo e confira com `toBeSelected()`.

## Como descobrir o nome de um elemento

- **Web**: o DevTools do navegador (clique direito → Inspecionar) mostra o papel e o nome acessível na aba *Accessibility*.
- **Celular**: rode `npx agent-device snapshot` com o app aberto. Ele imprime a árvore da tela com papéis, textos e ids.
- **Quando um teste falha**, o e2e salva a árvore da tela no momento da falha em `.e2e/artifacts/.../failure/screen.txt`. É o melhor lugar para ver o nome real que você deveria ter usado.

Ir para: [3.2 Ações](2-Acoes.md)
