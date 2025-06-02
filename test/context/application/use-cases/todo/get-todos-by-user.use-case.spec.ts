import { GetTodosByUserUseCase } from "@/context/application/use-cases/todo/get-todos-by-user.use-case";
import { Todo } from "@/context/domain/entities/todo.entity";
import { TodoStatus } from "@/context/domain/enums/todo-status.enum";
import { UserNotFoundException } from "@/context/domain/exceptions/user-not-found.exception";
import { TodoRepository } from "@/context/domain/interfaces/todo.repository.interface";
import { UserRepository } from "@/context/domain/interfaces/user.repository.interface";

describe("GetTodosByUserUseCase", () => {
  let useCase: GetTodosByUserUseCase;
  let todoRepo: jest.Mocked<TodoRepository>;
  let userRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    todoRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      findByUserId: jest.fn(),
    };
    userRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new GetTodosByUserUseCase(
      todoRepo as TodoRepository,
      userRepo as UserRepository,
    );
  });

  it("debería retornar los todos del usuario si existe", async () => {
    const mockUser = {
      id: "user1",
      email: "test@example.com",
      password: "hashed",
      name: "Test User",
    } as unknown as import("@/context/domain/entities/user.entity").User;
    const todos = [
      new Todo(
        "1",
        "Título 1",
        "Desc 1",
        "user1",
        TodoStatus.PENDING,
        new Date(),
        new Date(),
      ),
      new Todo(
        "2",
        "Título 2",
        "Desc 2",
        "user1",
        TodoStatus.COMPLETED,
        new Date(),
        new Date(),
      ),
    ];
    userRepo.findById.mockResolvedValue(mockUser);
    todoRepo.findByUserId.mockResolvedValue(todos);

    const result = await useCase.execute("user1");
    expect(result).toHaveLength(2);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(todoRepo.findByUserId).toHaveBeenCalledWith("user1");
  });

  it("debería lanzar UserNotFoundException si el usuario no existe", async () => {
    userRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute("user1")).rejects.toBeInstanceOf(
      UserNotFoundException,
    );
  });
});
