import { DeleteTodoUseCase } from "@/context/application/use-cases/todo/delete-todo.use-case";
import { Todo } from "@/context/domain/entities/todo.entity";
import { TodoStatus } from "@/context/domain/enums/todo-status.enum";
import { TodoRepository } from "@/context/domain/interfaces/todo.repository.interface";

describe("DeleteTodoUseCase", () => {
  let useCase: DeleteTodoUseCase;
  let todoRepo: jest.Mocked<TodoRepository>;

  beforeEach(() => {
    todoRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      findByUserId: jest.fn(),
    };
    useCase = new DeleteTodoUseCase(todoRepo as TodoRepository);
  });

  it("debería eliminar un todo correctamente", async () => {
    const existingTodo = new Todo(
      "1",
      "Título",
      "Desc",
      "user1",
      TodoStatus.PENDING,
      new Date(),
      new Date(),
    );
    todoRepo.findById.mockResolvedValue(existingTodo);
    todoRepo.delete.mockResolvedValue(undefined);

    await expect(useCase.execute("1")).resolves.toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(todoRepo.delete).toHaveBeenCalledWith("1");
  });

  it("debería lanzar error si el todo no existe", async () => {
    todoRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute("1")).rejects.toThrow();
  });
});
