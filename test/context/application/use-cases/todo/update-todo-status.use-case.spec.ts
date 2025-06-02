import { UpdateTodoStatusUseCase } from "@/context/application/use-cases/todo/update-todo-status.use-case";
import { Todo } from "@/context/domain/entities/todo.entity";
import { TodoStatus } from "@/context/domain/enums/todo-status.enum";
import { TodoRepository } from "@/context/domain/interfaces/todo.repository.interface";

describe("UpdateTodoStatusUseCase", () => {
  let useCase: UpdateTodoStatusUseCase;
  let todoRepo: jest.Mocked<TodoRepository>;

  beforeEach(() => {
    todoRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      findByUserId: jest.fn(),
    };
    useCase = new UpdateTodoStatusUseCase(todoRepo as TodoRepository);
  });

  it("debería actualizar el status de un todo existente", async () => {
    const todo = new Todo(
      "1",
      "Título",
      "Desc",
      "user1",
      TodoStatus.PENDING,
      new Date(),
      new Date(),
    );
    todoRepo.findById.mockResolvedValue(todo);
    todoRepo.save.mockImplementation(async (todo) => Promise.resolve(todo));

    const updated = await useCase.execute("1", TodoStatus.COMPLETED);

    expect(updated.getStatus()).toBe(TodoStatus.COMPLETED);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(todoRepo.save).toHaveBeenCalledWith(todo);
  });

  it("debería lanzar error si el todo no existe", async () => {
    todoRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute("1", TodoStatus.COMPLETED)).rejects.toThrow(
      "Todo not found",
    );
  });
});
