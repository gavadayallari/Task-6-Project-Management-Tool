import React, { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  Clock,
  MoreVertical,
  Flame,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Trash2,
  Edit,
  Tag,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { moveTaskStatus } = useProject();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Priority metadata
  const priorityConfig = {
    urgent: {
      label: 'Urgent',
      icon: Flame,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      iconColor: 'text-rose-600',
    },
    high: {
      label: 'High',
      icon: ArrowUp,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      iconColor: 'text-amber-600',
    },
    medium: {
      label: 'Medium',
      icon: ArrowRight,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      iconColor: 'text-blue-600',
    },
    low: {
      label: 'Low',
      icon: ArrowDown,
      color: 'bg-slate-50 text-slate-600 border-slate-200',
      iconColor: 'text-slate-500',
    },
  };

  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const PriorityIcon = priority.icon;

  // Subtask calculations
  const totalSubtasks = task.checklist ? task.checklist.length : 0;
  const completedSubtasks = task.checklist
    ? task.checklist.filter((i) => i.isCompleted).length
    : 0;
  const subtaskPercentage =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Due date checks
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'done';
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  // Drag handlers
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Status transition options for 1-click move
  const statusOptions = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'in_review', label: 'In Review' },
    { value: 'done', label: 'Done' },
  ];

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onEdit(task)}
      className="group relative bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-300 transition-all cursor-pointer active:cursor-grabbing select-none"
    >
      {/* Top row: TaskKey & Priority Badge & Quick Action Menu */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            {task.taskKey || 'TASK'}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${priority.color}`}
          >
            <PriorityIcon className={`w-3 h-3 ${priority.iconColor}`} />
            {priority.label}
          </span>
        </div>

        {/* 3-dots Quick Menu */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40 animate-fade-in text-xs">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Move to
                </div>
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    disabled={task.status === opt.value}
                    onClick={() => {
                      moveTaskStatus(task._id, opt.value);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors ${
                      task.status === opt.value
                        ? 'text-brand-600 font-bold bg-brand-50/50'
                        : 'text-slate-700'
                    }`}
                  >
                    • {opt.label}
                  </button>
                ))}

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onEdit(task);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                >
                  <Edit className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDelete(task);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete Task</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 mb-1.5">
        {task.title}
      </h4>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {task.labels.slice(0, 3).map((lbl, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600"
            >
              <Tag className="w-2.5 h-2.5 text-slate-400" />
              {lbl}
            </span>
          ))}
          {task.labels.length > 3 && (
            <span className="text-[10px] text-slate-400 font-medium">
              +{task.labels.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Subtasks Progress Bar */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-slate-400" />
              <span>Subtasks</span>
            </span>
            <span>
              {completedSubtasks}/{totalSubtasks} ({subtaskPercentage}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                subtaskPercentage === 100 ? 'bg-emerald-500' : 'bg-brand-500'
              }`}
              style={{ width: `${subtaskPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Footer: Due Date & Assignee Avatars */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 mt-2">
        {/* Due Date Indicator */}
        <div>
          {formattedDueDate ? (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold ${
                isOverdue
                  ? 'bg-rose-100 text-rose-800 animate-pulse'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Calendar className="w-3 h-3" />
              {formattedDueDate}
              {isOverdue && ' (Overdue)'}
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> No deadline
            </span>
          )}
        </div>

        {/* Assignees */}
        <div className="flex items-center -space-x-1.5 overflow-hidden">
          {task.assignees && task.assignees.length > 0 ? (
            task.assignees.slice(0, 3).map((assignee) => (
              <div
                key={assignee._id}
                title={assignee.name}
                className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-sm"
                style={{ backgroundColor: assignee.color || '#4F46E5' }}
              >
                {assignee.name ? assignee.name.charAt(0).toUpperCase() : 'U'}
              </div>
            ))
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 text-[10px] font-medium flex items-center justify-center ring-2 ring-white">
              ?
            </div>
          )}
          {task.assignees && task.assignees.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
