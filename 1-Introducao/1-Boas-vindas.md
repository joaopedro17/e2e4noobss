## 1.1 Boas vindas

Sejam bem vindos ao curso de e2e da He4rt Developers.

Ficamos muito felizes de você ter chegado até aqui! Nos próximos passos você vai sair entendendo o suficiente para automatizar testes end-to-end de uma aplicação web e de um app mobile com a mesma ferramenta.

Um teste **end-to-end** (ponta a ponta) usa a aplicação do jeito que uma pessoa usa: abre a tela, toca nos botões, digita nos campos e confere o que apareceu. Ele não sabe nada do código por dentro; só enxerga o que está na tela.

O **e2e** é um runner de testes end-to-end escrito em TypeScript, mantido pela [Tester Army](https://e2e.tester.army). Ele tem três ideias centrais:

- **Uma API para web e mobile.** O mesmo `screen.getByText('Entrar').tap()` funciona num navegador (o motor web usa o Playwright por baixo) e num celular (o motor mobile usa o [agent-device](https://github.com/callstack/agent-device), que controla simuladores iOS, emuladores Android e aparelhos reais).
- **Comandos exatos e passos de IA lado a lado.** Você escreve cliques e asserções precisos quando quer controle total, e pode entregar um objetivo inteiro a um agente (`agent.act('adicione um item ao carrinho')`) quando o caminho muda com frequência.
- **Replay sem custo.** Um passo de IA que deu certo é gravado e repetido nas próximas execuções sem chamar o modelo de novo.

Esse curso usa TypeScript nos exemplos, mas você não precisa ser especialista: se você já escreveu um pouco de JavaScript, vai acompanhar. Ninguém aqui precisa de uma chave de IA para começar; os módulos básico e intermediário funcionam sem modelo nenhum, até o capítulo [4.4 Agente de IA](../4-Intermediario/4-Agente-de-ia.md).

Ir para: [1.2 Comunicação](2-Comunicacao.md)
