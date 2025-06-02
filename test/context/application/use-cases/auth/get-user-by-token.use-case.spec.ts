import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { GetUserByTokenUseCase } from "@/context/application/use-cases/auth/get-user-by-token.use-case";
import { User } from "@/context/domain/entities/user.entity";
import { UserRepository } from "@/context/domain/interfaces/user.repository.interface";

describe("GetUserByTokenUseCase", () => {
  let useCase: GetUserByTokenUseCase;
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
      verify: jest.fn(),
    } as Partial<JwtService> as jest.Mocked<JwtService>;
    useCase = new GetUserByTokenUseCase(
      userRepo as UserRepository,
      jwtService as JwtService,
    );
  });

  it("debería retornar el UserDto si el token es válido y el usuario existe", async () => {
    const now = new Date();
    const user = new User("1", "test@mail.com", "pass", "Test", now, now);
    jwtService.verify.mockReturnValue({ sub: "1", email: "test@mail.com" });
    userRepo.findById.mockResolvedValue(user);

    const result = await useCase.execute("token123");

    expect(result).toEqual({
      id: "1",
      name: "Test",
      email: "test@mail.com",
      createdAt: now,
    });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(jwtService.verify).toHaveBeenCalledWith("token123");
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userRepo.findById).toHaveBeenCalledWith("1");
  });

  it("debería lanzar UnauthorizedException si el token es inválido", async () => {
    jwtService.verify.mockImplementation(() => {
      throw new Error("invalid token");
    });

    await expect(useCase.execute("token123")).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
