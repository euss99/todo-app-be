import { Injectable } from "@nestjs/common";
import { Inject } from "@nestjs/common";

import { Todo } from "@/context/domain/entities/todo.entity";
import { TodoNotFoundException } from "@/context/domain/exceptions/todo-not-found.exception";
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
  ): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);

    if (!todo) {
      throw new TodoNotFoundException(id);
    }

    todo.updateTodo(title, description);
    return this.todoRepository.save(todo);
  }
}
