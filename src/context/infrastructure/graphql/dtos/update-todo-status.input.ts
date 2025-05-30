import { Field, ID, InputType } from "@nestjs/graphql";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

import { TodoStatus } from "@/context/domain/enums/todo-status.enum";

@InputType()
export class UpdateTodoStatusInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  id: string;

  @Field(() => TodoStatus)
  @IsEnum(TodoStatus)
  @IsNotEmpty()
  status: TodoStatus;
}
