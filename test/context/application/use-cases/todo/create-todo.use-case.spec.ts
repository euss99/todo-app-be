import { CreateTodoUseCase } from "@/context/application/use-cases/todo/create-todo.use-case";
import { Todo } from "@/context/domain/entities/todo.entity";
import { TodoStatus } from "@/context/domain/enums/todo-status.enum";
import { TodoRepository } from "@/context/domain/interfaces/todo.repository.interface";
import { UserRepository } from "@/context/domain/interfaces/user.repository.interface";

describe("CreateTodoUseCase", () => {
  let useCase: CreateTodoUseCase;
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

    useCase = new CreateTodoUseCase(
      todoRepo as TodoRepository,
      userRepo as UserRepository,
    );
  });

  it("debería crear un todo correctamente", async () => {
    const mockUser = {
      id: "user1",
      email: "test@example.com",
      password: "hashed",
      name: "Test User",
    } as unknown as import("@/context/domain/entities/user.entity").User;
    userRepo.findById.mockResolvedValue(mockUser);
    todoRepo.save.mockImplementation(async (todo) => Promise.resolve(todo));

    const todo = await useCase.execute("Título", "Descripción", "user1");

    expect(todo).toBeInstanceOf(Todo);
    expect(todo.getTitle()).toBe("Título");
    expect(todo.getDescription()).toBe("Descripción");
    expect(todo.getUserId()).toBe("user1");
    expect(todo.getStatus()).toBe(TodoStatus.PENDING);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(todoRepo.save).toHaveBeenCalled();
  });

  it("debería lanzar un error si falta el título", async () => {
    await expect(useCase.execute("", "Descripción", "user1")).rejects.toThrow();
  });

  it("debería lanzar un error si falta la descripción", async () => {
    await expect(useCase.execute("Título", "", "user1")).rejects.toThrow();
  });

  it("debería lanzar un error si el usuario no existe", async () => {
    userRepo.findById.mockResolvedValue(null);
    await expect(
      useCase.execute("Título", "Descripción", "user1"),
    ).rejects.toThrow();
  });
});
