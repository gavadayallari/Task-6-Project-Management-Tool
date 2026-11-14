import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckSquare,
  Clock,
  Plus,
  Trash2,
  Tag,
  UserCheck,
  Flame,
  MessageSquare,
  Send,
  X,
  Layers,
} from 'lucide-react';
import Modal from '../common/Modal';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

const TaskModal = () => {
  const {
    isTaskModalOpen,
    taskModalData,
    closeTaskModal,
    projects,
    activeProject,
    teamMembers,
    refreshTasks,
    refreshStats,
    refreshActivities,
  } = useProject();

  const { user } = useAuth();
  const toast = useToast();

  const isEditing = !!taskModalData.task;

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [assignees, setAssignees] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [spentHours, setSpentHours] = useState('');
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState('');

  // Checklist
  const [checklist, setChecklist] = useState([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Comments (for existing task)
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  // Submit loading state
  const [saving, setSaving] = useState(false);

  // Sync state when modal opens or task changes
  useEffect(() => {
    if (isTaskModalOpen) {
      if (taskModalData.task) {
        const t = taskModalData.task;
        setTitle(t.title || '');
        setDescription(t.description || '');
        setProjectId(t.project?._id || t.project || activeProject?._id || '');
        setStatus(t.status || 'todo');
        setPriority(t.priority || 'medium');
        setAssignees(
          t.assignees ? t.assignees.map((a) => (typeof a === 'object' ? a._id : a)) : []
        );
        setDueDate(t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : '');
        setEstimatedHours(t.estimatedHours ? String(t.estimatedHours) : '');
        setSpentHours(t.spentHours ? String(t.spentHours) : '');
        setLabels(t.labels || []);
        setChecklist(t.checklist || []);

        // Fetch task comments
        fetchComments(t._id);
      } else {
        // Reset for new task
        setTitle('');
        setDescription('');
        setProjectId(activeProject?._id || (projects[0] ? projects[0]._id : ''));
        setStatus(taskModalData.defaultStatus || 'todo');
        setPriority('medium');
        setAssignees([]);
        setDueDate('');
        setEstimatedHours('');
        setSpentHours('');
        setLabels([]);
        setChecklist([]);
        setComments([]);
      }
    }
  }, [isTaskModalOpen, taskModalData, activeProject, projects]);

  // Fetch comments
  const fetchComments = async (taskId) => {
    setLoadingComments(true);
    try {
      const res = await api.get(`/tasks/${taskId}`);
      if (res.data.success && res.data.comments) {
        setComments(res.data.comments);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  // Add tag
  const handleAddLabel = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const trimmed = newLabel.trim();
      if (trimmed && !labels.includes(trimmed)) {
        setLabels([...labels, trimmed]);
        setNewLabel('');
      }
    }
  };

  const removeLabel = (labelToRemove) => {
    setLabels(labels.filter((l) => l !== labelToRemove));
  };

  // Toggle assignee
  const toggleAssignee = (userId) => {
    if (assignees.includes(userId)) {
      setAssignees(assignees.filter((id) => id !== userId));
    } else {
      setAssignees([...assignees, userId]);
    }
  };

  // Checklist handlers
  const handleAddChecklistItem = (e) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    setChecklist([
      ...checklist,
      { text: newChecklistText.trim(), isCompleted: false },
    ]);
    setNewChecklistText('');
  };

  const toggleChecklistItem = (index) => {
    const updated = [...checklist];
    updated[index].isCompleted = !updated[index].isCompleted;
    setChecklist(updated);
  };

  const removeChecklistItem = (index) => {
    setChecklist(checklist.filter((_, idx) => idx !== index));
  };

  // Comment post
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !taskModalData.task) return;
    try {
      const res = await api.post(`/tasks/${taskModalData.task._id}/comments`, {
        content: newComment.trim(),
      });
      if (res.data.success) {
        setComments([...comments, res.data.comment]);
        setNewComment('');
        toast.success('Comment posted');
      }
    } catch (error) {
      toast.error('Failed to post comment');
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!taskModalData.task) return;
    try {
      const res = await api.delete(
        `/tasks/${taskModalData.task._id}/comments/${commentId}`
      );
      if (res.data.success) {
        setComments(comments.filter((c) => c._id !== commentId));
        toast.success('Comment deleted');
      }
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  // Submit task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    if (!projectId) {
      toast.error('Please select a project');
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      description: description.trim(),
      project: projectId,
      status,
      priority,
      assignees,
      dueDate: dueDate || null,
      estimatedHours: estimatedHours ? Number(estimatedHours) : 0,
      spentHours: spentHours ? Number(spentHours) : 0,
      labels,
      checklist,
    };

    try {
      if (isEditing) {
        const res = await api.put(`/tasks/${taskModalData.task._id}`, payload);
        if (res.data.success) {
          toast.success('Task updated successfully');
        }
      } else {
        const res = await api.post('/tasks', payload);
        if (res.data.success) {
          toast.success('Task created successfully');
        }
      }

      closeTaskModal();
      refreshTasks(projectId);
      refreshStats();
      refreshActivities();
    } catch (error) {
      const msg = error.response?.data?.message || 'Error saving task';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isTaskModalOpen}
      onClose={closeTaskModal}
      title={
        isEditing
          ? `Edit Task ${taskModalData.task?.taskKey ? `(${taskModalData.task.taskKey})` : ''}`
          : 'Create New Task'
      }
      subtitle={
        isEditing
          ? 'Update task specifications, checklist, and team discussion'
          : 'Define a new task, assign team members, and set milestone dates'
      }
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Task Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Task Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Implement OAuth2 Google Login flow"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all font-semibold text-slate-900"
          />
        </div>

        {/* Project, Status, Priority in 3 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Target Project */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Project <span className="text-rose-500">*</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 font-semibold"
            >
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title} ({p.key})
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Status Column
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 font-semibold"
            >
              <option value="backlog">Backlog</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 font-semibold"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent 🔥</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Description & Acceptance Criteria
          </label>
          <textarea
            rows="3"
            placeholder="Detailed description, requirements, API specs, and expected outcomes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all resize-none text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Due Date & Estimates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Estimated Hours
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 12"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Spent Hours
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 4"
              value={spentHours}
              onChange={(e) => setSpentHours(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
            />
          </div>
        </div>

        {/* Assignees multi-select pills */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Assign Team Members
          </label>
          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            {teamMembers.map((member) => {
              const isAssigned = assignees.includes(member._id);
              return (
                <button
                  type="button"
                  key={member._id}
                  onClick={() => toggleAssignee(member._id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isAssigned
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                    style={{
                      backgroundColor: isAssigned ? '#ffffff' : member.color || '#4F46E5',
                      color: isAssigned ? '#4F46E5' : '#ffffff',
                    }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{member.name}</span>
                  {isAssigned && <UserCheck className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Labels / Tags */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Labels & Tags
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {labels.map((lbl) => (
              <span
                key={lbl}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200"
              >
                <Tag className="w-3 h-3 text-brand-500" />
                {lbl}
                <button
                  type="button"
                  onClick={() => removeLabel(lbl)}
                  className="hover:text-rose-600 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add label (e.g. Bug, Frontend, API)... Press Enter"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={handleAddLabel}
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="button"
              onClick={handleAddLabel}
              className="px-3 py-1.5 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl border border-brand-200 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Checklist / Subtasks */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Checklist & Subtasks ({checklist.filter((i) => i.isCompleted).length}/
              {checklist.length})
            </label>
          </div>

          <div className="space-y-1.5 mb-2.5">
            {checklist.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={item.isCompleted}
                    onChange={() => toggleChecklistItem(idx)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span
                    className={`text-xs ${
                      item.isCompleted
                        ? 'line-through text-slate-400 font-medium'
                        : 'text-slate-800 font-semibold'
                    }`}
                  >
                    {item.text}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => removeChecklistItem(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add checklist subtask..."
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddChecklistItem(e);
              }}
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="button"
              onClick={handleAddChecklistItem}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Add Subtask
            </button>
          </div>
        </div>

        {/* Comments Section (Shown when editing an existing task) */}
        {isEditing && (
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-brand-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Discussion Thread ({comments.length})
              </h4>
            </div>

            {/* Comments List */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto mb-3">
              {comments.map((comm) => {
                const isAuthor = comm.author?._id === user?.id || comm.author === user?.id;
                return (
                  <div
                    key={comm._id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full text-white font-bold text-[9px] flex items-center justify-center"
                          style={{ backgroundColor: comm.author?.color || '#4F46E5' }}
                        >
                          {comm.author?.name ? comm.author.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="font-bold text-slate-900">
                          {comm.author?.name || 'Team Member'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(comm.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {isAuthor && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comm._id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-slate-700 leading-relaxed ml-7">{comm.content}</p>
                  </div>
                );
              })}

              {comments.length === 0 && (
                <p className="text-xs text-slate-400 italic">No comments yet. Start the conversation!</p>
              )}
            </div>

            {/* Post new comment */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Write a comment or status memo..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePostComment(e);
                }}
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={handlePostComment}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={closeTaskModal}
            disabled={saving}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm shadow-brand-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
