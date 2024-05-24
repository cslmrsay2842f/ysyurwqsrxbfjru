import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface TaskState {
  key: string;
  value: string;
}

export const useTaskStore = create<{
  tasks: TaskState[];
  addTask: (key: string, value: string) => void;
  removeTask: (key: string, value: string) => void;
}>()(
  devtools(
    (set) => ({
      // Initial state of tasks
      tasks: [],
      addTask: (key: string, value: string) =>
        set((store) => ({
          tasks: [...store.tasks, { key, value }],
        })),
      // Remove task from existing state
      removeTask: (title: string) =>
        set((store) => ({
          tasks: store.tasks.filter((task) => task.key !== title),
        })),
    }),
    {
      name: "task-storage",
    }
  )
);
