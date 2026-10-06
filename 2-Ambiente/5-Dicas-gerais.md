# 2.5 - Dicas gerais

- **Sempre `npx e2e ...`**. O `npx` usa a versão instalada no projeto, não uma global.
- **`npx e2e list`** mostra quais testes rodariam, em quais alvos, sem abrir nada. Use antes de rodar uma suíte grande.
- **`npx e2e guide`** imprime o manual do e2e no terminal. `npx e2e guide writing-tests` (ou `setup`, `agent`, `running`, `debugging`) mostra um tópico.
- **A documentação completa vem junto com o pacote**, em `node_modules/e2e/docs`. Útil offline.
- **Telemetria**: o e2e manda estatísticas anônimas de uso (nunca nomes de teste, dados do app ou senhas). Para desligar: `npx e2e telemetry disable`.
- **A pasta `.e2e/` é saída.** Leia à vontade (relatório, prints, vídeos), mas não edite.
- **Um aparelho por vez.** Dois testes no mesmo simulador brigam pela tela; por isso os exemplos usam `workers: 1` no mobile.

Ir para: [3.1 Locators](../3-Basico/1-Locators.md)
