import type { Board, Task } from "../types";
import TaskCard from "./TaskCard";

interface BoardDisplayProps {
  currentBoard: Board | undefined;
  handleCardClick: (task: Task) => void;
  openEditBoard: () => void;
}

const BoardDisplay = ({
  currentBoard,
  handleCardClick,
  openEditBoard,
}: BoardDisplayProps) => {
  return (
    <div className="board-columns">
      {currentBoard?.columns.map((column, colIdx) => (
        <div key={colIdx} className="column">
          <h2 className="column-title">
            <span
              className="dot"
              style={{
                backgroundColor:
                  colIdx === 0
                    ? "#49C4E5"
                    : colIdx === 1
                      ? "#8471F2"
                      : "#67E2AE",
              }}
            ></span>
            {column.name} ({column.tasks.length})
          </h2>
          <div className="task-list">
            {column.tasks.map((task, taskIdx) => (
              <TaskCard
                key={taskIdx}
                task={task}
                onClick={() => handleCardClick(task)}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="new-column-placeholder" onClick={openEditBoard}>
        + New Column
      </div>
    </div>
  );
};

export default BoardDisplay;