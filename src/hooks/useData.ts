import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as db from '@/lib/db';
import { Task, Board, List } from '@/types';

// Task hooks
export function useTasks(boardId: string) {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', boardId],
    queryFn: () => db.getTasks(boardId),
  });
}

export function useAddTask() {
  const queryClient = useQueryClient();
  return useMutation<string, Error, Task>({
    mutationFn: db.addTask,
    onSuccess: (_, newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', newTask.boardId] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation<string, Error, Task>({
    mutationFn: db.updateTask,
    onSuccess: (_, updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', updatedTask.boardId] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: db.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// Board hooks
export function useBoards() {
  return useQuery<Board[], Error>({
    queryKey: ['boards'],
    queryFn: db.getBoards,
  });
}

export function useAddBoard() {
  const queryClient = useQueryClient();
  return useMutation<string, Error, Board>({
    mutationFn: async (board) => {
      const boardId = await db.addBoard(board);
      // If the board has predefined lists, add them
      if (board.lists) {
        const listPromises = board.lists.map((listTitle, index) => 
          db.addList({
            id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            boardId,
            title: listTitle,
            order: index,
          })
        );
        await Promise.all(listPromises);
      }
      return boardId;
    },
    onSuccess: (boardId) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['lists', boardId] });
    },
  });
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();
  return useMutation<string, Error, Board>({
    mutationFn: db.updateBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: db.deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

// List hooks
export function useLists(boardId: string) {
  return useQuery<List[], Error>({
    queryKey: ['lists', boardId],
    queryFn: () => db.getLists(boardId),
  });
}

export function useAddList() {
  const queryClient = useQueryClient();
  return useMutation<string, Error, List>({
    mutationFn: db.addList,
    onSuccess: (_, newList) => {
      queryClient.invalidateQueries({ queryKey: ['lists', newList.boardId] });
    },
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();
  return useMutation<string, Error, List>({
    mutationFn: db.updateList,
    onSuccess: (_, updatedList) => {
      queryClient.invalidateQueries({ queryKey: ['lists', updatedList.boardId] });
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: db.deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
}

// Update the useBoard hook
export function useBoard(boardId: string) {
  return useQuery<Board | undefined, Error>({
    queryKey: ['board', boardId],
    queryFn: () => db.getBoard(boardId),
  });
}

// Add this new hook
export function useReorderBoards() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, Board[]>({
    mutationFn: db.reorderBoards,
    onSuccess: (_, updatedBoards) => {
      queryClient.setQueryData(['boards'], updatedBoards);
    },
  });
}