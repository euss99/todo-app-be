import { Injectable } from "@nestjs/common";
import { Inject } from "@nestjs/common";

import { Todo } from "@/context/domain/entities/todo.entity";
import { UserNotFoundException } from "@/context/domain/exceptions/user-not-found.exception";
import { TodoRepository } from "@/context/domain/interfaces/todo.repository.interface";
import { UserRepository } from "@/context/domain/interfaces/user.repository.interface";
import {
  TODO_REPOSITORY,
  USER_REPOSITORY,
} from "@/context/domain/tokens/injection.tokens";

@Injectable()
export class GetTodosByUserUseCase {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly todoRepository: TodoRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<Todo[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }

    return this.todoRepository.findByUserId(userId);
  }
}
