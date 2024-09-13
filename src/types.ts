export interface Task {
  id: string;
  title: string;
  description?: string;
  listId: string;
  boardId: string;
  order: number;
  isRepeated?: boolean;
  isCompleted?: boolean;
  pomodoroCount?: number;
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
  type?: string;
  description?: string;
  lists?: string[];
  isPinned?: boolean;
}
