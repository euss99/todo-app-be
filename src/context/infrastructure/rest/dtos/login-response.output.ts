export class LoggedUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export class LoginResponse {
  token: string;
  user: LoggedUser;
}
