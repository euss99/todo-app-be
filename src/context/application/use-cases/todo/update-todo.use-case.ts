import { Injectable } from "@nestjs/common";
import { Inject } from "@nestjs/common";

import { TodoRepository } from "@/context/domain/interfaces/todo.repository.interface";
import { TODO_REPOSITORY } from "@/context/domain/tokens/injection.tokens";

@Injectable()
export class UpdateTodoUseCase {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly todoRepository: TodoRepository,
  ) {}

  async execute(
    id: string,
    title?: string,
    description?: string,
  ): Promise<void> {
    const todo = await this.todoRepository.findById(id);

    if (!todo) {
      throw new Error("Todo not found");
    }

    todo.updateTodo(title, description);
    await this.todoRepository.save(todo);
  }
}
