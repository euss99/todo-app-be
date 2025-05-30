import { User } from "@/context/domain/entities/user.entity";

export class Auth {
  private readonly token: string;
  private readonly user: User;

  constructor(token: string, user: User) {
    this.token = token;
    this.user = user;
  }

  getToken(): string {
    return this.token;
  }

  getUser(): User {
    return this.user;
  }
}
