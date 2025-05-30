import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { LoginUseCase } from "@/context/application/use-cases/auth/login.use-case";
import { LoginInput } from "@/context/infrastructure/rest/dtos/login.input";
import {
  LoggedUser,
  LoginResponse,
} from "@/context/infrastructure/rest/dtos/login-response.output";

@ApiTags("Autenticación")
@Controller("auth")
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @ApiOperation({ summary: "Iniciar sesión de usuario" })
  @ApiBody({
    type: LoginInput,
    description: "Credenciales de acceso",
    examples: {
      example1: {
        value: {
          email: "usuario@ejemplo.com",
          password: "password123",
        },
        summary: "Credenciales de ejemplo",
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Usuario autenticado exitosamente",
    type: LoginResponse,
  })
  @ApiResponse({
    status: 401,
    description: "Credenciales inválidas",
  })
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
