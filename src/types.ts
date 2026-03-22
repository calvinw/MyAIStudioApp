export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum Category {
  WORK = "WORK",
  PERSONAL = "PERSONAL",
  SHOPPING = "SHOPPING",
  HEALTH = "HEALTH",
  OTHER = "OTHER",
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate?: string;
  createdAt: string;
}

export type TodoFilter = "ALL" | "ACTIVE" | "COMPLETED";
