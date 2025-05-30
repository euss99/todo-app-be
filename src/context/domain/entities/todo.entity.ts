import { TodoStatus } from "@/context/domain/enums/todo-status.enum";

export class Todo {
  private readonly id: string;
  private title: string;
  private description: string;
  private readonly userId: string;
  private status: TodoStatus;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    title: string,
    description: string,
    userId: string,
    status: TodoStatus = TodoStatus.PENDING,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.userId = userId;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getUserId(): string {
    return this.userId;
  }

  getStatus(): TodoStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateStatus(status: TodoStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  updateTodo(title?: string, description?: string): Todo {
    if (title) this.title = title;
    if (description) this.description = description;
    this.updatedAt = new Date();

    return this;
  }
}
