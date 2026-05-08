import type { Board } from "../types";
import iconEllipsis from "../assets/icon-vertical-ellipsis.svg";

interface HeaderProps {
  currentBoard: Board | undefined;
  setIsAddTaskModalOpen: (isOpen: boolean) => void;
  showBoardMoreMenu: boolean;
  setShowBoardMoreMenu: (isShow: boolean) => void;
  openEditBoard: () => void;
  setIsDeleteBoardModalOpen: (isOpen: boolean) => void;
}

const Header = ({
  currentBoard,
  setIsAddTaskModalOpen,
  showBoardMoreMenu,
  setShowBoardMoreMenu,
  openEditBoard,
  setIsDeleteBoardModalOpen,
}: HeaderProps) => {
  return (
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
              <button className="menu-item edit-item" onClick={openEditBoard}>
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
  );
};

export default Header;
