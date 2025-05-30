import { Injectable } from "@nestjs/common";
import { Inject } from "@nestjs/common";

import { Todo } from "@/context/domain/entities/todo.entity";
import { TodoStatus } from "@/context/domain/enums/todo-status.enum";
import { TodoRepository } from "@/context/domain/interfaces/todo.repository.interface";
import { TODO_REPOSITORY } from "@/context/domain/tokens/injection.tokens";

@Injectable()
export class UpdateTodoStatusUseCase {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly todoRepository: TodoRepository,
  ) {}

  async execute(id: string, status: TodoStatus): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);

    if (!todo) {
      throw new Error("Todo not found");
    }

    todo.updateStatus(status);
    return this.todoRepository.save(todo);
  }
}
