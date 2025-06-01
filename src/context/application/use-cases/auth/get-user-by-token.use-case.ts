import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UserDto } from "@/context/domain/dtos/user.dto";
import { UserNotFoundException } from "@/context/domain/exceptions/user-not-found.exception";
import { UserRepository } from "@/context/domain/interfaces/user.repository.interface";
import { USER_REPOSITORY } from "@/context/domain/tokens/injection.tokens";

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class GetUserByTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(token: string): Promise<UserDto> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const user = await this.userRepository.findById(payload.sub);

      if (!user) {
        throw new UserNotFoundException(payload.sub);
      }

      return {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        createdAt: user.getCreatedAt(),
      };
    } catch {
      throw new UnauthorizedException({
        message: "Invalid or expired token",
        error: "INVALID_TOKEN",
      });
    }
  }
}
