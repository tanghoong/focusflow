import { openDB, DBSchema, IDBPDatabase } from 'idb';

import type { Task, Board, List } from '@/types';

interface FocusFlowDB extends DBSchema {
  tasks: {
    key: string;
    value: Task;
    indexes: { 'by-board': string };
  };
  boards: {
    key: string;
    value: Board;
  };
  lists: {
    key: string;
    value: List;
    indexes: { 'by-board': string };
  };
}

let dbPromise: Promise<IDBPDatabase<FocusFlowDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<FocusFlowDB>('focusflow-db', 1, {
      upgrade(db: IDBPDatabase<FocusFlowDB>) {
        const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
        taskStore.createIndex('by-board', 'boardId');

        db.createObjectStore('boards', { keyPath: 'id' });

        const listStore = db.createObjectStore('lists', { keyPath: 'id' });
        listStore.createIndex('by-board', 'boardId');
      },
    });
  }
  return dbPromise;
}

// CRUD operations for tasks
export async function getTasks(boardId: string): Promise<Task[]> {
  if (typeof window === 'undefined') return [];
  const db = await getDB();
  return db.getAllFromIndex('tasks', 'by-board', boardId);
}

export async function addTask(task: Task): Promise<string> {
  if (typeof window === 'undefined') throw new Error('Cannot add task on server');
  const db = await getDB();
  return db.add('tasks', task);
}

export async function updateTask(task: Task): Promise<string> {
  if (typeof window === 'undefined') throw new Error('Cannot update task on server');
  const db = await getDB();
  return db.put('tasks', task);
}

export async function deleteTask(taskId: string): Promise<void> {
  if (typeof window === 'undefined') throw new Error('Cannot delete task on server');
  const db = await getDB();
  return db.delete('tasks', taskId);
}

// CRUD operations for boards
export async function getBoards(): Promise<Board[]> {
  if (typeof window === 'undefined') return [];
  const db = await getDB();
  return db.getAll('boards');
}

export async function addBoard(board: Board): Promise<string> {
  if (typeof window === 'undefined') throw new Error('Cannot add board on server');
  const db = await getDB();
  return db.add('boards', board);
}

export async function updateBoard(board: Board): Promise<string> {
  if (typeof window === 'undefined') throw new Error('Cannot update board on server');
  const db = await getDB();
  return db.put('boards', board);
}

export async function deleteBoard(boardId: string): Promise<void> {
  if (typeof window === 'undefined') throw new Error('Cannot delete board on server');
  const db = await getDB();
  return db.delete('boards', boardId);
}

// CRUD operations for lists
export async function getLists(boardId: string): Promise<List[]> {
  if (typeof window === 'undefined') return [];
  const db = await getDB();
  return db.getAllFromIndex('lists', 'by-board', boardId);
}

export async function addList(list: List): Promise<string> {
  if (typeof window === 'undefined') throw new Error('Cannot add list on server');
  const db = await getDB();
  return db.add('lists', list);
}

export async function updateList(list: List): Promise<string> {
  if (typeof window === 'undefined') throw new Error('Cannot update list on server');
  const db = await getDB();
  return db.put('lists', list);
}

export async function deleteList(listId: string): Promise<void> {
  if (typeof window === 'undefined') throw new Error('Cannot delete list on server');
  const db = await getDB();
  return db.delete('lists', listId);
}

// Add this new function to the existing file
export async function getBoard(boardId: string): Promise<Board | undefined> {
  if (typeof window === 'undefined') return undefined;
  const db = await getDB();
  return db.get('boards', boardId);
}

// Add this new function
export async function reorderBoards(boards: Board[]): Promise<void> {
  if (typeof window === 'undefined') throw new Error('Cannot reorder boards on server');
  const db = await getDB();
  const tx = db.transaction('boards', 'readwrite');
  await Promise.all(boards.map((board, index) => tx.store.put({ ...board, order: index } as Board)));
  await tx.done;
}

// Add this function at the end of the file
export async function resetDatabase(): Promise<void> {
  if (typeof window === 'undefined') throw new Error('Cannot reset database on server');
  const db = await getDB();
  const tx = db.transaction(['boards', 'lists', 'tasks'], 'readwrite');
  await tx.objectStore('boards').clear();
  await tx.objectStore('lists').clear();
  await tx.objectStore('tasks').clear();
  await tx.done;
}