import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Todo } from "@/context/domain/entities/todo.entity";
import { TodoStatus } from "@/context/domain/enums/todo-status.enum";

@ObjectType()
export class TodoModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  userId: string;

  @Field(() => TodoStatus)
  status: TodoStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  static fromDomain(todo: Todo): TodoModel {
    const model = new TodoModel();
    model.id = todo.getId();
    model.title = todo.getTitle();
    model.description = todo.getDescription();
    model.userId = todo.getUserId();
    model.status = todo.getStatus();
    model.createdAt = todo.getCreatedAt();
    model.updatedAt = todo.getUpdatedAt();
    return model;
  }
}
