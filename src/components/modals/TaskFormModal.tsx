import type { Board, Subtask } from "../../types";
import iconCross from "../../assets/icon-cross.svg";
import iconChevronDown from "../../assets/icon-chevron-down.svg";
import iconChevronUp from "../../assets/icon-chevron-up.svg";

interface TaskFormModalProps {
  mode: "create" | "edit";
  currentBoard: Board;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  subtasks: Subtask[];
  setSubtasks: (val: Subtask[]) => void;
  status: string;
  setStatus: (val: string) => void;
  showStatusDropdown: boolean;
  setShowStatusDropdown: (show: boolean) => void;
  errors: { title: boolean; subtasks: number[] };
}

const TaskFormModal = ({
  mode,
  currentBoard,
  onClose,
  onSubmit,
  title,
  setTitle,
  description,
  setDescription,
  subtasks,
  setSubtasks,
  status,
  setStatus,
  showStatusDropdown,
  setShowStatusDropdown,
  errors,
}: TaskFormModalProps) => {
  let handleSubtaskChange = (index: number, value: string) => {
    let updated = [...subtasks];
    updated[index] = { ...updated[index], title: value };
    setSubtasks(updated);
  };

  let removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  let addSubtask = () => {
    setSubtasks([...subtasks, { title: "", isCompleted: false }]);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          {mode === "create" ? "Add New Task" : "Edit Task"}
        </h2>

        <div className="input-group">
          <div className="label-container">
            <label className="input-label">Title</label>
            {errors.title && <span className="error-text">Can't be empty</span>}
          </div>
          <input
            type="text"
            className={`modal-input ${errors.title ? "input-error" : ""}`}
            placeholder="e.g. Take coffee break"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Description</label>
          <textarea
            className="modal-input modal-textarea"
            placeholder="e.g. It's always good to take a break."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Subtasks</label>
          {subtasks.map((sub, i) => (
            <div key={i} className="subtask-input-row">
              <div className="input-wrapper">
                <input
                  type="text"
                  className={`modal-input ${errors.subtasks.includes(i) ? "input-error" : ""}`}
                  placeholder="e.g. Make coffee"
                  value={sub.title}
                  onChange={(e) => handleSubtaskChange(i, e.target.value)}
                />
                {errors.subtasks.includes(i) && (
                  <span className="error-text">Can't be empty</span>
                )}
              </div>
              <img
                src={iconCross}
                alt="remove"
                className="remove-subtask"
                onClick={() => removeSubtask(i)}
              />
            </div>
          ))}
          <button className="secondary-btn" onClick={addSubtask}>
            + Add New Subtask
          </button>
        </div>

        <div className="input-group">
          <label className="input-label">Status</label>
          <div className="dropdown-container">
            <div
              className={`status-dropdown ${showStatusDropdown ? "active-border" : ""}`}
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              {status}
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
                    onClick={() => {
                      setStatus(col.name);
                      setShowStatusDropdown(false);
                    }}
                  >
                    {col.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="primary-btn full-width" onClick={onSubmit}>
          {mode === "create" ? "Create Task" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default TaskFormModal;