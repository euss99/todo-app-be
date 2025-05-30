import { Body, Controller, Post } from "@nestjs/common";

import { LoginUseCase } from "@/context/application/use-cases/auth/login.use-case";
import { LoginInput } from "@/context/infrastructure/rest/dtos/login.input";
import {
  LoggedUser,
  LoginResponse,
} from "@/context/infrastructure/rest/dtos/login-response.output";

@Controller("auth")
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post("login")
  async login(@Body() loginInput: LoginInput): Promise<LoginResponse> {
    const auth = await this.loginUseCase.execute(
      loginInput.email,
      loginInput.password,
    );
    const user = auth.getUser();

    const loggedUser: LoggedUser = {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      createdAt: user.getCreatedAt(),
    };

    return {
      token: auth.getToken(),
      user: loggedUser,
    };
  }
}
