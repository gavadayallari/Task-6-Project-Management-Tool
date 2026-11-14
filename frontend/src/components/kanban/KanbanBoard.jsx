import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Flame,
  ArrowUpDown,
  RotateCcw,
  Plus,
  Users,
} from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import ConfirmModal from '../common/ConfirmModal';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

const KanbanBoard = () => {
  const {
    tasks,
    activeProject,
    openTaskModal,
    refreshTasks,
    refreshStats,
    teamMembers,
  } = useProject();
  const toast = useToast();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  // Deletion modal state
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Columns definition
  const columns = [
    { key: 'backlog', title: 'Backlog' },
    { key: 'todo', title: 'To Do' },
    { key: 'in_progress', title: 'In Progress' },
    { key: 'in_review', title: 'In Review' },
    { key: 'done', title: 'Done' },
  ];

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search
      const matchesSearch =
        searchTerm === '' ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.taskKey && task.taskKey.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Priority
      const matchesPriority =
        priorityFilter === 'all' || task.priority === priorityFilter;

      // Assignee
      const matchesAssignee =
        assigneeFilter === 'all' ||
        (task.assignees &&
          task.assignees.some((a) => a._id === assigneeFilter || a === assigneeFilter));

      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [tasks, searchTerm, priorityFilter, assigneeFilter]);

  // Tasks grouped by column
  const tasksByColumn = useMemo(() => {
    const map = {
      backlog: [],
      todo: [],
      in_progress: [],
      in_review: [],
      done: [],
    };

    filteredTasks.forEach((task) => {
      const col = task.status || 'todo';
      if (map[col]) {
        map[col].push(task);
      } else {
        map.todo.push(task);
      }
    });

    return map;
  }, [filteredTasks]);

  // Handle task deletion
  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/tasks/${taskToDelete._id}`);
      if (res.data.success) {
        toast.success(`Task ${taskToDelete.taskKey || ''} deleted`);
        setTaskToDelete(null);
        if (activeProject) refreshTasks(activeProject._id);
        refreshStats();
      }
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setPriorityFilter('all');
    setAssigneeFilter('all');
  };

  const isFiltered =
    searchTerm !== '' || priorityFilter !== 'all' || assigneeFilter !== 'all';

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Left: Search input */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks by title, key, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right: Dropdown Filters & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <Flame className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs font-semibold bg-transparent border-none text-slate-700 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Assignee filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="text-xs font-semibold bg-transparent border-none text-slate-700 focus:outline-none max-w-[120px] truncate"
            >
              <option value="all">All Assignees</option>
              {teamMembers.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          {/* New Task button */}
          <button
            onClick={() => openTaskModal(null, 'todo')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 ml-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Columns Horizontal Scrolling Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex items-start gap-4 min-w-max">
          {columns.map((col) => (
            <KanbanColumn
              key={col.key}
              statusKey={col.key}
              title={col.title}
              tasks={tasksByColumn[col.key] || []}
              onEditTask={(task) => openTaskModal(task)}
              onDeleteTask={(task) => setTaskToDelete(task)}
            />
          ))}
        </div>
      </div>

      {/* Confirm Task Deletion Modal */}
      <ConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete task "${taskToDelete?.taskKey}: ${taskToDelete?.title}"? All associated checklist items and comments will also be permanently deleted.`}
        confirmText="Delete Task"
        loading={isDeleting}
      />
    </div>
  );
};

export default KanbanBoard;
