import { UpdateTodoUseCase } from "@/context/application/use-cases/todo/update-todo.use-case";
import { Todo } from "@/context/domain/entities/todo.entity";
import { TodoStatus } from "@/context/domain/enums/todo-status.enum";
import { TodoRepository } from "@/context/domain/interfaces/todo.repository.interface";

describe("UpdateTodoUseCase", () => {
  let useCase: UpdateTodoUseCase;
  let todoRepo: jest.Mocked<TodoRepository>;

  beforeEach(() => {
    todoRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      findByUserId: jest.fn(),
    };
    useCase = new UpdateTodoUseCase(todoRepo as TodoRepository);
  });

  it("debería actualizar un todo correctamente", async () => {
    const existingTodo = new Todo(
      "1",
      "Viejo título",
      "Vieja desc",
      "user1",
      TodoStatus.PENDING,
      new Date(),
      new Date(),
    );
    todoRepo.findById.mockResolvedValue(existingTodo);
    todoRepo.save.mockImplementation(async (todo) => Promise.resolve(todo));

    const updated = await useCase.execute("1", "Nuevo título", "Nueva desc");

    expect(updated).toBeInstanceOf(Todo);
    expect(updated.getTitle()).toBe("Nuevo título");
    expect(updated.getDescription()).toBe("Nueva desc");
    expect(updated.getUserId()).toBe("user1");
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(todoRepo.save).toHaveBeenCalled();
  });

  it("debería lanzar error si el todo no existe", async () => {
    todoRepo.findById.mockResolvedValue(null);
    await expect(
      useCase.execute("1", "Nuevo título", "Nueva desc"),
    ).rejects.toThrow();
  });
});
