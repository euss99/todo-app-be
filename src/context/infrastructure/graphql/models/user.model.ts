import { Field, ID, ObjectType } from "@nestjs/graphql";

import { User } from "@/context/domain/entities/user.entity";

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  static fromDomain(user: User): UserModel {
    const model = new UserModel();
    model.id = user.getId();
    model.email = user.getEmail();
    model.name = user.getName();
    model.createdAt = user.getCreatedAt();
    model.updatedAt = user.getUpdatedAt();
    return model;
  }
}
