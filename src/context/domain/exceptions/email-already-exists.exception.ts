import { ConflictException } from "@nestjs/common";

export class EmailAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super({
      message: "El correo electrónico ya está registrado",
      error: "EMAIL_ALREADY_EXISTS",
      details: {
        email,
      },
    });
  }
}
