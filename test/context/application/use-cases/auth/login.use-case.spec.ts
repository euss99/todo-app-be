import { JwtService } from "@nestjs/jwt";

import { LoginUseCase } from "@/context/application/use-cases/auth/login.use-case";
import { Auth } from "@/context/domain/entities/auth.entity";
import { User } from "@/context/domain/entities/user.entity";
import { InvalidCredentialsException } from "@/context/domain/exceptions/invalid-credentials.exception";
import { UserRepository } from "@/context/domain/interfaces/user.repository.interface";

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

import * as bcrypt from "bcrypt";

describe("LoginUseCase", () => {
  let useCase: LoginUseCase;
  let userRepo: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    userRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    } as Partial<JwtService> as jest.Mocked<JwtService>;

    useCase = new LoginUseCase(
      userRepo as UserRepository,
      jwtService as JwtService,
    );
  });

  it("debería retornar Auth si las credenciales son válidas", async () => {
    const now = new Date();
    const user = new User("1", "test@mail.com", "hashedpass", "Test", now, now);
    userRepo.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.sign.mockReturnValue("token123");

    const result = await useCase.execute("test@mail.com", "password123");

    expect(result).toBeInstanceOf(Auth);
    expect(result.getToken()).toBe("token123");
    expect(result.getUser()).toBe(user);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(jwtService.sign).toHaveBeenCalledWith({
      email: "test@mail.com",
      sub: "1",
    });
  });

  it("debería lanzar InvalidCredentialsException si el usuario no existe", async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute("test@mail.com", "password123"),
    ).rejects.toBeInstanceOf(InvalidCredentialsException);
  });

  it("debería lanzar InvalidCredentialsException si la contraseña es incorrecta", async () => {
    const now = new Date();
    const user = new User("1", "test@mail.com", "hashedpass", "Test", now, now);
    userRepo.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      useCase.execute("test@mail.com", "wrongpass"),
    ).rejects.toBeInstanceOf(InvalidCredentialsException);
  });
});
