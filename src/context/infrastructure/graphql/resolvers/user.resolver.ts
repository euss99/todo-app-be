import { UseGuards } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { CreateUserUseCase } from "@/context/application/use-cases/user/create-user.use-case";
import { UserRepository } from "@/context/domain/interfaces/user.repository.interface";
import { USER_REPOSITORY } from "@/context/domain/tokens/injection.tokens";
import { JwtAuthGuard } from "@/context/infrastructure/auth/jwt-auth.guard";
import { CreateUserInput } from "@/context/infrastructure/graphql/dtos/create-user.input";
import { UserModel } from "@/context/infrastructure/graphql/models/user.model";

@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  @Mutation(() => UserModel)
  async createUser(@Args("input") input: CreateUserInput): Promise<UserModel> {
    const user = await this.createUserUseCase.execute(
      input.name,
      input.email,
      input.password,
    );
    return UserModel.fromDomain(user);
  }

  @Query(() => UserModel, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async user(@Args("id") id: string): Promise<UserModel | null> {
    const user = await this.userRepository.findById(id);
    return user ? UserModel.fromDomain(user) : null;
  }

  @Query(() => [UserModel])
  @UseGuards(JwtAuthGuard)
  async users(): Promise<UserModel[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => UserModel.fromDomain(user));
  }
}
