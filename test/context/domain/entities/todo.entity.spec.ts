import { Todo } from "@/context/domain/entities/todo.entity";
import { TodoStatus } from "@/context/domain/enums/todo-status.enum";

describe("Todo Entity", () => {
  it("debería exponer los datos correctamente", () => {
    const now = new Date();
    const todo = new Todo(
      "1",
      "title",
      "desc",
      "user1",
      TodoStatus.PENDING,
      now,
      now,
    );

    expect(todo.getId()).toBe("1");
    expect(todo.getTitle()).toBe("title");
    expect(todo.getDescription()).toBe("desc");
    expect(todo.getUserId()).toBe("user1");
    expect(todo.getStatus()).toBe(TodoStatus.PENDING);
    expect(todo.getCreatedAt()).toBe(now);
    expect(todo.getUpdatedAt()).toBe(now);
  });

  it("debería actualizar el status", () => {
    const todo = new Todo(
      "1",
      "title",
      "desc",
      "user1",
      TodoStatus.PENDING,
      new Date(),
      new Date(),
    );
    todo.updateStatus(TodoStatus.COMPLETED);
    expect(todo.getStatus()).toBe(TodoStatus.COMPLETED);
  });

  it("debería actualizar el título y descripción", () => {
    const todo = new Todo(
      "1",
      "title",
      "desc",
      "user1",
      TodoStatus.PENDING,
      new Date(),
      new Date(),
    );
    todo.updateTodo("nuevo título", "nueva desc");
    expect(todo.getTitle()).toBe("nuevo título");
    expect(todo.getDescription()).toBe("nueva desc");
  });
});
