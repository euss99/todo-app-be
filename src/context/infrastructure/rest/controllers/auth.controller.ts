import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { GetUserByTokenUseCase } from "@/context/application/use-cases/auth/get-user-by-token.use-case";
import { LoginUseCase } from "@/context/application/use-cases/auth/login.use-case";
import { LoginInput } from "@/context/infrastructure/rest/dtos/login.input";
import {
  LoggedUser,
  LoginResponse,
} from "@/context/infrastructure/rest/dtos/login-response.output";
import { ValidateTokenResponse } from "@/context/infrastructure/rest/dtos/validate-token-response.output";

@ApiTags("Autenticación")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getUserByTokenUseCase: GetUserByTokenUseCase,
  ) {}

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

  @ApiOperation({
    summary: "Obtener información del usuario a través del token",
  })
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({
    status: 200,
    description: "Token válido y usuario encontrado",
    type: ValidateTokenResponse,
  })
  @ApiResponse({
    status: 401,
    description: "Token inválido o expirado",
  })
  @Get("user")
  async getUserByToken(
    @Headers("authorization") authHeader: string,
  ): Promise<ValidateTokenResponse> {
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    const user = await this.getUserByTokenUseCase.execute(token);
    return user as ValidateTokenResponse;
  }
}
