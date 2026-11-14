import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Flame,
  Calendar,
  CheckSquare,
  Clock,
  Trash2,
  Edit,
  ArrowUpDown,
  Tag,
  FolderKanban,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/common/ConfirmModal';
import api from '../api/axios';

const TaskListView = () => {
  const {
    tasks,
    projects,
    activeProject,
    openTaskModal,
    refreshTasks,
    refreshStats,
  } = useProject();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Deletion modal
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status badges configuration
  const statusStyles = {
    backlog: 'bg-slate-100 text-slate-700 border-slate-200',
    todo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
    in_review: 'bg-purple-50 text-purple-700 border-purple-200',
    done: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  // Priority styles
  const priorityStyles = {
    urgent: 'bg-rose-50 text-rose-700 border-rose-200',
    high: 'bg-amber-50 text-amber-700 border-amber-200',
    medium: 'bg-blue-50 text-blue-700 border-blue-200',
    low: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  // Filter & Sort
  const processedTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        const matchesSearch =
          searchTerm === '' ||
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.taskKey && t.taskKey.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus =
          statusFilter === 'all' || t.status === statusFilter;
        const matchesPriority =
          priorityFilter === 'all' || t.priority === priorityFilter;
        const matchesProject =
          projectFilter === 'all' ||
          (t.project?._id || t.project) === projectFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesProject;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (sortBy === 'dueDate') {
          valA = valA ? new Date(valA).getTime() : 0;
          valB = valB ? new Date(valB).getTime() : 0;
        } else if (sortBy === 'title') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [tasks, searchTerm, statusFilter, priorityFilter, projectFilter, sortBy, sortOrder]);

  // CSV Export feature
  const exportToCSV = () => {
    if (processedTasks.length === 0) {
      toast.warning('No tasks available to export');
      return;
    }

    const headers = [
      'Task Key',
      'Title',
      'Project',
      'Status',
      'Priority',
      'Assignees',
      'Due Date',
      'Subtasks Completed',
      'Total Subtasks',
    ];

    const rows = processedTasks.map((t) => [
      `"${t.taskKey || ''}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${t.project?.title || ''}"`,
      `"${t.status || ''}"`,
      `"${t.priority || ''}"`,
      `"${(t.assignees || []).map((a) => a.name).join('; ')}"`,
      `"${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'}"`,
      t.checklist ? t.checklist.filter((i) => i.isCompleted).length : 0,
      t.checklist ? t.checklist.length : 0,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `SyncFlow_Tasks_Export_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Tasks exported to CSV successfully');
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/tasks/${taskToDelete._id}`);
      if (res.data.success) {
        toast.success(`Task ${taskToDelete.taskKey || ''} deleted`);
        setTaskToDelete(null);
        refreshTasks(activeProject?._id);
        refreshStats();
      }
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in pb-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Task Directory & Sprints
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full view of all team tasks, deliverables, priorities, and deadlines
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => openTaskModal(null, 'todo')}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, key, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="done">Done</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Project filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none max-w-[140px] truncate"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>

          {/* Sort order toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
            title={`Sort order: ${sortOrder}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Key</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assignees</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedTasks.map((task) => {
                const isOverdue =
                  task.dueDate &&
                  new Date(task.dueDate) < new Date() &&
                  task.status !== 'done';

                return (
                  <tr
                    key={task._id}
                    onClick={() => openTaskModal(task)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Task Key */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                        {task.taskKey || 'TASK'}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors truncate">
                        {task.title}
                      </p>
                      {task.checklist && task.checklist.length > 0 && (
                        <span className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                          <CheckSquare className="w-3 h-3 text-slate-400" />
                          {task.checklist.filter((i) => i.isCompleted).length}/
                          {task.checklist.length} subtasks
                        </span>
                      )}
                    </td>

                    {/* Project */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: task.project?.color || '#4F46E5' }}
                        />
                        {task.project?.title || 'General'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                          statusStyles[task.status] || statusStyles.todo
                        }`}
                      >
                        {task.status?.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                          priorityStyles[task.priority] || priorityStyles.medium
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    {/* Assignees */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center -space-x-1">
                        {task.assignees?.map((a) => (
                          <div
                            key={a._id}
                            title={a.name}
                            className="w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white"
                            style={{ backgroundColor: a.color || '#4F46E5' }}
                          >
                            {a.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {task.dueDate ? (
                        <span
                          className={`inline-flex items-center gap-1 font-medium ${
                            isOverdue ? 'text-rose-600 font-bold' : ''
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openTaskModal(task)}
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Edit task"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setTaskToDelete(task)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {processedTasks.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 italic">
                    No tasks match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to permanently delete task "${taskToDelete?.taskKey}: ${taskToDelete?.title}"?`}
        confirmText="Delete Permanently"
        loading={isDeleting}
      />
    </div>
  );
};

export default TaskListView;
