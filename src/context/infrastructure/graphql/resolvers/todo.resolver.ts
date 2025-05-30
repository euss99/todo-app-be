import { UseGuards } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { CreateTodoUseCase } from "@/context/application/use-cases/todo/create-todo.use-case";
import { DeleteTodoUseCase } from "@/context/application/use-cases/todo/delete-todo.use-case";
import { UpdateTodoUseCase } from "@/context/application/use-cases/todo/update-todo.use-case";
import { UpdateTodoStatusUseCase } from "@/context/application/use-cases/todo/update-todo-status.use-case";
import { TodoStatus } from "@/context/domain/enums/todo-status.enum";
import { TodoRepository } from "@/context/domain/interfaces/todo.repository.interface";
import { TODO_REPOSITORY } from "@/context/domain/tokens/injection.tokens";
import { JwtAuthGuard } from "@/context/infrastructure/auth/jwt-auth.guard";
import { CreateTodoInput } from "@/context/infrastructure/graphql/dtos/create-todo.input";
import { UpdateTodoInput } from "@/context/infrastructure/graphql/dtos/update-todo.input";
import { UpdateTodoStatusInput } from "@/context/infrastructure/graphql/dtos/update-todo-status.input";
import { TodoModel } from "@/context/infrastructure/graphql/models/todo.model";

@Resolver(() => TodoModel)
export class TodoResolver {
  constructor(
    private readonly createTodoUseCase: CreateTodoUseCase,
    @Inject(TODO_REPOSITORY)
    private readonly todoRepository: TodoRepository,
    private readonly deleteTodoUseCase: DeleteTodoUseCase,
    private readonly updateTodoUseCase: UpdateTodoUseCase,
    private readonly updateTodoStatusUseCase: UpdateTodoStatusUseCase,
  ) {}

  @Mutation(() => TodoModel)
  @UseGuards(JwtAuthGuard)
  async createTodo(@Args("input") input: CreateTodoInput): Promise<TodoModel> {
    const todo = await this.createTodoUseCase.execute(
      input.title,
      input.description,
      input.userId,
    );
    return TodoModel.fromDomain(todo);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteTodo(@Args("id") id: string): Promise<boolean> {
    await this.deleteTodoUseCase.execute(id);
    return true;
  }

  @Mutation(() => TodoModel)
  @UseGuards(JwtAuthGuard)
  async updateTodo(@Args("input") input: UpdateTodoInput): Promise<TodoModel> {
    await this.updateTodoUseCase.execute(
      input.id,
      input.title,
      input.description,
    );
    const updatedTodo = await this.todoRepository.findById(input.id);
    return TodoModel.fromDomain(updatedTodo!);
  }

  @Mutation(() => TodoModel)
  @UseGuards(JwtAuthGuard)
  async updateTodoStatus(
    @Args("input") input: UpdateTodoStatusInput,
  ): Promise<TodoModel> {
    const { id, status } = input as { id: string; status: TodoStatus };
    const todo = await this.updateTodoStatusUseCase.execute(id, status);
    return TodoModel.fromDomain(todo);
  }

  @Query(() => TodoModel, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async todo(@Args("id") id: string): Promise<TodoModel | null> {
    const todo = await this.todoRepository.findById(id);
    return todo ? TodoModel.fromDomain(todo) : null;
  }

  @Query(() => [TodoModel])
  @UseGuards(JwtAuthGuard)
  async todos(): Promise<TodoModel[]> {
    const todos = await this.todoRepository.findAll();
    return todos.map((todo) => TodoModel.fromDomain(todo));
  }

  @Query(() => [TodoModel])
  @UseGuards(JwtAuthGuard)
  async todosByUser(@Args("userId") userId: string): Promise<TodoModel[]> {
    const todos = await this.todoRepository.findByUserId(userId);
    return todos.map((todo) => TodoModel.fromDomain(todo));
  }
}
