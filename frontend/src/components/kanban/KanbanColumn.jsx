import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, PlayCircle, Eye, AlertCircle } from 'lucide-react';
import TaskCard from './TaskCard';
import { useProject } from '../../context/ProjectContext';

const KanbanColumn = ({ statusKey, title, tasks = [], onEditTask, onDeleteTask }) => {
  const { moveTaskStatus, openTaskModal } = useProject();
  const [isDragOver, setIsDragOver] = useState(false);

  // Column style configuration
  const columnConfigs = {
    backlog: {
      dotColor: 'bg-slate-400',
      badgeBg: 'bg-slate-100 text-slate-700',
      icon: Clock,
      borderActive: 'border-slate-400 ring-2 ring-slate-200',
    },
    todo: {
      dotColor: 'bg-indigo-500',
      badgeBg: 'bg-indigo-50 text-indigo-700',
      icon: AlertCircle,
      borderActive: 'border-indigo-400 ring-2 ring-indigo-200',
    },
    in_progress: {
      dotColor: 'bg-amber-500',
      badgeBg: 'bg-amber-50 text-amber-700',
      icon: PlayCircle,
      borderActive: 'border-amber-400 ring-2 ring-amber-200',
    },
    in_review: {
      dotColor: 'bg-purple-500',
      badgeBg: 'bg-purple-50 text-purple-700',
      icon: Eye,
      borderActive: 'border-purple-400 ring-2 ring-purple-200',
    },
    done: {
      dotColor: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 text-emerald-700',
      icon: CheckCircle2,
      borderActive: 'border-emerald-400 ring-2 ring-emerald-200',
    },
  };

  const config = columnConfigs[statusKey] || columnConfigs.todo;
  const StatusIcon = config.icon;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTaskStatus(taskId, statusKey);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col bg-slate-100/70 rounded-2xl p-3 border transition-all ${
        isDragOver
          ? `bg-slate-100 ${config.borderActive}`
          : 'border-slate-200/70 hover:border-slate-300'
      } kanban-col-height w-80 shrink-0`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-1.5 mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {title}
          </h3>
          <span
            className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${config.badgeBg}`}
          >
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => openTaskModal(null, statusKey)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
          title={`Add task to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task List container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}

        {tasks.length === 0 && (
          <div className="h-44 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-4">
            <StatusIcon className="w-6 h-6 text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-400">No tasks in {title}</p>
            <button
              onClick={() => openTaskModal(null, statusKey)}
              className="mt-2 text-[11px] font-bold text-brand-600 hover:underline"
            >
              + Create one
            </button>
          </div>
        )}
      </div>

      {/* Bottom quick add button */}
      <div className="pt-2 mt-2 border-t border-slate-200/50">
        <button
          onClick={() => openTaskModal(null, statusKey)}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
};

export default KanbanColumn;
