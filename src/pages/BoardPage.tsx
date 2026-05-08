import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import rawData from "../data.json";
import type { Board, Task, Subtask } from "../types";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BoardDisplay from "../components/BoardDisplay";
import TaskDetailsModal from "../components/modals/TaskDetailsModal";
import TaskFormModal from "../components/modals/TaskFormModal";
import BoardFormModal from "../components/modals/BoardFormModal";
import DeleteModal from "../components/modals/DeleteModal";
import ShowSidebar from "../assets/icon-show-sidebar.svg";

const BoardPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  let [boards, setBoards] = useState<Board[]>(rawData.boards);
  let [activeBoardIndex, setActiveBoardIndex] = useState(0);
  let [isSidePanelVisible, setIsSidePanelVisible] = useState(true);
  let [isDarkTheme, setIsDarkTheme] = useState(true);

  let [taskTitle, setTaskTitle] = useState("");
  let [taskDescription, setTaskDescription] = useState("");
  let [taskSubtasks, setTaskSubtasks] = useState<Subtask[]>([]);
  let [taskStatus, setTaskStatus] = useState("");
  let [taskErrors, setTaskErrors] = useState({ title: false, subtasks: [] as number[] });

  let [boardName, setBoardName] = useState("");
  let [boardColumns, setBoardColumns] = useState<string[]>([]);
  let [boardErrors, setBoardErrors] = useState({ boardName: false, columns: [] as number[] });

  let [selectedTask, setSelectedTask] = useState<Task | null>(null);
  let [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  let [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  let [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  let [boardModalMode, setBoardModalMode] = useState<"create" | "edit">("create");
  let [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);
  let [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);

  let [showBoardMoreMenu, setShowBoardMoreMenu] = useState(false);
  let [showTaskMoreMenu, setShowTaskMoreMenu] = useState(false);
  let [showStatusDropdown, setShowStatusDropdown] = useState(false);

  let currentBoard = boards[activeBoardIndex];

  useEffect(() => {
    if (boardId && boards.length > 0) {
      const index = boards.findIndex((b) => b.name.toLowerCase().replace(/\s+/g, "-") === boardId);
      if (index !== -1) setActiveBoardIndex(index);
    }
  }, [boardId, boards]);

  const handleStatusChange = (newStatus: string) => {
    if (!selectedTask || !currentBoard || selectedTask.status === newStatus) return;
    let updatedBoards = [...boards];
    let board = updatedBoards[activeBoardIndex];
    let oldColumn = board.columns.find(col => col.name === selectedTask.status);
    let newColumn = board.columns.find(col => col.name === newStatus);

    if (oldColumn && newColumn) {
      oldColumn.tasks = oldColumn.tasks.filter(t => t.title !== selectedTask.title);
      let updatedTask = { ...selectedTask, status: newStatus };
      newColumn.tasks.push(updatedTask);
      setSelectedTask(updatedTask);
    }
    setBoards(updatedBoards);
    setShowStatusDropdown(false);
  };

  const toggleSubtask = (subtaskIndex: number) => {
    if (!selectedTask || !currentBoard) return;
    let updatedBoards = [...boards];
    let board = updatedBoards[activeBoardIndex];
    for (let column of board.columns) {
      let task = column.tasks.find(t => t.title === selectedTask.title);
      if (task) {
        task.subtasks[subtaskIndex].isCompleted = !task.subtasks[subtaskIndex].isCompleted;
        setSelectedTask({ ...task });
        break;
      }
    }
    setBoards(updatedBoards);
  };

  const handleDeleteBoard = () => {
    const updatedBoards = boards.filter((_, i) => i !== activeBoardIndex);
    setBoards(updatedBoards);
    setIsDeleteBoardModalOpen(false);
    setActiveBoardIndex(0);
    navigate("/dashboard");
  };

  const handleDeleteTask = () => {
    if (!selectedTask || !currentBoard) return;
    const updatedBoards = [...boards];
    const column = updatedBoards[activeBoardIndex].columns.find((col) => col.name === selectedTask.status);
    if (column) {
      column.tasks = column.tasks.filter((t) => t.title !== selectedTask.title);
    }
    setBoards(updatedBoards);
    setSelectedTask(null);
    setIsDeleteTaskModalOpen(false);
  };

  const handleOpenEditTask = () => {
    if (!selectedTask) return;
    setTaskTitle(selectedTask.title);
    setTaskDescription(selectedTask.description || "");
    setTaskSubtasks([...selectedTask.subtasks]);
    setTaskStatus(selectedTask.status);
    setIsEditTaskModalOpen(true);
    setShowTaskMoreMenu(false);
  };

  const resetTaskForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskSubtasks([]);
    setTaskStatus("");
    setTaskErrors({ title: false, subtasks: [] });
  };

  const handleTaskSubmit = () => {
    let isTitleInvalid = taskTitle.trim() === "";
    let invalidSubs = taskSubtasks.map((sub, i) => (sub.title.trim() === "" ? i : -1)).filter((i) => i !== -1);
    if (isTitleInvalid || invalidSubs.length > 0) {
      setTaskErrors({ title: isTitleInvalid, subtasks: invalidSubs });
      return;
    }

    const updatedBoards = [...boards];
    const board = updatedBoards[activeBoardIndex];
    const newTask: Task = { title: taskTitle, description: taskDescription, status: taskStatus, subtasks: taskSubtasks };

    if (isEditTaskModalOpen && selectedTask) {
      const oldCol = board.columns.find(c => c.name === selectedTask.status);
      if (oldCol) oldCol.tasks = oldCol.tasks.filter(t => t.title !== selectedTask.title);
      const newCol = board.columns.find(c => c.name === taskStatus);
      if (newCol) newCol.tasks.push(newTask);
    } else {
      const targetColumn = board.columns.find((col) => col.name === (taskStatus || board.columns[0].name));
      if (targetColumn) targetColumn.tasks.push(newTask);
    }

    setBoards(updatedBoards);
    setIsAddTaskModalOpen(false);
    setIsEditTaskModalOpen(false);
    setSelectedTask(null);
    resetTaskForm();
  };

  const handleBoardSubmit = () => {
    let isNameInvalid = boardName.trim() === "";
    let invalidCols = boardColumns.map((col, i) => (col.trim() === "" ? i : -1)).filter((i) => i !== -1);
    if (isNameInvalid || invalidCols.length > 0) {
      setBoardErrors({ boardName: isNameInvalid, columns: invalidCols });
      return;
    }

    let updatedBoards = [...boards];
    if (boardModalMode === "create") {
      const newBoard = { name: boardName, columns: boardColumns.map(c => ({ name: c, tasks: [] })) };
      updatedBoards.push(newBoard);
      setBoards(updatedBoards);
      navigate(`/dashboard/${boardName.toLowerCase().replace(/\s+/g, "-")}`);
    } else {
      updatedBoards[activeBoardIndex].name = boardName;
      updatedBoards[activeBoardIndex].columns = boardColumns.map((name) => {
        const existing = updatedBoards[activeBoardIndex].columns.find(c => c.name === name);
        return existing ? existing : { name, tasks: [] };
      });
      setBoards(updatedBoards);
    }
    setIsBoardModalOpen(false);
  };

  return (
    <div className={`app-wrapper ${isDarkTheme ? "dark" : "light"} ${!isSidePanelVisible ? "hide-menu" : ""}`}>
      <Sidebar
        boards={boards}
        activeBoardIndex={activeBoardIndex}
        setActiveBoardIndex={(idx) => {
          setActiveBoardIndex(idx);
          navigate(`/dashboard/${boards[idx].name.toLowerCase().replace(/\s+/g, "-")}`);
        }}
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
        setIsSidePanelVisible={setIsSidePanelVisible}
        openCreateBoard={() => {
          setBoardName("");
          setBoardColumns(["Todo", "Doing"]);
          setBoardModalMode("create");
          setIsBoardModalOpen(true);
        }}
      />

      {!isSidePanelVisible && (
        <button className="open-sidebar-tab" onClick={() => setIsSidePanelVisible(true)}>
          <img src={ShowSidebar} alt="show sidebar" />
        </button>
      )}

      <main className="content-area">
        {boards.length > 0 ? (
          <>
            <Header
              currentBoard={currentBoard}
              setIsAddTaskModalOpen={() => { resetTaskForm(); setIsAddTaskModalOpen(true); }}
              showBoardMoreMenu={showBoardMoreMenu}
              setShowBoardMoreMenu={setShowBoardMoreMenu}
              openEditBoard={() => {
                setBoardName(currentBoard.name);
                setBoardColumns(currentBoard.columns.map(c => c.name));
                setBoardModalMode("edit");
                setIsBoardModalOpen(true);
              }}
              setIsDeleteBoardModalOpen={setIsDeleteBoardModalOpen}
            />
            <BoardDisplay
              currentBoard={currentBoard}
              handleCardClick={(task) => setSelectedTask(task)}
              openEditBoard={() => {
                setBoardName(currentBoard.name);
                setBoardColumns(currentBoard.columns.map(c => c.name));
                setBoardModalMode("edit");
                setIsBoardModalOpen(true);
              }}
            />
          </>
        ) : (
          <div className="empty-state">
            <p className="empty-p">This board is empty. Create a new column to get started.</p>
            <button className="primary-btn" onClick={() => {
              setBoardName("");
              setBoardColumns(["Todo", "Doing"]);
              setBoardModalMode("create");
              setIsBoardModalOpen(true);
            }}>+ Add New Board</button>
          </div>
        )}
      </main>

      {(isAddTaskModalOpen || isEditTaskModalOpen) && (
        <TaskFormModal
          mode={isEditTaskModalOpen ? "edit" : "create"}
          currentBoard={currentBoard}
          onClose={() => { setIsAddTaskModalOpen(false); setIsEditTaskModalOpen(false); }}
          onSubmit={handleTaskSubmit}
          title={taskTitle}
          setTitle={setTaskTitle}
          description={taskDescription}
          setDescription={setTaskDescription}
          subtasks={taskSubtasks}
          setSubtasks={setTaskSubtasks}
          status={taskStatus || currentBoard?.columns[0]?.name || ""}
          setStatus={setTaskStatus}
          showStatusDropdown={showStatusDropdown}
          setShowStatusDropdown={setShowStatusDropdown}
          errors={taskErrors}
        />
      )}

      {selectedTask && !isEditTaskModalOpen && (
        <TaskDetailsModal
          selectedTask={selectedTask}
          currentBoard={currentBoard}
          setSelectedTask={setSelectedTask}
          toggleSubtask={toggleSubtask}
          handleStatusChange={handleStatusChange}
          showStatusDropdown={showStatusDropdown}
          setShowStatusDropdown={setShowStatusDropdown}
          showTaskMoreMenu={showTaskMoreMenu}
          setShowTaskMoreMenu={setShowTaskMoreMenu}
          handleOpenEditTask={handleOpenEditTask}
          setIsDeleteTaskModalOpen={setIsDeleteTaskModalOpen}
        />
      )}

      {isBoardModalOpen && (
        <BoardFormModal
          mode={boardModalMode}
          onClose={() => setIsBoardModalOpen(false)}
          onSubmit={handleBoardSubmit}
          name={boardName}
          setName={setBoardName}
          columns={boardColumns}
          setColumns={setBoardColumns}
          errors={boardErrors}
        />
      )}

      {(isDeleteBoardModalOpen || isDeleteTaskModalOpen) && (
        <DeleteModal
          type={isDeleteBoardModalOpen ? "board" : "task"}
          title={isDeleteBoardModalOpen ? currentBoard?.name : selectedTask?.title || ""}
          onClose={() => { setIsDeleteBoardModalOpen(false); setIsDeleteTaskModalOpen(false); }}
          onDelete={isDeleteBoardModalOpen ? handleDeleteBoard : handleDeleteTask}
        />
      )}
    </div>
  );
};

export default BoardPage;