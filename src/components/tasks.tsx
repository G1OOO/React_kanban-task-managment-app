import { useState } from "react";
import Kanban from "./Kanban";
import Details from "./Details";
import New from "./New";
import NewBoard from "./NewBoard";
import EditBoard from "./EditBoard";
import DeleteBoard from "./DeleteBoard";
import DeleteTask from "./DeleteTask";
import EditTask from "./EditTask";

interface TasksProps {
  board: Board;
  setBoards: any;
  isDark: boolean;
  isAddTaskModalOpen: boolean;
  setIsAddTaskModalOpen: (val: boolean) => void;
  isNewBoardModalOpen: boolean;
  setIsNewBoardModalOpen: (val: boolean) => void;
  isEditBoardModalOpen: boolean;
  setIsEditBoardModalOpen: (val: boolean) => void;
  isDeleteBoardModalOpen: boolean;
  setIsDeleteBoardModalOpen: (val: boolean) => void;
}

const Tasks = ({
  board,
  setBoards,
  isDark,
  isAddTaskModalOpen,
  setIsAddTaskModalOpen,
  isNewBoardModalOpen,
  setIsNewBoardModalOpen,
  isEditBoardModalOpen,
  setIsEditBoardModalOpen,
  isDeleteBoardModalOpen,
  setIsDeleteBoardModalOpen,
}: TasksProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowDetails(true);
  };

  const handleToggleSubtask = (subIndex: number) => {
    console.log("text");
    if (!selectedTask) return;

    setBoards((prev: Board[]) => {
      const updatedBoards = prev.map((b) => {
        if (b.name !== board.name) return b;

        console.log("board", b.name);
        return {
          ...b,
          columns: b.columns.map((col) => ({
            ...col,
            tasks: col.tasks.map((task) => {
              if (task.title !== selectedTask.title) return task;
              console.log("task", task.title);
              console.log("sub-index", subIndex);
              const updatedTask = {
                ...task,
                subtasks: task.subtasks.map((sub, i) =>
                  i === subIndex
                    ? { ...sub, isCompleted: !sub.isCompleted }
                    : sub,
                ),
              };

              return updatedTask;
            }),
          })),
        };
      });

      const freshTask =
        updatedBoards
          .find((b) => b.name === board.name)
          ?.columns.flatMap((c) => c.tasks)
          .find((t) => t.title === selectedTask.title) || null;

      setSelectedTask(freshTask);

      return updatedBoards;
    });
  };

  const handleStatusChange = (newStatus: string) => {
    if (!selectedTask || selectedTask.status === newStatus) return;

    setBoards((prev: Board[]) => {
      const updatedBoards = prev.map((b) => {
        if (b.name !== board.name) return b;

        let movedTask: Task | null = null;

        const withoutTask = b.columns.map((col) => {
          if (col.name === selectedTask.status) {
            const filtered = col.tasks.filter((t) => {
              if (t.title === selectedTask.title) {
                movedTask = { ...t, status: newStatus };
                return false;
              }
              return true;
            });

            return { ...col, tasks: filtered };
          }
          return col;
        });

        return {
          ...b,
          columns: withoutTask.map((col) => {
            if (col.name === newStatus && movedTask) {
              return { ...col, tasks: [...col.tasks, movedTask] };
            }
            return col;
          }),
        };
      });

      const freshTask =
        updatedBoards
          .find((b) => b.name === board.name)
          ?.columns.flatMap((c) => c.tasks)
          .find((t) => t.title === selectedTask.title) || null;

      setSelectedTask(freshTask);
      setShowDetails(false);

      return updatedBoards;
    });
  };

  const handleDeleteTask = () => {
    setBoards((prev: Board[]) =>
      prev.map((b) => {
        if (b.name !== board.name) return b;

        return {
          ...b,
          columns: b.columns.map((col) => ({
            ...col,
            tasks: col.tasks.filter(
              (task) => task.title !== selectedTask?.title,
            ),
          })),
        };
      }),
    );

    setSelectedTask(null);
    setIsDeleteTaskModalOpen(false);
  };

  return (
    <div className={`tasks-view ${isDark ? "dark" : "light"}`}>
      <Kanban
        board={board}
        onTaskClick={handleTaskClick}
        openEditBoard={() => setIsEditBoardModalOpen(true)}
        isDark={isDark}
      />

      {showDetails && selectedTask && (
        <Details
          task={selectedTask}
          columns={board.columns}
          onClose={() => setShowDetails(false)}
          onStatusChange={handleStatusChange}
          onSubtaskToggle={handleToggleSubtask}
          onEditTask={() => {
            setShowDetails(false);
            setIsEditTaskModalOpen(true);
          }}
          onDeleteTask={() => {
            setShowDetails(false);
            setIsDeleteTaskModalOpen(true);
          }}
        />
      )}

      {isAddTaskModalOpen && (
        <New
          columns={board.columns}
          onClose={() => setIsAddTaskModalOpen(false)}
          onSave={(newTask) => {
            setBoards((prev: Board[]) =>
              prev.map((b) => {
                if (b.name !== board.name) return b;

                return {
                  ...b,
                  columns: b.columns.map((col) =>
                    col.name === newTask.status
                      ? { ...col, tasks: [...col.tasks, newTask] }
                      : col,
                  ),
                };
              }),
            );

            setIsAddTaskModalOpen(false);
          }}
        />
      )}

      {isNewBoardModalOpen && (
        <NewBoard
          onClose={() => setIsNewBoardModalOpen(false)}
          onSave={(name, cols) => {
            setBoards((prev: Board[]) => [
              ...prev,
              {
                name,
                columns: cols.map((col) => ({
                  name: col,
                  tasks: [],
                })),
              },
            ]);

            setIsNewBoardModalOpen(false);
          }}
        />
      )}

      {isEditBoardModalOpen && (
        <EditBoard
          board={board}
          onClose={() => setIsEditBoardModalOpen(false)}
          onSave={(newName, newCols) => {
            setBoards((prev: Board[]) =>
              prev.map((b) =>
                b.name === board.name
                  ? {
                      ...b,
                      name: newName,
                      columns: newCols.map((col) => ({
                        name: col,
                        tasks: [],
                      })),
                    }
                  : b,
              ),
            );

            setIsEditBoardModalOpen(false);
          }}
        />
      )}

      {isDeleteBoardModalOpen && (
        <DeleteBoard
          boardName={board.name}
          onCancel={() => setIsDeleteBoardModalOpen(false)}
          onDelete={() => {
            setBoards((prev: Board[]) =>
              prev.filter((b) => b.name !== board.name),
            );

            setIsDeleteBoardModalOpen(false);
          }}
        />
      )}

      {isEditTaskModalOpen && selectedTask && (
        <EditTask
          task={selectedTask}
          columns={board.columns}
          onClose={() => setIsEditTaskModalOpen(false)}
          onSave={(updatedTask) => {
            setBoards((prev: Board[]) =>
              prev.map((b) => {
                if (b.name !== board.name) return b;

                return {
                  ...b,
                  columns: b.columns.map((col) => ({
                    ...col,
                    tasks: col.tasks.map((t) =>
                      t.title === selectedTask.title ? updatedTask : t,
                    ),
                  })),
                };
              }),
            );

            setSelectedTask(updatedTask);
            setIsEditTaskModalOpen(false);
          }}
        />
      )}

      {isDeleteTaskModalOpen && selectedTask && (
        <DeleteTask
          taskTitle={selectedTask.title}
          onCancel={() => setIsDeleteTaskModalOpen(false)}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default Tasks;
