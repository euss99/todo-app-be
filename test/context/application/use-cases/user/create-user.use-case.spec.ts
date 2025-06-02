import { CreateUserUseCase } from "@/context/application/use-cases/user/create-user.use-case";
import { EmailAlreadyExistsException } from "@/context/domain/exceptions/email-already-exists.exception";
import { UserRepository } from "@/context/domain/interfaces/user.repository.interface";

describe("CreateUserUseCase", () => {
  let useCase: CreateUserUseCase;
  let repo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    repo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateUserUseCase(repo as UserRepository);
  });

  it("debería crear un usuario si el email no existe", async () => {
    repo.findByEmail.mockResolvedValue(null);
    repo.save.mockImplementation(async (user) => Promise.resolve(user));

    const user = await useCase.execute("Test", "test@mail.com", "password123");
    expect(user.getEmail()).toBe("test@mail.com");
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.save).toHaveBeenCalled();
  });

  it("debería lanzar excepción si el email ya existe", async () => {
    const mockUser = {
      getEmail: () => "test@mail.com",
    } as unknown as import("@/context/domain/entities/user.entity").User;
    repo.findByEmail.mockResolvedValue(mockUser);
    await expect(
      useCase.execute("Test", "test@mail.com", "password123"),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsException);
  });
});
