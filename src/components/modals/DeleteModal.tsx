interface DeleteModalProps {
  type: "task" | "board";
  title: string;
  onClose: () => void;
  onDelete: () => void;
} 

const DeleteModal = ({ type, title, onClose, onDelete }: DeleteModalProps) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title delete-title">Delete this {type}?</h2>
        <p className="delete-warning">
          {type === "board"
            ? `Are you sure you want to delete the '${title}' board? This action will remove all columns and tasks and cannot be reversed.`
            : `Are you sure you want to delete the '${title}' task and its subtasks? This action cannot be reversed.`}
        </p>
        <div className="delete-modal-actions">
          <button className="delete-btn-confirm" onClick={onDelete}>
            Delete
          </button>
          <button className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
