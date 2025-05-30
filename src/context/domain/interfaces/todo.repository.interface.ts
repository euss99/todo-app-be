import { Todo } from "@/context/domain/entities/todo.entity";

export interface TodoRepository {
  save(todo: Todo): Promise<Todo>;
  findById(id: string): Promise<Todo | null>;
  findByUserId(userId: string): Promise<Todo[]>;
  findAll(): Promise<Todo[]>;
  delete(id: string): Promise<void>;
}
