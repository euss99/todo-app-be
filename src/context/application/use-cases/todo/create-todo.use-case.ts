import { Injectable } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

import { Todo } from "@/context/domain/entities/todo.entity";
import { TodoStatus } from "@/context/domain/enums/todo-status.enum";
import { UserNotFoundException } from "@/context/domain/exceptions/user-not-found.exception";
import { TodoRepository } from "@/context/domain/interfaces/todo.repository.interface";
import { UserRepository } from "@/context/domain/interfaces/user.repository.interface";
import {
  TODO_REPOSITORY,
  USER_REPOSITORY,
} from "@/context/domain/tokens/injection.tokens";

@Injectable()
export class CreateTodoUseCase {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly todoRepository: TodoRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    title: string,
    description: string,
    userId: string,
  ): Promise<Todo> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }

    const todo = new Todo(
      uuidv4(),
      title,
      description,
      userId,
      TodoStatus.PENDING,
      new Date(),
      new Date(),
    );

    return this.todoRepository.save(todo);
  }
}
