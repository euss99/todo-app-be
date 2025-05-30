import "@/context/infrastructure/graphql/enums/todo-status.enum";

import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";

import { databaseConfig } from "@/config/database.config";
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
import { TodoTypeOrmEntity } from "@/context/infrastructure/adapters/typeorm/todo.typeorm.entity";
import { UserTypeOrmEntity } from "@/context/infrastructure/adapters/typeorm/user.typeorm.entity";
import { JwtStrategy } from "@/context/infrastructure/auth/jwt.strategy";
import { TodoResolver } from "@/context/infrastructure/graphql/resolvers/todo.resolver";
import { UserResolver } from "@/context/infrastructure/graphql/resolvers/user.resolver";
import { TodoTypeOrmRepository } from "@/context/infrastructure/repositories/typeorm/todo.typeorm.repository";
import { UserTypeOrmRepository } from "@/context/infrastructure/repositories/typeorm/user.typeorm.repository";
import { AuthController } from "@/context/infrastructure/rest/controllers/auth.controller";

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
    UserResolver,
    TodoResolver,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AppModule {}
