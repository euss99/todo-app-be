import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { User } from "@/context/domain/entities/user.entity";
import { UserRepository } from "@/context/domain/interfaces/user.repository.interface";
import { USER_REPOSITORY } from "@/context/domain/tokens/injection.tokens";

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(
      crypto.randomUUID(),
      email,
      hashedPassword,
      name,
      new Date(),
      new Date(),
    );

    return this.userRepository.save(user);
  }
}
