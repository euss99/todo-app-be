import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Todo } from "@/context/domain/entities/todo.entity";
import { TodoRepository } from "@/context/domain/interfaces/todo.repository.interface";
import { TodoTypeOrmEntity } from "@/context/infrastructure/typeorm/entities/todo.typeorm.entity";

@Injectable()
export class TodoTypeOrmRepository implements TodoRepository {
  constructor(
    @InjectRepository(TodoTypeOrmEntity)
    private readonly repository: Repository<TodoTypeOrmEntity>,
  ) {}

  private toDomain(entity: TodoTypeOrmEntity): Todo {
    return new Todo(
      entity.id,
      entity.title,
      entity.description,
      entity.userId,
      entity.status,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toTypeOrm(domain: Todo): TodoTypeOrmEntity {
    const entity = new TodoTypeOrmEntity();
    entity.id = domain.getId();
    entity.title = domain.getTitle();
    entity.description = domain.getDescription();
    entity.status = domain.getStatus();
    entity.userId = domain.getUserId();
    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();
    return entity;
  }

  async save(todo: Todo): Promise<Todo> {
    const entity = this.toTypeOrm(todo);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<Todo | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return this.toDomain(entity);
  }

  async findByUserId(userId: string): Promise<Todo[]> {
    const entities = await this.repository.find({
      where: { userId },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async findAll(): Promise<Todo[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
