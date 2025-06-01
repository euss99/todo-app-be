import { BadRequestException } from "@nestjs/common";

export class InvalidTodoStatusException extends BadRequestException {
  constructor(status: string) {
    super({
      message: "Invalid todo status",
      error: "INVALID_TODO_STATUS",
      details: {
        status,
        validStatuses: ["PENDING", "IN_PROGRESS", "COMPLETED"],
      },
    });
  }
}
