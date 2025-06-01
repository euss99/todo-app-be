import { NotFoundException } from "@nestjs/common";

export class UserNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super({
      message: "User not found",
      error: "USER_NOT_FOUND",
      details: {
        userId,
      },
    });
  }
}
