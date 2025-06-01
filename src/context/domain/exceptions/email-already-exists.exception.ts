import { ConflictException } from "@nestjs/common";

export class EmailAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super({
      message: "Email is already registered",
      error: "EMAIL_ALREADY_EXISTS",
      details: {
        email,
      },
    });
  }
}
