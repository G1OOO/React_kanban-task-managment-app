import { useState, useEffect } from "react";
import "./Main.css";
import data from "../data.json";

import logoLight from "../assets/logo-light.svg";
import logoDark from "../assets/logo-dark.svg";
import iconBoard from "../assets/icon-board.svg";
import iconHide from "../assets/icon-hide-sidebar.svg";
import iconShow from "../assets/icon-show-sidebar.svg";
import iconLight from "../assets/icon-light-theme.svg";
import iconDark from "../assets/icon-dark-theme.svg";
import iconEllipsis from "../assets/icon-vertical-ellipsis.svg";
import iconChevronDown from "../assets/icon-chevron-down.svg";
import iconChevronUp from "../assets/icon-chevron-up.svg";
import iconCross from "../assets/icon-cross.svg";

interface Subtask {
  title: string;
  isCompleted: boolean;
}

interface Task {
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
}

interface Column {
  name: string;
  tasks: Task[];
}

interface Board {
  name: string;
  columns: Column[];
}

const Main = () => {
  let [boards, setBoards] = useState<Board[]>(data.boards);
  let [activeBoardIndex, setActiveBoardIndex] = useState(0);
  let [isSidePanelVisible, setIsSidePanelVisible] = useState(true);
  let [isDarkTheme, setIsDarkTheme] = useState(true);

  let [selectedTask, setSelectedTask] = useState<Task | null>(null);
  let [showStatusDropdown, setShowStatusDropdown] = useState(false);

  let [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  let [newTaskTitle, setNewTaskTitle] = useState("");
  let [newTaskDescription, setNewTaskDescription] = useState("");
  let [newTaskSubtasks, setNewTaskSubtasks] = useState(["", ""]);
  let [newTaskStatus, setNewTaskStatus] = useState("");
  let [showAddTaskStatusDropdown, setShowAddTaskStatusDropdown] =
    useState(false);

  let [errors, setErrors] = useState({
    title: false,
    subtasks: [] as number[],
    boardName: false,
    columns: [] as number[],
  });

  let [showTaskMoreMenu, setShowTaskMoreMenu] = useState(false);
  let [showBoardMoreMenu, setShowBoardMoreMenu] = useState(false);
  let [isEditTaskMode, setIsEditTaskMode] = useState(false);
  let [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  let [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);

  let [editTaskTitle, setEditTaskTitle] = useState("");
  let [editTaskDescription, setEditTaskDescription] = useState("");
  let [editTaskSubtasks, setEditTaskSubtasks] = useState<Subtask[]>([]);
  let [editTaskStatus, setEditTaskStatus] = useState("");
  let [showEditStatusDropdown, setShowEditStatusDropdown] = useState(false);

  let [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  let [boardModalMode, setBoardModalMode] = useState<"create" | "edit">(
    "create",
  );
  let [newBoardName, setNewBoardName] = useState("");
  let [newBoardColumns, setNewBoardColumns] = useState(["Todo", "Doing"]);

  let currentBoard = boards[activeBoardIndex];

  useEffect(() => {
    document.title = "Document";
    if (currentBoard && currentBoard.columns.length > 0 && !newTaskStatus) {
      setNewTaskStatus(currentBoard.columns[0].name);
    }
  }, [activeBoardIndex, currentBoard, newTaskStatus]);

  let handleCardClick = (task: Task) => {
    setSelectedTask(task);
  };

  let toggleSubtask = (subtaskIndex: number) => {
    if (!selectedTask) return;
    let updatedBoards = [...boards];
    let taskInState = updatedBoards[activeBoardIndex].columns
      .flatMap((col) => col.tasks)
      .find((t) => t.title === selectedTask?.title);
    if (taskInState) {
      taskInState.subtasks[subtaskIndex].isCompleted =
        !taskInState.subtasks[subtaskIndex].isCompleted;
      setBoards(updatedBoards);
      setSelectedTask({ ...taskInState });
    }
  };

  let handleStatusChange = (newStatus: string) => {
    if (!selectedTask || selectedTask.status === newStatus) {
      setShowStatusDropdown(false);
      return;
    }
    let updatedBoards = [...boards];
    let currentBoardState = updatedBoards[activeBoardIndex];
    let sourceColumn = currentBoardState.columns.find((col) =>
      col.tasks.some((t) => t.title === selectedTask?.title),
    );
    let targetColumn = currentBoardState.columns.find(
      (col) => col.name === newStatus,
    );
    if (sourceColumn && targetColumn) {
      sourceColumn.tasks = sourceColumn.tasks.filter(
        (t) => t.title !== selectedTask?.title,
      );
      let updatedTask = { ...selectedTask, status: newStatus };
      targetColumn.tasks.push(updatedTask);
      setBoards(updatedBoards);
      setSelectedTask(updatedTask);
      setShowStatusDropdown(false);
    }
  };

  let handleCreateTask = () => {
    let titleErr = newTaskTitle.trim() === "";
    let subErr: number[] = [];
    newTaskSubtasks.forEach((sub, i) => {
      if (sub.trim() === "") subErr.push(i);
    });

    if (titleErr || subErr.length > 0) {
      setErrors((prev) => ({ ...prev, title: titleErr, subtasks: subErr }));
      return;
    }

    let newTask: Task = {
      title: newTaskTitle,
      description: newTaskDescription,
      status: newTaskStatus,
      subtasks: newTaskSubtasks.map((s) => ({ title: s, isCompleted: false })),
    };

    let updatedBoards = [...boards];
    let targetColumn = updatedBoards[activeBoardIndex].columns.find(
      (col) => col.name === newTaskStatus,
    );
    if (targetColumn) {
      targetColumn.tasks.push(newTask);
      setBoards(updatedBoards);
      setIsAddTaskModalOpen(false);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskSubtasks(["", ""]);
      setErrors((prev) => ({ ...prev, title: false, subtasks: [] }));
    }
  }; 

  let handleOpenEditTask = () => {
    if (!selectedTask) return;
    setEditTaskTitle(selectedTask.title);
    setEditTaskDescription(selectedTask.description);
    setEditTaskSubtasks(selectedTask.subtasks.map((s) => ({ ...s })));
    setEditTaskStatus(selectedTask.status);
    setIsEditTaskMode(true);
    setShowTaskMoreMenu(false);
  };

  let handleSaveChanges = () => {
    if (!selectedTask || !editTaskTitle.trim()) return;

    let updatedBoards = [...boards];
    let currentBoardState = updatedBoards[activeBoardIndex];
    let sourceColumn = currentBoardState.columns.find((col) =>
      col.tasks.some((t) => t.title === selectedTask?.title),
    );
    let targetColumn = currentBoardState.columns.find(
      (col) => col.name === editTaskStatus,
    );

    if (sourceColumn && targetColumn) {
      let updatedTask: Task = {
        title: editTaskTitle,
        description: editTaskDescription,
        status: editTaskStatus,
        subtasks: editTaskSubtasks.filter((s) => s.title.trim() !== ""),
      };

      if (sourceColumn.name !== editTaskStatus) {
        sourceColumn.tasks = sourceColumn.tasks.filter(
          (t) => t.title !== selectedTask?.title,
        );
        targetColumn.tasks.push(updatedTask);
      } else {
        let taskIndex = sourceColumn.tasks.findIndex(
          (t) => t.title === selectedTask?.title,
        );
        sourceColumn.tasks[taskIndex] = updatedTask;
      }

      setBoards(updatedBoards);
      setSelectedTask(null);
      setIsEditTaskMode(false);
    }
  };

  let handleDeleteTask = () => {
    if (!selectedTask) return;
    let updatedBoards = [...boards];
    let currentBoardState = updatedBoards[activeBoardIndex];
    let column = currentBoardState.columns.find((col) =>
      col.tasks.some((t) => t.title === selectedTask?.title),
    );
    if (column) {
      column.tasks = column.tasks.filter((t) => t.title !== selectedTask.title);
      setBoards(updatedBoards);
      setSelectedTask(null);
      setIsDeleteTaskModalOpen(false);
    }
  };

  let handleDeleteBoard = () => {
    let updatedBoards = boards.filter((_, index) => index !== activeBoardIndex);
    setBoards(updatedBoards);
    setActiveBoardIndex(0);
    setIsDeleteBoardModalOpen(false);
    setShowBoardMoreMenu(false);
  };

  let handleBoardSubmit = () => {
    let nameErr = newBoardName.trim() === "";
    let colErr: number[] = [];
    newBoardColumns.forEach((col, idx) => {
      if (col.trim() === "") colErr.push(idx);
    });

    if (nameErr || colErr.length > 0) {
      setErrors((prev) => ({ ...prev, boardName: nameErr, columns: colErr }));
      return;
    }

    let updatedBoards = [...boards];
    if (boardModalMode === "create") {
      let newBoard: Board = {
        name: newBoardName,
        columns: newBoardColumns.map((name) => ({ name, tasks: [] })),
      };
      updatedBoards.push(newBoard);
      setBoards(updatedBoards);
      setActiveBoardIndex(updatedBoards.length - 1);
    } else {
      let activeBoard = updatedBoards[activeBoardIndex];
      activeBoard.name = newBoardName;
      activeBoard.columns = newBoardColumns.map((name, idx) => {
        let existingCol = activeBoard.columns[idx];
        return { name, tasks: existingCol ? existingCol.tasks : [] };
      });
      setBoards(updatedBoards);
    }

    setIsBoardModalOpen(false);
    setNewBoardName("");
    setNewBoardColumns(["Todo", "Doing"]);
    setErrors((prev) => ({ ...prev, boardName: false, columns: [] }));
  };

  let openCreateBoard = () => {
    setBoardModalMode("create");
    setNewBoardName("");
    setNewBoardColumns(["Todo", "Doing"]);
    setIsBoardModalOpen(true);
  };

  let openEditBoard = () => {
    setBoardModalMode("edit");
    setNewBoardName(currentBoard.name);
    setNewBoardColumns(currentBoard.columns.map((c) => c.name));
    setIsBoardModalOpen(true);
    setShowBoardMoreMenu(false);
  };

  return (
    <div
      className={`app-wrapper ${!isSidePanelVisible ? "hide-menu" : ""} ${isDarkTheme ? "dark-theme" : "light-theme"}`}
    >
      <aside className="side-panel">
        <div className="side-panel-content">
          <div>
            <div className="logo-container">
              <img src={isDarkTheme ? logoLight : logoDark} alt="logo" />
            </div>
            <div className="board-count">ALL BOARDS ({boards.length})</div>
            <nav>
              {boards.map((board, index) => (
                <div
                  key={board.name}
                  className={`board-link ${activeBoardIndex === index ? "active-link" : ""}`}
                  onClick={() => setActiveBoardIndex(index)}
                >
                  <img src={iconBoard} alt="board" />
                  {board.name}
                </div>
              ))}
              <div className="board-link create-link" onClick={openCreateBoard}>
                <img src={iconBoard} alt="create" className="purple-filter" />+
                Create New Board
              </div>
            </nav>
          </div>
          <div className="panel-bottom">
            <div className="mode-switch">
              <img src={iconLight} alt="light" />
              <div
                className="switch-bg"
                onClick={() => setIsDarkTheme(!isDarkTheme)}
              >
                <div
                  className={`switch-circle ${isDarkTheme ? "circle-right" : "circle-left"}`}
                ></div>
              </div>
              <img src={iconDark} alt="dark" />
            </div>
            <button
              className="toggle-visibility-btn"
              onClick={() => setIsSidePanelVisible(false)}
            >
              <img src={iconHide} alt="hide" />
              Hide Sidebar
            </button>
          </div>
        </div>
      </aside>

      {!isSidePanelVisible && (
        <button
          className="open-sidebar-tab"
          onClick={() => setIsSidePanelVisible(true)}
        >
          <img src={iconShow} alt="show" />
        </button>
      )}

      <main className="content-area">
        <header className="main-header">
          <h1 className="project-title">{currentBoard?.name}</h1>
          <div className="header-right">
            <button
              className="primary-btn"
              onClick={() => setIsAddTaskModalOpen(true)}
            >
              + Add New Task
            </button>
            <div className="ellipsis-container">
              <button
                className="more-btn"
                onClick={() => setShowBoardMoreMenu(!showBoardMoreMenu)}
              >
                <img src={iconEllipsis} alt="options" />
              </button>
              {showBoardMoreMenu && (
                <div className="context-menu board-menu">
                  <button
                    className="menu-item edit-item"
                    onClick={openEditBoard}
                  >
                    Edit Board
                  </button>
                  <button
                    className="menu-item delete-item"
                    onClick={() => {
                      setIsDeleteBoardModalOpen(true);
                      setShowBoardMoreMenu(false);
                    }}
                  >
                    Delete Board
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

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
                  <div
                    key={taskIdx}
                    className="task-card"
                    onClick={() => handleCardClick(task)}
                  >
                    <h3 className="task-title">{task.title}</h3>
                    <p className="subtasks-text">
                      {task.subtasks.filter((s) => s.isCompleted).length} of{" "}
                      {task.subtasks.length} subtasks
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="new-column-placeholder" onClick={openEditBoard}>
            + New Column
          </div>
        </div>
      </main>

      {selectedTask && !isEditTaskMode && !isDeleteTaskModalOpen && (
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
      )}

      {isBoardModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsBoardModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {boardModalMode === "create" ? "Add New Board" : "Edit Board"}
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
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Board Columns</label>
              {newBoardColumns.map((col, i) => (
                <div key={i} className="subtask-input-row">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      className={`modal-input ${errors.columns.includes(i) ? "input-error" : ""}`}
                      value={col}
                      onChange={(e) => {
                        let updated = [...newBoardColumns];
                        updated[i] = e.target.value;
                        setNewBoardColumns(updated);
                      }}
                    />
                    {errors.columns.includes(i) && (
                      <span className="error-text">Can't be empty</span>
                    )}
                  </div>
                  <img
                    src={iconCross}
                    alt="remove"
                    className="remove-subtask"
                    onClick={() =>
                      setNewBoardColumns(
                        newBoardColumns.filter((_, idx) => idx !== i),
                      )
                    }
                  />
                </div>
              ))}
              <button
                className="secondary-btn"
                onClick={() => setNewBoardColumns([...newBoardColumns, ""])}
              >
                + Add New Column
              </button>
            </div>
            <button
              className="primary-btn full-width"
              onClick={handleBoardSubmit}
            >
              {boardModalMode === "create"
                ? "Create New Board"
                : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {isAddTaskModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsAddTaskModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add New Task</h2>
            <div className="input-group">
              <div className="label-container">
                <label className="input-label">Title</label>
                {errors.title && (
                  <span className="error-text">Can't be empty</span>
                )}
              </div>
              <input
                type="text"
                className={`modal-input ${errors.title ? "input-error" : ""}`}
                placeholder="e.g. Take coffee break"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea
                className="modal-input modal-textarea"
                placeholder="e.g. It's always good to take a break."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Subtasks</label>
              {newTaskSubtasks.map((sub, i) => (
                <div key={i} className="subtask-input-row">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      className={`modal-input ${errors.subtasks.includes(i) ? "input-error" : ""}`}
                      placeholder="e.g. Make coffee"
                      value={sub}
                      onChange={(e) => {
                        let updated = [...newTaskSubtasks];
                        updated[i] = e.target.value;
                        setNewTaskSubtasks(updated);
                      }}
                    />
                    {errors.subtasks.includes(i) && (
                      <span className="error-text">Can't be empty</span>
                    )}
                  </div>
                  <img
                    src={iconCross}
                    alt="remove"
                    className="remove-subtask"
                    onClick={() =>
                      setNewTaskSubtasks(
                        newTaskSubtasks.filter((_, idx) => idx !== i),
                      )
                    }
                  />
                </div>
              ))}
              <button
                className="secondary-btn"
                onClick={() => setNewTaskSubtasks([...newTaskSubtasks, ""])}
              >
                + Add New Subtask
              </button>
            </div>
            <div className="input-group">
              <label className="input-label">Status</label>
              <div className="dropdown-container">
                <div
                  className="status-dropdown"
                  onClick={() =>
                    setShowAddTaskStatusDropdown(!showAddTaskStatusDropdown)
                  }
                >
                  {newTaskStatus}
                  <img
                    src={
                      showAddTaskStatusDropdown
                        ? iconChevronUp
                        : iconChevronDown
                    }
                    alt="chevron"
                  />
                </div>
                {showAddTaskStatusDropdown && (
                  <div className="dropdown-options">
                    {currentBoard.columns.map((col) => (
                      <div
                        key={col.name}
                        className="option"
                        onClick={() => {
                          setNewTaskStatus(col.name);
                          setShowAddTaskStatusDropdown(false);
                        }}
                      >
                        {col.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              className="primary-btn full-width"
              onClick={handleCreateTask}
            >
              Create Task
            </button>
          </div>
        </div>
      )}

      {isEditTaskMode && selectedTask && (
        <div
          className="modal-backdrop"
          onClick={() => setIsEditTaskMode(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Edit Task</h2>
            <div className="input-group">
              <label className="input-label">Title</label>
              <input
                type="text"
                className="modal-input"
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea
                className="modal-input modal-textarea"
                value={editTaskDescription}
                onChange={(e) => setEditTaskDescription(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Subtasks</label>
              {editTaskSubtasks.map((sub, i) => (
                <div key={i} className="subtask-input-row">
                  <input
                    type="text"
                    className="modal-input"
                    value={sub.title}
                    onChange={(e) => {
                      let updated = [...editTaskSubtasks];
                      updated[i].title = e.target.value;
                      setEditTaskSubtasks(updated);
                    }}
                  />
                  <img
                    src={iconCross}
                    alt="remove"
                    className="remove-subtask"
                    onClick={() =>
                      setEditTaskSubtasks(
                        editTaskSubtasks.filter((_, idx) => idx !== i),
                      )
                    }
                  />
                </div>
              ))}
              <button
                className="secondary-btn"
                onClick={() =>
                  setEditTaskSubtasks([
                    ...editTaskSubtasks,
                    { title: "", isCompleted: false },
                  ])
                }
              >
                + Add New Subtask
              </button>
            </div>
            <div className="input-group">
              <label className="input-label">Status</label>
              <div className="dropdown-container">
                <div
                  className="status-dropdown"
                  onClick={() =>
                    setShowEditStatusDropdown(!showEditStatusDropdown)
                  }
                >
                  {editTaskStatus}
                  <img
                    src={
                      showEditStatusDropdown ? iconChevronUp : iconChevronDown
                    }
                    alt="chevron"
                  />
                </div>
                {showEditStatusDropdown && (
                  <div className="dropdown-options">
                    {currentBoard.columns.map((col) => (
                      <div
                        key={col.name}
                        className="option"
                        onClick={() => {
                          setEditTaskStatus(col.name);
                          setShowEditStatusDropdown(false);
                        }}
                      >
                        {col.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              className="primary-btn full-width"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {isDeleteTaskModalOpen && selectedTask && (
        <div
          className="modal-backdrop"
          onClick={() => setIsDeleteTaskModalOpen(false)}
        >
          <div
            className="modal-content delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title delete-title">Delete this task?</h2>
            <p className="delete-text">
              Are you sure you want to delete the '{selectedTask.title}' task?
            </p>
            <div className="delete-actions">
              <button className="destructive-btn" onClick={handleDeleteTask}>
                Delete
              </button>
              <button
                className="secondary-btn"
                onClick={() => setIsDeleteTaskModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteBoardModalOpen && currentBoard && (
        <div
          className="modal-backdrop"
          onClick={() => setIsDeleteBoardModalOpen(false)}
        >
          <div
            className="modal-content delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title delete-title">Delete this board?</h2>
            <p className="delete-text">
              Are you sure you want to delete the '{currentBoard.name}' board?
            </p>
            <div className="delete-actions">
              <button className="destructive-btn" onClick={handleDeleteBoard}>
                Delete
              </button>
              <button
                className="secondary-btn"
                onClick={() => setIsDeleteBoardModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;