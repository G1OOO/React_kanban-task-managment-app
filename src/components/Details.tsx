import { useState, useEffect } from "react";
import iconEllipsis from "../assets/icon-vertical-ellipsis.svg";

interface DetailsProps {
  task: Task;
  columns: Column[];
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onSubtaskToggle: (index: number) => void;
  onEditTask: () => void;
  onDeleteTask: () => void;
}

const Details = ({
  task,
  columns,
  onClose,
  onStatusChange,
  onSubtaskToggle,
  onEditTask,
  onDeleteTask,
}: DetailsProps) => {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const liveTask =
    columns.flatMap((c) => c.tasks).find((t) => t.title === task.title) || task;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="details-header">
          <h2 className="task-detail-title">{liveTask.title}</h2>

          <div className="menu-anchor">
            <img
              src={iconEllipsis}
              className="ellipsis-icon"
              onClick={() => setShowMenu((prev) => !prev)}
            />

            {showMenu && (
              <div className="dropdown-menu">
                <p onClick={onEditTask}>Edit Task</p>
                <p className="destructive" onClick={onDeleteTask}>
                  Delete Task
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="task-description">
          {liveTask.description || "No description provided."}
        </p>

        <div className="subtasks-section">
          <h4 className="subtask-label">
            Subtasks ({liveTask.subtasks.filter((s) => s.isCompleted).length} of{" "}
            {liveTask.subtasks.length})
          </h4>

          <div className="">
            {liveTask.subtasks.map((sub, i) => (
              <label
                key={`${liveTask.title}-${i}`}
                className={`subtask-item ${sub.isCompleted ? "completed" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={sub.isCompleted}
                  onChange={() => onSubtaskToggle(i)}
                />
                <span className="subtask-text">{sub.title}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="status-section">
          <label className="input-label">Current Status</label>

          <select
            className="modal-select"
            value={liveTask.status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            {columns.map((col) => (
              <option key={col.name} value={col.name}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Details;
