import { UnauthorizedException } from "@nestjs/common";

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super({
      message: "Invalid email or password",
      error: "INVALID_CREDENTIALS",
    });
  }
}
