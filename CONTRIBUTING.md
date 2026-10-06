# Guia de Contribuição

Obrigado pelo interesse em contribuir com o **e2e4noobs**! Este documento explica como participar do projeto de forma organizada.

## Tipos de contribuição bem-vindos

- Correção de erros (typos, links quebrados, código incorreto)
- Melhorias de conteúdo (explicações mais claras, exemplos melhores)
- Novos capítulos ou seções
- Tradução de conteúdo
- Revisão técnica de exemplos de código
- Atualização para versões novas do e2e

## Como contribuir

### 1. Abra uma Issue primeiro (para mudanças grandes)

Para novas seções, mudanças estruturais ou qualquer coisa que leve mais de alguns minutos de revisão, abra uma [Issue](../../issues) descrevendo o que você quer fazer antes de começar. Isso evita trabalho duplicado e permite alinhar a proposta com os mantenedores.

Para correções pequenas (typo, link quebrado), pode ir direto para o Pull Request.

### 2. Faça um Fork e crie um branch

```bash
git clone https://github.com/seu-usuario/e2e4noobs.git
cd e2e4noobs
git checkout -b feature/minha-contribuicao
```

Use nomes de branch descritivos:
- `fix/typo-locators`: para correções
- `feature/modulo-avancado`: para novo conteúdo
- `update/e2e-0.19`: para atualizações de conteúdo existente

### 3. Faça as alterações

#### Padrões de conteúdo

- Todo conteúdo é escrito em **Português (Brasil)**
- Exemplos de código são em **TypeScript**
- Use blocos de código com syntax highlighting: ` ```ts `
- Mantenha a numeração e estrutura de pastas existente
- Cada arquivo deve ter um link "Ir para:" ao final apontando para o próximo
- Nunca use dados reais de cliente, contas reais ou senhas nos exemplos

#### Padrões de código

- Importe `expect`, `credentials` e `secrets` de `e2e`; `test`, `describe` e hooks de `@e2e-dev/web` ou `@e2e-dev/mobile`
- `await` em toda ação e asserção de locator
- Nenhum `sleep`/`setTimeout` para esperar a tela: use asserções com `timeout`
- Senhas sempre via `credentials`, nunca no código
- Exemplos que dá para rodar devem rodar: o projeto da raiz precisa continuar passando

### 4. Confira antes de abrir o PR

```bash
npm install
npx tsc -p .
npx e2e run --target web
```

### 5. Commit e Push

```bash
git add nome-do-arquivo.md
git commit -m "fix: corrige exemplo de getByRole em 1-Locators.md"
git push origin feature/minha-contribuicao
```

**Formato do commit (recomendado):**

```
tipo: descrição curta do que foi feito

Tipos: fix, feat, docs, refactor
```

### 6. Abra um Pull Request

- Abra o PR com um título claro
- Descreva o que foi alterado e por quê
- Referencie a Issue relacionada, se houver (`Closes #123`)

## Estrutura do projeto

```
e2e4noobs/
├── 1-Introducao/       # Boas-vindas, comunicação, como o e2e funciona
├── 2-Ambiente/         # Configuração de ambiente (Mac, Windows, Linux)
├── 3-Basico/           # Locators, ações, asserções, primeiros testes web e mobile
├── 4-Intermediario/    # Page Object, esperas, credenciais, agente de IA, cache
├── 5-Avancado/         # Aparelhos reais, paralelismo, CI/CD, debug e relatórios
├── images/             # Imagens usadas nas páginas
├── tests/              # Testes de exemplo (rodam com npx e2e run)
├── e2e.config.ts       # Configuração do projeto de exemplo
├── package.json        # Dependências do projeto de exemplo
└── CONTRIBUTING.md     # Este arquivo
```

## Dúvidas

Abra uma [Issue](../../issues) com a label `question` e teremos prazer em ajudar.
