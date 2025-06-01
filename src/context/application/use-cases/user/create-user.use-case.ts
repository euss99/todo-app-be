import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { User } from "@/context/domain/entities/user.entity";
import { EmailAlreadyExistsException } from "@/context/domain/exceptions/email-already-exists.exception";
import { UserRepository } from "@/context/domain/interfaces/user.repository.interface";
import { USER_REPOSITORY } from "@/context/domain/tokens/injection.tokens";

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(name: string, email: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new EmailAlreadyExistsException(email);
    }

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
