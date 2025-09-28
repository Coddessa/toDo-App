import { create } from "zustand";
import type { TodoType } from "./useTodos";

type UseTodoType = {
  todo: TodoType | null;
  setTodo: (todo: TodoType | null) => void;
};

export const useTodo = create<UseTodoType>((set) => ({
  todo: null,
  setTodo: (todo) => set({ todo }),
}));
