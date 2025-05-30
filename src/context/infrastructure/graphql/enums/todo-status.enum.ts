import { registerEnumType } from "@nestjs/graphql";

import { TodoStatus } from "@/context/domain/enums/todo-status.enum";

registerEnumType(TodoStatus, {
  name: "TodoStatus",
  description: "The status of a todo item",
});
