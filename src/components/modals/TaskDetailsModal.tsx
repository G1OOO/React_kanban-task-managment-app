import type { Task, Board } from "../../types";
import iconEllipsis from "../../assets/icon-vertical-ellipsis.svg";
import iconChevronDown from "../../assets/icon-chevron-down.svg";
import iconChevronUp from "../../assets/icon-chevron-up.svg";

interface TaskDetailsModalProps {
  selectedTask: Task;
  currentBoard: Board;
  setSelectedTask: (task: Task | null) => void;
  toggleSubtask: (index: number) => void;
  handleStatusChange: (status: string) => void;
  showStatusDropdown: boolean;
  setShowStatusDropdown: (show: boolean) => void;
  showTaskMoreMenu: boolean;
  setShowTaskMoreMenu: (show: boolean) => void;
  handleOpenEditTask: () => void;
  setIsDeleteTaskModalOpen: (open: boolean) => void;
}

const TaskDetailsModal = ({
  selectedTask,
  currentBoard,
  setSelectedTask,
  toggleSubtask,
  handleStatusChange,
  showStatusDropdown,
  setShowStatusDropdown,
  showTaskMoreMenu,
  setShowTaskMoreMenu,
  handleOpenEditTask,
  setIsDeleteTaskModalOpen,
}: TaskDetailsModalProps) => {
  return (
    <div
      className="modal-backdrop"
      onClick={() => {
        setSelectedTask(null);
        setShowStatusDropdown(false);
        setShowTaskMoreMenu(false);
      }}
    >
      <div
        className="modal-content task-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 className="task-title-modal">{selectedTask.title}</h2>
          <div className="ellipsis-container">
            <button
              className="more-btn"
              onClick={() => setShowTaskMoreMenu(!showTaskMoreMenu)}
            >
              <img src={iconEllipsis} alt="options" />
            </button>
            {showTaskMoreMenu && (
              <div className="context-menu task-menu">
                <button
                  className="menu-item edit-item"
                  onClick={handleOpenEditTask}
                >
                  Edit Task
                </button>
                <button
                  className="menu-item delete-item"
                  onClick={() => {
                    setIsDeleteTaskModalOpen(true);
                    setShowTaskMoreMenu(false);
                  }}
                >
                  Delete Task
                </button>
              </div>
            )}
          </div>
        </header>
        <p className="task-description">{selectedTask.description}</p>
        <div className="subtasks-section">
          <p className="subtasks-count">
            Subtasks (
            {selectedTask.subtasks.filter((s) => s.isCompleted).length} of{" "}
            {selectedTask.subtasks.length})
          </p>
          <div className="subtask-list">
            {selectedTask.subtasks.map((sub, i) => (
              <div
                key={i}
                className={`subtask-item ${sub.isCompleted ? "completed" : ""}`}
                onClick={() => toggleSubtask(i)}
              >
                <input type="checkbox" checked={sub.isCompleted} readOnly />
                <label>{sub.title}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="status-section">
          <p className="status-label">Current Status</p>
          <div className="dropdown-container">
            <div
              className={`status-dropdown ${showStatusDropdown ? "active-border" : ""}`}
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              {selectedTask.status}
              <img
                src={showStatusDropdown ? iconChevronUp : iconChevronDown}
                alt="chevron"
              />
            </div>
            {showStatusDropdown && (
              <div className="dropdown-options">
                {currentBoard.columns.map((col) => (
                  <div
                    key={col.name}
                    className="option"
                    onClick={() => handleStatusChange(col.name)}
                  >
                    {col.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;