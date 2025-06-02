import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import { TodoTypeOrmEntity } from "@/context/infrastructure/typeorm/entities/todo.typeorm.entity";
import { UserTypeOrmEntity } from "@/context/infrastructure/typeorm/entities/user.typeorm.entity";

export const databaseConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT!, 10) || 5432,
  username: process.env.DB_USERNAME || "admin",
  password: process.env.DB_PASSWORD || "123",
  database: process.env.DB_DATABASE || "todo_app",
  entities: [UserTypeOrmEntity, TodoTypeOrmEntity],
  synchronize: process.env.NODE_ENV !== "production",
};
