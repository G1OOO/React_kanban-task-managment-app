import type { Board } from "../types";
import logoLight from "../assets/logo-light.svg";
import logoDark from "../assets/logo-dark.svg";
import iconBoard from "../assets/icon-board.svg";
import iconHide from "../assets/icon-hide-sidebar.svg";
import iconLight from "../assets/icon-light-theme.svg";
import iconDark from "../assets/icon-dark-theme.svg";

interface SidebarProps {
  boards: Board[];
  activeBoardIndex: number;
  setActiveBoardIndex: (index: number) => void;
  isDarkTheme: boolean;
  setIsDarkTheme: (isDark: boolean) => void;
  setIsSidePanelVisible: (isVisible: boolean) => void;
  openCreateBoard: () => void;
}

const Sidebar = ({
  boards,
  activeBoardIndex,
  setActiveBoardIndex,
  isDarkTheme,
  setIsDarkTheme,
  setIsSidePanelVisible,
  openCreateBoard,
}: SidebarProps) => {
  return (
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
  );
};

export default Sidebar;
