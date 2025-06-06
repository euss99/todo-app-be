import { Injectable } from "@nestjs/common";
import { Inject } from "@nestjs/common";

import { TodoNotFoundException } from "@/context/domain/exceptions/todo-not-found.exception";
import { TodoRepository } from "@/context/domain/interfaces/todo.repository.interface";
import { TODO_REPOSITORY } from "@/context/domain/tokens/injection.tokens";

@Injectable()
export class DeleteTodoUseCase {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly todoRepository: TodoRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new TodoNotFoundException(id);
    }

    await this.todoRepository.delete(id);
  }
}
