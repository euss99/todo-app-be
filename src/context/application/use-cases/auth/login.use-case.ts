import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { Auth } from "@/context/domain/entities/auth.entity";
import { UserRepository } from "@/context/domain/interfaces/user.repository.interface";
import { USER_REPOSITORY } from "@/context/domain/tokens/injection.tokens";

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string): Promise<Auth> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Invalid User");
    }

    const isPasswordValid = await bcrypt.compare(password, user.getPassword());

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid Password");
    }

    const payload = { email: user.getEmail(), sub: user.getId() };
    const token = this.jwtService.sign(payload);

    return new Auth(token, user);
  }
}
