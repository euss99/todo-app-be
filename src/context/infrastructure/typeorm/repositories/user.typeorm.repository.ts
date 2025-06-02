import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "@/context/domain/entities/user.entity";
import { UserRepository } from "@/context/domain/interfaces/user.repository.interface";
import { UserTypeOrmEntity } from "@/context/infrastructure/typeorm/entities/user.typeorm.entity";

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly repository: Repository<UserTypeOrmEntity>,
  ) {}

  private toDomain(entity: UserTypeOrmEntity): User {
    return new User(
      entity.id,
      entity.email,
      entity.password,
      entity.name,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toTypeOrm(domain: User): UserTypeOrmEntity {
    const entity = new UserTypeOrmEntity();
    entity.id = domain.getId();
    entity.email = domain.getEmail();
    entity.password = domain.getPassword();
    entity.name = domain.getName();
    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();
    return entity;
  }

  async save(user: User): Promise<User> {
    const entity = this.toTypeOrm(user);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
