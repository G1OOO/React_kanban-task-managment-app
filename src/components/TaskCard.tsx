import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  let completedSubtasks = task.subtasks.filter((s) => s.isCompleted).length;

  return (
    <div className="task-card" onClick={onClick}>
      <h3 className="task-title">{task.title}</h3>
      <p className="subtasks-text">
        {completedSubtasks} of {task.subtasks.length} subtasks
      </p>
    </div>
  );
};

export default TaskCard;