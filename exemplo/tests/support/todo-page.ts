import type { Screen } from 'e2e';

// Page Object da tela do TodoMVC: os locators e as ações ficam aqui,
// os testes só dizem o que fazer e o que esperar.
export class TodoPage {
  constructor(private readonly screen: Screen) {}

  input() {
    return this.screen.getByPlaceholder('What needs to be done?');
  }

  items() {
    return this.screen.getByTestId('todo-title');
  }

  counter() {
    return this.screen.getByTestId('todo-count');
  }

  async add(title: string) {
    await this.input().fill(title);
    await this.input().press('Enter');
  }

  async complete(title: string) {
    const item = this.screen.getByTestId('todo-item').filter({ hasText: title });
    await item.getByRole('checkbox').check();
  }
}
