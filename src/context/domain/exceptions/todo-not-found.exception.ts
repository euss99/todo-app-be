import { NotFoundException } from "@nestjs/common";

export class TodoNotFoundException extends NotFoundException {
  constructor(todoId: string) {
    super({
      message: "Todo not found",
      error: "TODO_NOT_FOUND",
      details: {
        todoId,
      },
    });
  }
}
