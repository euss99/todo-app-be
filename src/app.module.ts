import "@/context/infrastructure/graphql/enums/todo-status.enum";

import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";

import { databaseConfig } from "@/config/database.config";
import { GetUserByTokenUseCase } from "@/context/application/use-cases/auth/get-user-by-token.use-case";
import { LoginUseCase } from "@/context/application/use-cases/auth/login.use-case";
import { CreateTodoUseCase } from "@/context/application/use-cases/todo/create-todo.use-case";
import { DeleteTodoUseCase } from "@/context/application/use-cases/todo/delete-todo.use-case";
import { UpdateTodoUseCase } from "@/context/application/use-cases/todo/update-todo.use-case";
import { UpdateTodoStatusUseCase } from "@/context/application/use-cases/todo/update-todo-status.use-case";
import { CreateUserUseCase } from "@/context/application/use-cases/user/create-user.use-case";
import {
  TODO_REPOSITORY,
  USER_REPOSITORY,
} from "@/context/domain/tokens/injection.tokens";
import { JwtStrategy } from "@/context/infrastructure/auth/jwt.strategy";
import { TodoResolver } from "@/context/infrastructure/graphql/resolvers/todo.resolver";
import { UserResolver } from "@/context/infrastructure/graphql/resolvers/user.resolver";
import { AuthController } from "@/context/infrastructure/rest/controllers/auth.controller";
import { TodoTypeOrmEntity } from "@/context/infrastructure/typeorm/entities/todo.typeorm.entity";
import { UserTypeOrmEntity } from "@/context/infrastructure/typeorm/entities/user.typeorm.entity";
import { TodoTypeOrmRepository } from "@/context/infrastructure/typeorm/repositories/todo.typeorm.repository";
import { UserTypeOrmRepository } from "@/context/infrastructure/typeorm/repositories/user.typeorm.repository";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: {
        settings: {
          "request.credentials": "include",
        },
      },
      introspection: true,
      buildSchemaOptions: {
        orphanedTypes: [UserTypeOrmEntity, TodoTypeOrmEntity],
      },
      context: ({ req }: { req: Request }) => ({ req }),
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([UserTypeOrmEntity, TodoTypeOrmEntity]),
    PassportModule,
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
    {
      provide: TODO_REPOSITORY,
      useClass: TodoTypeOrmRepository,
    },
    CreateUserUseCase,
    CreateTodoUseCase,
    DeleteTodoUseCase,
    UpdateTodoUseCase,
    UpdateTodoStatusUseCase,
    LoginUseCase,
    GetUserByTokenUseCase,
    UserResolver,
    TodoResolver,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AppModule {}
