import iconCross from "../../assets/icon-cross.svg";

interface BoardFormModalProps {
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: () => void;
  name: string;
  setName: (val: string) => void;
  columns: string[];
  setColumns: (val: string[]) => void;
  errors: { boardName: boolean; columns: number[] };
}

const BoardFormModal = ({
  mode,
  onClose,
  onSubmit,
  name,
  setName,
  columns,
  setColumns,
  errors,
}: BoardFormModalProps) => {
  let handleColumnChange = (index: number, value: string) => {
    let updated = [...columns];
    updated[index] = value;
    setColumns(updated);
  };

  let removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  let addColumn = () => {
    setColumns([...columns, ""]);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          {mode === "create" ? "Add New Board" : "Edit Board"}
        </h2>

        <div className="input-group">
          <div className="label-container">
            <label className="input-label">Board Name</label>
            {errors.boardName && (
              <span className="error-text">Can't be empty</span>
            )}
          </div>
          <input
            type="text"
            className={`modal-input ${errors.boardName ? "input-error" : ""}`}
            placeholder="e.g. Web Design"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Board Columns</label>
          {columns.map((col, i) => (
            <div key={i} className="subtask-input-row">
              <div className="input-wrapper">
                <input
                  type="text"
                  className={`modal-input ${errors.columns.includes(i) ? "input-error" : ""}`}
                  placeholder="e.g. Todo"
                  value={col}
                  onChange={(e) => handleColumnChange(i, e.target.value)}
                />
                {errors.columns.includes(i) && (
                  <span className="error-text">Can't be empty</span>
                )}
              </div>
              <img
                src={iconCross}
                alt="remove"
                className="remove-subtask"
                onClick={() => removeColumn(i)}
              />
            </div>
          ))}
          <button className="secondary-btn" onClick={addColumn}>
            + Add New Column
          </button>
        </div>

        <button className="primary-btn full-width" onClick={onSubmit}>
          {mode === "create" ? "Create New Board" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default BoardFormModal;