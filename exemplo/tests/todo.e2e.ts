import { describe, beforeEach, test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { TodoPage } from './support/todo-page.ts';

describe('lista de tarefas', { tags: ['todo', 'smoke'], requires: ['browser'] }, () => {
  beforeEach(async ({ app }) => {
    await app.open();
  });

  test('adiciona uma tarefa', async ({ screen }) => {
    const todo = new TodoPage(screen);

    await todo.add('Estudar e2e');

    await expect(todo.items()).toHaveCount(1);
    await expect(todo.items()).toHaveText(['Estudar e2e']);
    await expect(todo.counter()).toHaveText('1 item left');
  });

  test('conclui uma tarefa', async ({ screen }) => {
    const todo = new TodoPage(screen);

    await todo.add('Lavar a louça');
    await todo.complete('Lavar a louça');

    await expect(todo.counter()).toHaveText('0 items left');
  });
});
