export interface Task {
  id: string;
  title: string;
  description?: string;
  listId: string;
  boardId: string;
  order: number;
  // Add other task properties as needed
}

export interface List {
  id: string;
  title: string;
  boardId: string;
  order: number;
  // Add other list properties as needed
}

export interface Board {
  id: string;
  title: string;
  // Add other board properties as needed
}
